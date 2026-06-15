#!/usr/bin/env bash
# ============================================================
# 安装命令 CI 验证脚本
# 检查所有应用的 targets 数据完整性
# ============================================================
set -euo pipefail

APP_DIR="src/lib/apps"
VERIFIED_FLATPAKS="src/lib/verified-flatpaks.json"
VERIFIED_SNAPS="src/lib/verified-snaps.json"

PASS=0
FAIL=0
TOTAL=0
SUSPICIOUS=()

red='\033[0;31m'
green='\033[0;32m'
yellow='\033[1;33m'
cyan='\033[0;36m'
nc='\033[0m'

pass() { echo -e "  ${green}✓${nc} $1"; ((PASS++)); }
fail() { echo -e "  ${red}✗${nc} $1"; ((FAIL++)); }
warn() { echo -e "  ${yellow}⚠${nc} $1"; }
info() { echo -e "  ${cyan}→${nc} $1"; }

echo ""
echo "=============================================="
echo "  安装目标验证报告"
echo "=============================================="
echo ""

echo -e "${cyan}[1/5] 检查 App 是否至少有一个可用目标${nc}"

for json_file in "$APP_DIR"/*.json; do
    filename=$(basename "$json_file")
    result=$(python3 -c "
import json, os
with open('$json_file') as f:
    apps = json.load(f)
TARGET_TYPES = ['ubuntu','debian','arch','fedora','opensuse','nix','homebrew','deepin','uos','flatpak','snap','npm','script']
failures = []
total = len(apps)
for app in apps:
    targets = app.get('targets',{})
    if not any(t in targets for t in TARGET_TYPES):
        failures.append(app.get('id','unknown'))
print(json.dumps({'total': total, 'failures': failures}))
")
    f_total=$(echo "$result" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['total'])")
    f_fail=$(echo "$result" | python3 -c "import json,sys; d=json.load(sys.stdin); print(json.dumps(d['failures']))")
    TOTAL=$((TOTAL + f_total))
    if [ "$f_fail" = "[]" ]; then
        pass "$filename: $f_total 个软件，全部有可用目标"
    else
        f_cnt=$(echo "$result" | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d['failures']))")
        fail "$filename: $f_total 个软件中 $f_cnt 个无可用目标"
        echo "$f_fail" | python3 -c "
import json,sys
for item in json.load(sys.stdin):
    print(f'          \033[1;33m{item}\033[0m 无可用安装目标')
" 2>/dev/null || true
    fi
done

echo ""
echo -e "${cyan}[2/5] 检查 script/npm 目标的命令是否为空${nc}"

result=$(python3 -c "
import json, glob
apps = []
for f in sorted(glob.glob('$APP_DIR/*.json')):
    with open(f) as fh:
        apps.extend(json.load(fh))
suspicious = []
for a in apps:
    for t in ['script','npm']:
        if t in a.get('targets',{}):
            val = a['targets'][t]
            if not val or not val.strip():
                suspicious.append({'id': a['id'], 'target': t})
print(json.dumps(suspicious, ensure_ascii=False))
")
s_cnt=$(echo "$result" | python3 -c "import json,sys; print(len(json.load(sys.stdin)))")
if [ "$s_cnt" = "0" ]; then
    pass "所有 script/npm 目标均有有效命令"
else
    fail "$s_cnt 个 script/npm 目标命令为空"
    echo "$result" | python3 -c "
import json,sys
for item in json.load(sys.stdin):
    print(f'          \033[1;33m{item["id"]}\033[0m: {item["target"]} 目标值为空')
"
fi

echo ""
echo -e "${cyan}[3/5] 检查 apt 包名在 packages.ubuntu.com 上是否可达${nc}"

result=$(python3 -c "
import json, glob
apps = []
for f in sorted(glob.glob('$APP_DIR/*.json')):
    with open(f) as fh:
        apps.extend(json.load(fh))
apt_pkg_names = set()
for a in apps:
    for t in ['ubuntu','debian','deepin','uos']:
        if t in a.get('targets',{}):
            val = a['targets'][t].strip()
            if val:
                apt_pkg_names.add(val)
print(json.dumps(sorted(apt_pkg_names)))
")
apt_total=$(echo "$result" | python3 -c "import json,sys; print(len(json.load(sys.stdin)))")
echo "  共 $apt_total 个 apt 包名需要检查"

URL_FAILURES=()
URL_CHECKS=0
while IFS= read -r pkg; do
    [ -z "$pkg" ] && continue
    URL_CHECKS=$((URL_CHECKS + 1))
    url="https://packages.ubuntu.com/search?keywords=${pkg}"
    http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$url" 2>/dev/null || echo "000")
    if [ "$http_code" = "200" ]; then
        has_result=$(curl -s --max-time 5 "$url" 2>/dev/null | grep -c "No packages found" || true)
        if [ "$has_result" -gt 0 ]; then
            URL_FAILURES+=("$pkg (HTTP 200 but no packages found)")
            info "$pkg → 页面无结果"
        fi
    elif [ "$http_code" = "404" ]; then
        URL_FAILURES+=("$pkg (HTTP 404)")
        info "$pkg → 404 未找到"
    elif [ "$http_code" != "000" ]; then
        URL_FAILURES+=("$pkg (HTTP $http_code)")
        info "$pkg → HTTP $http_code"
    fi
done < <(echo "$result" | python3 -c "import json,sys; print('\n'.join(json.load(sys.stdin)))")

if [ ${#URL_FAILURES[@]} -eq 0 ]; then
    pass "所有 $URL_CHECKS 个 apt 包名在 packages.ubuntu.com 上均可查"
else
    warn "${#URL_FAILURES[@]} 个 apt 包名在 packages.ubuntu.com 上检查异常（可能为网络抖动或包不存在）"
    for entry in "${URL_FAILURES[@]}"; do
        echo "          ${entry}"
    done
fi

echo ""
echo -e "${cyan}[4/5] 检查 Flatpak 是否在 verified-flatpaks.json 列表中${nc}"

result=$(python3 -c "
import json, glob
apps = []
for f in sorted(glob.glob('$APP_DIR/*.json')):
    with open(f) as fh:
        apps.extend(json.load(fh))
with open('$VERIFIED_FLATPAKS') as f:
    verified = set(json.load(f).get('apps',[]))
unverified = []
for a in apps:
    if 'flatpak' in a.get('targets',{}):
        fp_id = a['targets']['flatpak'].strip()
        if fp_id and fp_id not in verified:
            unverified.append({'id': a['id'], 'flatpak_id': fp_id})
print(json.dumps({'unverified': unverified, 'total': sum(1 for a in apps if 'flatpak' in a.get('targets',{}))}))
")
fp_unv_count=$(echo "$result" | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d['unverified']))")
fp_total=$(echo "$result" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['total'])")
info "共 $fp_total 个 Flatpak 目标"
if [ "$fp_unv_count" = "0" ]; then
    pass "所有 $fp_total 个 Flatpak 目标均在 verified-flatpaks.json 中"
else
    warn "$fp_unv_count / $fp_total 个 Flatpak 目标未在 verified-flatpaks.json 中找到"
    echo "$result" | python3 -c "
import json,sys
d = json.load(sys.stdin)
for item in d['unverified']:
    print(f'          \033[1;33m{item["id"]}\033[0m: {item["flatpak_id"]}')
"
import json,sys
d = json.load(sys.stdin)
for item in d['unverified']:
    print(f'{item["id"]}: {item["flatpak_id"]}')
")
fi

echo ""
echo -e "${cyan}[5/5] 检查 Snap 是否在 verified-snaps.json 列表中${nc}"

result=$(python3 -c "
import json, glob
apps = []
for f in sorted(glob.glob('$APP_DIR/*.json')):
    with open(f) as fh:
        apps.extend(json.load(fh))
with open('$VERIFIED_SNAPS') as f:
    verified = set(json.load(f).get('apps',[]))
unverified = []
for a in apps:
    if 'snap' in a.get('targets',{}):
        snap_name = a['targets']['snap'].split(' ')[0].strip()
        if snap_name and snap_name not in verified:
            unverified.append({'id': a['id'], 'snap_name': snap_name})
print(json.dumps({'unverified': unverified, 'total': sum(1 for a in apps if 'snap' in a.get('targets',{}))}))
")
snap_unv_count=$(echo "$result" | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d['unverified']))")
snap_total=$(echo "$result" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['total'])")
info "共 $snap_total 个 Snap 目标"
if [ "$snap_unv_count" = "0" ]; then
    pass "所有 $snap_total 个 Snap 目标均在 verified-snaps.json 中"
else
    warn "$snap_unv_count / $snap_total 个 Snap 目标未在 verified-snaps.json 中找到"
    echo "$result" | python3 -c "
import json,sys
d = json.load(sys.stdin)
for item in d['unverified']:
    print(f'          \033[1;33m{item["id"]}\033[0m: {item["snap_name"]}')
"
import json,sys
d = json.load(sys.stdin)
for item in d['unverified']:
    print(f'{item["id"]}: {item["snap_name"]}')
")
fi

echo ""
echo "=============================================="
echo "  验证汇总"
echo "=============================================="
echo ""
echo "  检查软件总数: $TOTAL"
echo -e "  通过: ${green}$PASS${nc}"
echo -e "  失败: ${red}$FAIL${nc}"

if [ ${#SUSPICIOUS[@]} -gt 0 ]; then
    echo ""
    echo -e "${yellow}⚠ 可疑条目清单:${nc}"
    for entry in "${SUSPICIOUS[@]}"; do
        echo "    $entry"
    done
    echo ""
    echo -e "${yellow}共 ${#SUSPICIOUS[@]} 条可疑项，建议逐项排查。${nc}"
fi

echo ""

if [ "$FAIL" -gt 0 ]; then
    echo -e "${red}❌ 验证未通过，${FAIL} 个项目失败${nc}"
    exit 1
fi

echo -e "${green}✅ 所有验证通过${nc}"
