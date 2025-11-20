# Guía de actualización - My Clipboard Manager

Esta guía explica cómo modificar y actualizar la aplicación instalada.

## 🔧 Flujo de trabajo de desarrollo

### Estructura del proyecto

- **Carpeta de desarrollo**: `/home/angel/Escritorio/my_clipboard/`
  - Esta es tu código fuente donde haces todas las modificaciones
  - Contiene el código TypeScript/React sin compilar

- **Carpeta instalada**: `~/.local/share/my-clipboard/`
  - Esta es la versión compilada que se ejecuta
  - Contiene solo el código compilado (JavaScript)

---

## 📝 Pasos para actualizar la aplicación

### Método 1: Reinstalación completa (Recomendado)

Este es el método más simple y seguro:

```bash
# 1. Ir a la carpeta de desarrollo
cd /home/angel/Escritorio/my_clipboard

# 2. Hacer tus modificaciones en los archivos
# (edita src/main/*.ts, src/renderer/*.tsx, etc.)

# 3. Detener la aplicación actual (opcional, el instalador lo hace)
# Click derecho en el tray icon → Salir

# 4. Compilar y reinstalar
npm run build
./install.sh

# 5. La aplicación se reiniciará automáticamente
# O reinicia manualmente:
~/.local/share/my-clipboard/run.sh &
```

### Método 2: Actualización manual (Avanzado)

Si solo quieres copiar archivos específicos:

```bash
# 1. Compilar el proyecto
cd /home/angel/Escritorio/my_clipboard
npm run build

# 2. Detener la aplicación
pkill -f "my-clipboard"

# 3. Copiar solo los archivos compilados
cp -r dist/* ~/.local/share/my-clipboard/dist/

# 4. Reiniciar la aplicación
~/.local/share/my-clipboard/run.sh &
```

---

## 🧪 Probar cambios antes de instalar

Antes de instalar los cambios, pruébalos en modo desarrollo:

```bash
cd /home/angel/Escritorio/my_clipboard

# Opción 1: Modo desarrollo con hot reload
npm run dev

# Opción 2: Compilar y ejecutar
npm start
```

Cuando estés satisfecho con los cambios, procede con la instalación.

---

## 📂 Archivos que puedes modificar

### Backend (Proceso principal de Electron)

- `src/main/index.ts` - Configuración principal, ventana, tray, atajos
- `src/main/clipboard-monitor.ts` - Servicio de monitoreo del clipboard
- `src/main/storage-service.ts` - Almacenamiento persistente

### Frontend (Interfaz React)

- `src/renderer/App.tsx` - Componente principal de la aplicación
- `src/renderer/components/*.tsx` - Componentes de la UI
- `src/renderer/styles/index.css` - Estilos con Tailwind CSS

### Configuración

- `src/shared/types/clipboard.ts` - Tipos TypeScript compartidos
- `src/preload/preload.ts` - Script de preload (API segura)
- `package.json` - Dependencias y configuración
- `tailwind.config.js` - Configuración de Tailwind CSS
- `webpack.*.config.js` - Configuración de Webpack

---

## 🔄 Ejemplos de modificaciones comunes

### Cambiar el atajo de teclado

Edita `src/main/index.ts` línea ~104:

```typescript
const ret = globalShortcut.register('CommandOrControl+Alt+V', () => {
  // Cambia a tu atajo preferido, por ejemplo:
  // 'CommandOrControl+Shift+C'
  // 'Super+C'
  // 'Alt+Space'
});
```

Luego ejecuta:
```bash
npm run build && ./install.sh
```

### Cambiar el límite de elementos en el historial

Edita `src/main/storage-service.ts` línea ~12:

```typescript
private readonly MAX_ITEMS = 100; // Cambia este número
```

### Cambiar el intervalo de monitoreo del clipboard

Edita `src/main/clipboard-monitor.ts` línea ~9:

```typescript
private readonly pollInterval = 500; // En milisegundos
```

### Cambiar colores de la interfaz

Edita `tailwind.config.js`:

```javascript
colors: {
  'app-bg': '#1a1b26',        // Color de fondo principal
  'app-surface': '#24283b',    // Color de superficies
  'app-border': '#414868',     // Color de bordes
  'app-text': '#c0caf5',       // Color de texto
  'app-accent': '#7aa2f7',     // Color de acento
}
```

---

## ⚠️ Notas importantes

1. **NO borres la carpeta del Escritorio** - Es tu código fuente
2. **Siempre compila antes de instalar** - `npm run build` es obligatorio
3. **Prueba en desarrollo primero** - Usa `npm run dev` para probar cambios
4. **Backup del historial** - Tu historial está en `~/.config/my_clipboard/clipboard-data.json`

---

## 🐛 Solución de problemas

### Los cambios no se reflejan

```bash
# 1. Asegúrate de estar en la carpeta correcta
cd /home/angel/Escritorio/my_clipboard

# 2. Limpia y recompila
rm -rf dist/
npm run build

# 3. Reinstala
./install.sh

# 4. Cierra y reinicia la aplicación
pkill -f "my-clipboard"
~/.local/share/my-clipboard/run.sh &
```

### Error al compilar

```bash
# Reinstala dependencias
rm -rf node_modules package-lock.json
npm install
npm run build
```

### La aplicación no inicia después de actualizar

```bash
# Verifica que los archivos se copiaron correctamente
ls -la ~/.local/share/my-clipboard/dist/

# Verifica permisos
chmod +x ~/.local/share/my-clipboard/run.sh

# Revisa los logs ejecutando manualmente
~/.local/share/my-clipboard/run.sh
```

---

## 📚 Recursos adicionales

- **Documentación de Electron**: https://www.electronjs.org/docs
- **Documentación de React**: https://react.dev/
- **Documentación de Tailwind CSS**: https://tailwindcss.com/docs
- **Documentación de TypeScript**: https://www.typescriptlang.org/docs/

---

## 🤝 Contribuir

Si haces mejoras interesantes, considera:
1. Documentar tus cambios
2. Probar exhaustivamente
3. Compartir con la comunidad

---

**Última actualización**: Noviembre 2025
