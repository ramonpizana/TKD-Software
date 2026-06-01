# Data Model: Desktop Shell Foundation

## DesktopRuntimeProfile

Describe en que tipo de runtime se esta ejecutando la interfaz.

### Fields

- `shell`: `web` o `tauri`
- `appName`: nombre visible de la app si existe metadata nativa
- `appVersion`: version visible del bundle o del shell
- `identifier`: identificador estable de la aplicacion
- `windowLabel`: etiqueta de la ventana actual

### Rules

- Si el runtime no es `tauri`, los metadatos nativos pueden ser `null`.
- La UI no debe romperse si la metadata nativa no llega.

## DesktopPrerequisiteCheck

Resume si la maquina esta lista para entrar a la fase nativa.

### Fields

- `platform`: plataforma detectada
- `nodeVersion`: version activa de Node
- `rustcVersion`: version de Rust si existe
- `cargoVersion`: version de Cargo si existe
- `buildToolsDetected`: indicador heuristico de herramientas nativas de Windows
- `advisories`: lista de recomendaciones no bloqueantes
- `failures`: lista de faltantes bloqueantes

### Rules

- Si falta `cargo` o `rustc`, el chequeo debe fallar.
- Las advertencias no deben bloquear, pero si explicar el siguiente paso.

## NativeWindowDefinition

Representa la ventana principal del host de escritorio.

### Fields

- `label`: identificador interno de la ventana
- `title`: titulo visible al usuario
- `width`: ancho inicial
- `height`: alto inicial
- `minWidth`: ancho minimo
- `minHeight`: alto minimo
- `resizable`: bandera de redimension

### Rules

- Debe existir una sola ventana principal para esta fase.
- La ventana principal debe mapear al capability principal.

## BundleArtifactProfile

Representa la identidad del producto distribuible de Windows.

### Fields

- `productName`: nombre del producto
- `version`: version del bundle
- `identifier`: identificador estable de la aplicacion
- `target`: tipo de bundle objetivo

### Rules

- El identificador debe mantenerse estable entre builds.
- El target inicial de Windows es uno solo en esta fase.
