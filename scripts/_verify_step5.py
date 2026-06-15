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
    if 'snap' in a.get('targets',{}):
        snap_name = a['targets']['snap'].split(' ')[0].strip()
        if snap_name and snap_name not in verified:
            unverified.append({'id': a['id'], 'snap_name': snap_name})
json.dump({'unverified': unverified, 'total': sum(1 for a in apps if 'snap' in a.get('targets',{}))}, sys.stdout)
