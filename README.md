# My Clipboard Manager

Una aplicación de escritorio para gestionar el historial del portapapeles, construida con Electron, React y TypeScript.

## Características

- **Historial de portapapeles**: Guarda automáticamente todo lo que copias (texto e imágenes)
- **Persistencia**: El historial se mantiene entre sesiones
- **Búsqueda rápida**: Busca en tu historial de copias con filtrado en tiempo real
- **Invocación rápida**:
  - Atajo de teclado global: `Ctrl+Alt+L` (o `Cmd+Alt+L` en macOS)
  - Ícono en la bandeja del sistema
- **Interfaz moderna**: UI oscura construida con Tailwind CSS
- **Ejecuta en segundo plano**: La aplicación permanece activa sin ocupar espacio en la barra de tareas

## Requisitos previos

- Node.js (v14 o superior)
- npm o yarn

## Instalación

1. Clona o descarga este repositorio
2. Instala las dependencias:

```bash
npm install
```

## Desarrollo

### Modo desarrollo

Para ejecutar la aplicación en modo desarrollo con hot reload:

```bash
npm run dev
```

Este comando:
- Compila automáticamente los cambios en TypeScript
- Inicia Electron
- Recarga automáticamente cuando detecta cambios

### Compilación manual

Si prefieres compilar y ejecutar por separado:

```bash
# Compilar todo el proyecto
npm run build

# Ejecutar la aplicación
npm start
```

### Compilación por partes

```bash
# Compilar solo el proceso principal
npm run build:main

# Compilar solo el proceso renderer (React)
npm run build:renderer

# Compilar solo el preload script
npm run build:preload
```

## Generación del ejecutable

Para crear un ejecutable distribuible:

```bash
npm run package
```

Esto generará archivos en la carpeta `release/`:
- **Linux**: `.AppImage` y `.deb`

## Uso de la aplicación

### Abrir la ventana

Hay dos formas de abrir la ventana del clipboard:

1. **Atajo de teclado**: Presiona `Ctrl+Alt+L` desde cualquier aplicación
2. **Tray icon**: Haz clic en el ícono de la bandeja del sistema

### Copiar un elemento

1. Abre la ventana del clipboard
2. Haz clic en cualquier elemento de la lista
3. El elemento se copiará automáticamente al portapapeles
4. La ventana se cerrará automáticamente

### Buscar en el historial

1. Escribe en el campo de búsqueda en la parte superior
2. Los resultados se filtrarán en tiempo real
3. El texto coincidente se resaltará en amarillo

### Eliminar elementos

1. Pasa el cursor sobre un elemento
2. Haz clic en el botón de eliminar (ícono de papelera) que aparece
3. El elemento se eliminará del historial

### Limpiar todo el historial

1. Haz clic en el botón "Limpiar todo" en la esquina superior derecha
2. Confirma la acción en el diálogo

### Cerrar la ventana

Presiona `Esc` o haz clic fuera de la ventana para cerrarla.

## Atajos de teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl+Alt+L` | Abrir/cerrar la ventana del clipboard |
| `Esc` | Cerrar la ventana |
| `Enter` | Copiar el elemento seleccionado |

## Estructura del proyecto

```
my_clipboard/
├── src/
│   ├── main/              # Proceso principal de Electron
│   │   ├── index.ts       # Punto de entrada principal
│   │   ├── clipboard-monitor.ts  # Servicio de monitoreo
│   │   └── storage-service.ts    # Almacenamiento persistente
│   ├── preload/           # Script de preload
│   │   └── preload.ts     # API segura para el renderer
│   ├── renderer/          # Proceso renderer (React)
│   │   ├── components/    # Componentes React
│   │   ├── styles/        # Estilos CSS con Tailwind
│   │   ├── App.tsx        # Componente principal
│   │   └── index.tsx      # Punto de entrada del renderer
│   └── shared/            # Tipos compartidos
│       └── types/
├── public/                # Archivos estáticos
│   └── index.html         # Template HTML
├── dist/                  # Archivos compilados
├── webpack.*.config.js    # Configuraciones de Webpack
├── tsconfig.json          # Configuración de TypeScript
├── tailwind.config.js     # Configuración de Tailwind CSS
└── package.json           # Dependencias y scripts
```

## Configuración

### Límite de elementos en el historial

Por defecto, la aplicación guarda hasta 100 elementos en el historial. Puedes cambiar este límite editando `MAX_ITEMS` en `src/main/storage-service.ts`:

```typescript
private readonly MAX_ITEMS = 100; // Cambia este valor
```

### Intervalo de monitoreo del clipboard

El clipboard se revisa cada 500ms. Puedes ajustar este valor en `src/main/clipboard-monitor.ts`:

```typescript
private readonly pollInterval = 500; // Cambia este valor (en milisegundos)
```

### Atajo de teclado global

Para cambiar el atajo de teclado, edita `src/main/index.ts`:

```typescript
globalShortcut.register('CommandOrControl+Alt+L', () => {
  // Cambia 'CommandOrControl+Alt+L' por tu atajo preferido
});
```

## Almacenamiento de datos

Los datos se guardan automáticamente usando `electron-store` en:

- **Linux**: `~/.config/my_clipboard/clipboard-data.json`
- **macOS**: `~/Library/Application Support/my_clipboard/clipboard-data.json`
- **Windows**: `%APPDATA%\my_clipboard\clipboard-data.json`

## Tecnologías utilizadas

- **Electron**: Framework para aplicaciones de escritorio
- **React**: Biblioteca para la interfaz de usuario
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Framework de CSS
- **Webpack**: Bundler de módulos
- **electron-store**: Almacenamiento persistente
- **electron-builder**: Empaquetado de la aplicación

## Solución de problemas

### La aplicación no se inicia

- Verifica que hayas compilado el proyecto: `npm run build`
- Comprueba que todas las dependencias estén instaladas: `npm install`

### El atajo de teclado no funciona

- Verifica que no haya otro programa usando el mismo atajo
- Prueba a reiniciar la aplicación
- En Linux, algunos entornos de escritorio requieren permisos adicionales para atajos globales

### No se guardan los elementos del clipboard

- Verifica los permisos de escritura en el directorio de configuración
- Comprueba la consola de Electron para ver errores (abre DevTools en modo desarrollo)

## Licencia

MIT

## Autor

Ángel Macías Rodríguez

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias o mejoras.
