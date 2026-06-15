import json, glob, sys
app_dir = sys.argv[1]
apps = []
for f in sorted(glob.glob(f'{app_dir}/*.json')):
    with open(f) as fh:
        apps.extend(json.load(fh))
suspicious = []
for a in apps:
    for t in ['script','npm']:
        if t in a.get('targets',{}):
            val = a['targets'][t]
            if not val or not val.strip():
                suspicious.append({'id': a['id'], 'target': t})
json.dump(suspicious, sys.stdout, ensure_ascii=False)
