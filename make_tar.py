import tarfile
import os

def exclude_func(tarinfo):
    if 'node_modules' in tarinfo.name or 'dist' in tarinfo.name or '.git' in tarinfo.name or '.venv' in tarinfo.name or '__pycache__' in tarinfo.name:
        return None
    return tarinfo

print("Creating project.tar.gz...")
with tarfile.open("project.tar.gz", "w:gz") as tar:
    for name in ["job-portal-server-side", "digitefa-python", "docker-compose.yml", "digitefa_job_portal.sql", "db-init"]:
        if os.path.exists(name):
            print(f"Adding {name}...")
            tar.add(name, filter=exclude_func)
        else:
            print(f"Warning: {name} not found!")

print("Tar creation complete!")
