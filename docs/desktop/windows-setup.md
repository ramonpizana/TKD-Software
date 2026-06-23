# Windows Desktop Setup

## Objetivo

Preparar una maquina Windows para correr y empaquetar `TKD-Software` como app
de escritorio con `Tauri`.

## Lo que necesitas instalar

1. Microsoft C++ Build Tools
2. Rustup, que instala `cargo` y `rustc`
3. WebView2 Runtime si tu Windows no lo trae ya incluido

## Paso 1. Build Tools

- Instala Visual Studio Build Tools
- Marca `Desktop development with C++`

## Paso 2. Rust

Desde PowerShell:

```powershell
winget install --id Rustlang.Rustup
```

Luego cierra y vuelve a abrir la terminal.

Si `rustup`, `rustc` o `cargo` aun no aparecen en esa misma ventana, abre una
nueva terminal o usa la ruta completa una vez:

```powershell
& "$env:USERPROFILE\\.cargo\\bin\\rustup.exe" default stable-msvc
& "$env:USERPROFILE\\.cargo\\bin\\rustc.exe" --version
& "$env:USERPROFILE\\.cargo\\bin\\cargo.exe" --version
```

Verifica:

```powershell
rustc --version
cargo --version
```

## Paso 3. WebView2

En Windows 10 version 1803 o superior y en Windows 11 normalmente ya viene
instalado. Si tu equipo no lo tiene, instala el runtime de WebView2.

## Paso 4. Revisar el repo

Entra a la raiz del proyecto:

```powershell
Set-Location C:\\Users\\ramon\\Documents\\TKD
```

Luego corre:

```powershell
npm install
npm run desktop:doctor
```

## Paso 5. Desarrollo local

```powershell
npm run desktop:dev
```

## Paso 6. Generar instalador

```powershell
npm run desktop:build
```

Si quieres usar el flujo ya verificado paso a paso sin depender del wrapper de
`npm`, tambien puedes correr:

```powershell
node scripts/desktop-build.mjs
```

Al terminar, el instalador queda normalmente en:

```text
C:\Users\ramon\AppData\Local\tkd-software-target\release\bundle\nsis\TKD-Software_0.1.0_x64-setup.exe
```

## Notas

- Esta fase usa `NSIS` como target inicial de Windows.
- El prototipo web sigue funcionando con `npm run dev`.
- La firma de codigo no es obligatoria para pruebas locales, pero si sera
  importante para distribucion publica y para reducir advertencias de
  SmartScreen.
