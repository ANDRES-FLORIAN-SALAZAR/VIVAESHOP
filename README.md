        # Vivae - Catálogo estático para GitHub Pages

Este ZIP contiene la tienda Vivae lista para publicar en GitHub Pages.

## Pasos rápidos manuales
1. Crea un repo nuevo en GitHub llamado `vivae`.
2. Sube los archivos (arrastrar y soltar en la interfaz web o usar git).
3. En GitHub: Settings → Pages → Branch: `main` → Root `/` → Save.
4. Accede a: https://<tu-usuario>.github.io/vivae/

## Editar productos
- Edita `data/productos.json` para añadir, quitar o cambiar productos.
- Añade imágenes en la carpeta `img/`.

## Subir con Python (opcional)
- Instala dependencias: `pip install PyGithub`
- Exporta variables de entorno o edita `deploy_github.py` para agregar tu usuario y token.
- Ejecuta: `python deploy_github.py --repo vivae --dir . --username TU_USUARIO --token TU_TOKEN`

## WhatsApp
El botón de WhatsApp está configurado con tu número +57 3175535562 y los mensajes piden el nombre del cliente y dicen: "Un asesor se contactará contigo para seguir con la solicitud que has enviado." 

---
¡Listo! Si quieres que yo haga el push al repo, necesitaré tu permiso y token (no lo compartas aquí si no quieres).