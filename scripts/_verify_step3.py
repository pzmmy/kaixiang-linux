import json, glob, sys
app_dir = sys.argv[1]
apps = []
for f in sorted(glob.glob(f'{app_dir}/*.json')):
    with open(f) as fh:
        apps.extend(json.load(fh))
apt_pkg_names = set()
for a in apps:
    for t in ['ubuntu','debian','deepin','uos']:
        if t in a.get('targets',{}):
            val = a['targets'][t].strip()
            if val:
                apt_pkg_names.add(val)
json.dump(sorted(apt_pkg_names), sys.stdout)
