#!/bin/bash


# Script de instalación para My Clipboard Manager

echo "======================================"
echo "  Instalando My Clipboard Manager"
echo "======================================"

# Matar cualquier instancia en ejecución
echo "Deteniendo instancias en ejecución..."
pkill -f "my-clipboard"

# Directorio de instalación
INSTALL_DIR="$HOME/.local/share/my-clipboard"
DESKTOP_FILE="$HOME/.local/share/applications/my-clipboard.desktop"
AUTOSTART_FILE="$HOME/.config/autostart/my-clipboard.desktop"

# Crear directorios si no existen
mkdir -p "$HOME/.local/share/applications"
mkdir -p "$HOME/.config/autostart"
mkdir -p "$INSTALL_DIR"

# Copiar archivos de la aplicación
echo "Copiando archivos..."
cp -r dist node_modules package.json "$INSTALL_DIR/"

# Copiar assets si existen
if [ -d "assets" ]; then
  cp -r assets "$INSTALL_DIR/"
fi

# Crear ejecutable
cat > "$INSTALL_DIR/run.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
./node_modules/.bin/electron .
EOF

chmod +x "$INSTALL_DIR/run.sh"

# Crear archivo .desktop para el menú de aplicaciones
cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Type=Application
Name=My Clipboard Manager
Comment=Gestor de historial del portapapeles
Exec=$INSTALL_DIR/run.sh
Icon=$INSTALL_DIR/assets/icon.png
Terminal=false
Categories=Utility;
StartupNotify=false
EOF

# Crear archivo de auto-inicio
cp "$DESKTOP_FILE" "$AUTOSTART_FILE"

# Iniciar la aplicación
echo "Iniciando la aplicación..."
nohup npm start > /dev/null 2>&1 &

echo ""
echo "✅ Instalación completada!"
echo ""
echo "La aplicación se ha instalado en: $INSTALL_DIR"
echo "- Puedes ejecutarla desde el menú de aplicaciones"
echo "- Se iniciará automáticamente al iniciar sesión"
echo "- Atajo de teclado: Ctrl+Alt+V"
echo ""
echo "Para desinstalar, ejecuta: rm -rf $INSTALL_DIR $DESKTOP_FILE $AUTOSTART_FILE"
echo ""

