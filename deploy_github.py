#!/usr/bin/env python3
import os, subprocess, argparse
try:
    from github import Github
except Exception:
    Github = None
parser = argparse.ArgumentParser()
parser.add_argument('--repo', required=True, help='Nombre del repo en GitHub (ej: vivae)')
parser.add_argument('--dir', default='.', help='Directorio con el sitio')
parser.add_argument('--username', default=os.environ.get('GITHUB_USERNAME'), help='Usuario GitHub')
parser.add_argument('--token', default=os.environ.get('GITHUB_TOKEN'), help='Token personal (opcional)')
args = parser.parse_args()
repo_name = args.repo
local_dir = os.path.abspath(args.dir)
print('Directorio:', local_dir)
if not os.path.exists(os.path.join(local_dir,'.git')):
    subprocess.check_call(['git','init'], cwd=local_dir)
    subprocess.check_call(['git','checkout','-b','main'], cwd=local_dir)
subprocess.check_call(['git','add','.'], cwd=local_dir)
subprocess.check_call(['git','commit','-m','Initial commit from deploy script'], cwd=local_dir)
if args.token and args.username and Github:
    print('Creando repo en GitHub via API...')
    g = Github(args.token)
    user = g.get_user()
    try:
        user.create_repo(repo_name, private=False, description='Vivae - catálogo estático')
        print('Repo creado en GitHub.')
    except Exception as e:
        print('No se pudo crear repo (quizá ya existe):', e)
    remote_url = f'https://{args.username}:{args.token}@github.com/{args.username}/{repo_name}.git'
    try:
        subprocess.check_call(['git','remote','add','origin',remote_url], cwd=local_dir)
    except Exception:
        subprocess.check_call(['git','remote','set-url','origin',remote_url], cwd=local_dir)
    subprocess.check_call(['git','push','-u','origin','main'], cwd=local_dir)
    print('Push realizado.')
else:
    print('No se proporcionó token o PyGithub no está disponible. Por favor agrega remote manualmente:')
    print('git remote add origin https://github.com/<tu-usuario>/%s.git' % repo_name)
    print('git push -u origin main')