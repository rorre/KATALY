import subprocess
import os
from typing import Optional
from ghp_import import ghp_import

cname: Optional[str]
if os.path.exists("CNAME"):
    with open("CNAME", "r") as f:
        cname = f.read()
else:
    cname = None

res = subprocess.run("yarn build", shell=True)
res.check_returncode()

ghp_import(
    "build",
    mesg="Import from cmd",
    cname=cname,
    nojekyll=True,
    push=True,
    no_history=True,
)
