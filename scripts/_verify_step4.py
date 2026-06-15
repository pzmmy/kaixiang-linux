import json, glob, sys
app_dir = sys.argv[1]
verified_file = sys.argv[2]
apps = []
for f in sorted(glob.glob(f'{app_dir}/*.json')):
    with open(f) as fh:
        apps.extend(json.load(fh))
with open(verified_file) as f:
    verified = set(json.load(f).get('apps',[]))
unverified = []
for a in apps:
    if 'flatpak' in a.get('targets',{}):
        fp_id = a['targets']['flatpak'].strip()
        if fp_id and fp_id not in verified:
            unverified.append({'id': a['id'], 'flatpak_id': fp_id})
json.dump({'unverified': unverified, 'total': sum(1 for a in apps if 'flatpak' in a.get('targets',{}))}, sys.stdout)
