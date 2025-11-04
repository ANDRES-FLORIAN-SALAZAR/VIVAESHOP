<div align="center">
  <img src="img/vivae.jpg" alt="VIVAE Logo" width="200">
  <h1>VIVAE - Tienda de Moda Elegante</h1>
  <p>Tienda en línea de moda con diseño moderno y responsivo</p>
  
  [![GitHub license](https://img.shields.io/github/license/ANDRES-FLORIAN-SALAZAR/VIVAE-SHOP?style=for-the-badge)](https://github.com/ANDRES-FLORIAN-SALAZAR/VIVAE-SHOP/blob/main/LICENSE)
  [![GitHub stars](https://img.shields.io/github/stars/ANDRES-FLORIAN-SALAZAR/VIVAE-SHOP?style=for-the-badge)](https://github.com/ANDRES-FLORIAN-SALAZAR/VIVAE-SHOP/stargazers)
  [![GitHub issues](https://img.shields.io/github/issues/ANDRES-FLORIAN-SALAZAR/VIVAE-SHOP?style=for-the-badge)](https://github.com/ANDRES-FLORIAN-SALAZAR/VIVAE-SHOP/issues)
</div>

## 🌟 Características

- 🛍️ Catálogo de productos interactivo
- 📱 Diseño completamente responsivo
- ⚡ Carga rápida y optimizada
- 🎨 Interfaz de usuario moderna y atractiva
- 📦 Fácil de personalizar y desplegar

## 🚀 Despliegue Rápido

### Opción 1: GitHub Pages (Recomendado)
1. Crea un nuevo repositorio en GitHub
2. Sube los archivos (puedes arrastrar y soltar en la interfaz web o usar git)
3. Ve a `Settings` → `Pages`
4. En `Source`, selecciona la rama `main` y la carpeta raíz `/`
5. ¡Listo! Tu tienda estará disponible en: `https://<tu-usuario>.github.io/<nombre-repositorio>/`

### Opción 2: Despliegue Automático con Python
```bash
# Instalar dependencias
pip install PyGithub

# Configurar variables de entorno
export GITHUB_USERNAME=tu_usuario
export GITHUB_TOKEN=tu_token

# Ejecutar script de despliegue
python deploy_github.py --repo vivae --dir . --username $GITHUB_USERNAME --token $GITHUB_TOKEN
```

## 🛠️ Personalización

### Añadir/Editar Productos
1. Edita el archivo `data/productos.json`
2. Añade las imágenes en la carpeta `img/`
3. Los cambios se reflejarán automáticamente

### Estilos
- Los estilos principales están en `css/estilos.css`
- Los estilos específicos de productos están en `css/productos/`

## 📱 Tecnologías Utilizadas

- HTML5, CSS3, JavaScript (ES6+)
- [Font Awesome](https://fontawesome.com/) para iconos
- [Google Fonts](https://fonts.google.com/) para tipografía
- [GitHub Pages](https://pages.github.com/) para hosting

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee las [pautas de contribución](CONTRIBUTING.md) antes de enviar un pull request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.

## 🌐 Redes Sociales

- Instagram: [@vivaeshop](https://instagram.com/vivaeshop)
- WhatsApp: [+57 317 553 5562](https://wa.me/573175535562)

---

<div align="center">
  Hecho con ❤️ por <a href="https://github.com/ANDRES-FLORIAN-SALAZAR">Andrés Florian</a>
</div>
El botón de WhatsApp está configurado con tu número +57 3175535562 y los mensajes piden el nombre del cliente y dicen: "Un asesor se contactará contigo para seguir con la solicitud que has enviado." 

---
¡Listo! Si quieres que yo haga el push al repo, necesitaré tu permiso y token (no lo compartas aquí si no quieres).