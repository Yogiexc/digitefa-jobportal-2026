import tarfile
import os

def exclude_func(tarinfo):
    name = tarinfo.name.replace('\\', '/')
    if '/node_modules/' in name or name.endswith('node_modules') or \
       '/.git/' in name or name.endswith('.git') or \
       '/venv/' in name or name.endswith('venv') or \
       '/__pycache__/' in name or name.endswith('__pycache__') or \
       '/.vscode/' in name or name.endswith('.vscode') or \
       '/brain/' in name or name.endswith('brain'):
        return None
    return tarinfo

print("Creating project.tar.gz...")
with tarfile.open("project.tar.gz", "w:gz") as tar:
    for item in ["job-portal-server-side", "digitefa-python", "docker-compose.yml", "digitefa_job_portal.sql", "db-init"]:
        if os.path.exists(item):
            print(f"Adding {item}...")
            tar.add(item, filter=exclude_func)

print("Tar creation complete!")
