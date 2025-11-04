import os
import subprocess
from datetime import datetime

# Configuración básica
REPO_URL = "https://github.com/ANDRES-FLORIAN-SALAZAR/VIVAESHOP.git"
BRANCH = "main"

def run_command(command):
    """Ejecuta un comando en la terminal."""
    result = subprocess.run(command, shell=True, text=True, capture_output=True)
    if result.returncode != 0:
        print(f"⚠️ Error ejecutando: {command}")
        print(result.stderr)
    else:
        print(result.stdout)

def deploy():
    """Sube automáticamente los cambios a GitHub Pages."""
    print("\n🚀 INICIANDO DESPLIEGUE AUTOMÁTICO A GITHUB PAGES 🚀\n")

    # Guardar la fecha/hora actual para el commit
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Asegurar que estás en la rama correcta
    run_command(f"git checkout {BRANCH}")

    # Agregar todos los archivos
    run_command("git add .")

    # Crear el commit con fecha
    commit_message = f"Actualización automática del sitio - {now}"
    run_command(f'git commit -m "{commit_message}"')

    # Enviar los cambios
    run_command(f"git push origin {BRANCH}")

    print("\n✅ Sitio actualizado correctamente en GitHub Pages.")
    print("🔗 Revisa tu web en:")
    print("👉 https://andres-florian-salazar.github.io/VIVAESHOP/\n")

if __name__ == "__main__":
    deploy()
