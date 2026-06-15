import json, sys
with open(sys.argv[1]) as f:
    apps = json.load(f)
TARGET_TYPES = ['ubuntu','debian','arch','fedora','opensuse','nix','homebrew','deepin','uos','flatpak','snap','npm','script']
failures = []
total = len(apps)
for app in apps:
    targets = app.get('targets',{})
    if not any(t in targets for t in TARGET_TYPES):
        failures.append(app.get('id','unknown'))
json.dump({'total': total, 'failures': failures}, sys.stdout)
