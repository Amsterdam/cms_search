# HACK! We need to change the command in deploy-cms_search.yml (Openstack repo) to 'npm run serve'
import subprocess
subprocess.check_call("npm run serve", shell=True)
