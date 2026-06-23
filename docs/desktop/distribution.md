# Desktop Distribution Guide

## Que significa "sin localhost"

`localhost` solo existe en modo desarrollo.

Cuando ejecutas:

```bash
npm run desktop:dev
```

Tauri usa un servidor Vite temporal para ayudarte a desarrollar.

Cuando ejecutas:

```bash
npm run desktop:build
```

Tauri deja de depender de `http://127.0.0.1:5173/` y empaqueta la app web ya
compilada dentro del ejecutable o instalador de Windows.

El flujo de build verificado en este repo tambien puede ejecutarse de forma
directa con:

```bash
node scripts/desktop-build.mjs
```

Ese comando hace tres cosas:

- revisa prerequisitos
- construye `dist-desktop`
- empaqueta el `.exe` y el instalador NSIS

Para el usuario final eso significa:

- no necesita Node
- no necesita abrir una terminal
- no necesita usar `localhost`
- instala y abre una app normal de Windows

## Formas practicas de compartir la app

### Opcion 1: Compartir el repo

Para alguien tecnico que quiera clonar y compilar:

```bash
git clone https://github.com/ramonpizana/TKD-Software
cd TKD-Software
npm install
npm run desktop:doctor
npm run desktop:build
```

Luego puede ubicar los artefactos con:

```bash
npm run desktop:artifacts
```

### Opcion 2: Compartir el instalador

Esta es la opcion recomendada para jueces, organizadores o usuarios finales.

1. Compila el instalador con `npm run desktop:build`
2. Revisa la ruta exacta con `npm run desktop:artifacts`
3. Comparte el archivo `-setup.exe`

La salida local por defecto queda bajo:

`%LOCALAPPDATA%\tkd-software-target\release\bundle\nsis\`

El ejecutable release directo queda en:

`%LOCALAPPDATA%\tkd-software-target\release\tkd-software.exe`

## Flujo con GitHub

El repositorio incluye el workflow:

- `.github/workflows/desktop-release.yml`

Ese workflow permite:

- compilar el instalador Windows desde `Actions`
- descargar el instalador como artifact
- publicar el instalador a un GitHub Release cuando empujes un tag `v*`

### Build manual desde GitHub

1. Ve a `GitHub > Actions > desktop-release`
2. Ejecuta `Run workflow`
3. Descarga el artifact `tkd-software-windows-installer`

### Release por tag

1. Sube un tag como `v0.1.0`
2. GitHub compila el instalador
3. El workflow crea o actualiza el release con el `.exe`

## Notas de Windows

### Si `desktop:dev` o `desktop:build` fallan por `tkd-software.exe`

El repo ya intenta cerrar procesos viejos del host de desarrollo antes de
compilar. Si aun asi algo queda atorado, cierra cualquier ventana `TKD-Software`
abierta y vuelve a correr el comando.

Si quieres evitar cualquier duda, usa primero:

```powershell
Get-Process tkd-software -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Si no quieres depender del internet al instalar

Hoy el bundle usa `embedBootstrapper` para WebView2. Segun la documentacion
oficial de Tauri, eso mejora compatibilidad pero aun puede requerir internet
si el runtime falta. Si luego quieres instalacion completamente offline,
podemos cambiar a `offlineInstaller`, con el costo de aumentar mucho el tamaño
del instalador.

## Referencias oficiales

- [Tauri Windows Installer](https://v2.tauri.app/distribute/windows-installer/)
- [Tauri Distribute](https://v2.tauri.app/distribute/)
- [tauri-apps/tauri-action](https://github.com/tauri-apps/tauri-action)
