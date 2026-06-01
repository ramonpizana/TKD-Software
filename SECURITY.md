# Seguridad Operativa

## Superficie actual del proyecto

Hoy el repositorio expone un prototipo local sin backend publico. El riesgo
principal no es internet abierto, sino:

- manipulacion accidental o maliciosa del score
- datos locales corruptos
- errores de reconexion
- fugas de secretos en el repo cuando integremos nube

## Controles ya aplicados

- validacion estricta de estructuras con `zod`
- persistencia local protegida con parseo seguro
- `npm run validate` como gate previo a entrega
- escaneo de secretos en CI
- analisis estatico con CodeQL
- constitucion del repo con limite claro entre configuracion publica y secretos

## Riesgos de la aplicacion de competencia

### Dispositivo de juez no autorizado

En produccion, cada remoto debe autenticarse por pairing efimero. No basta con
estar en la misma red.

### Reenvio o duplicado de eventos

Cada deduccion debe tener identificador unico, secuencia por juez y rechazo de
duplicados.

### Desfase de estado

El host del ring debe ser la autoridad. Ningun remoto debe recalcular el score
final por su cuenta.

### Perdida de energia o cierre forzado

Se necesita persistencia por eventos y snapshots para recuperar el round activo.

## Reglas del repositorio

- `.env`, `.env.*`, `.dev.vars` y secretos reales no se commitean
- toda integracion futura debe documentar fallback y comportamiento de falla
- las credenciales deben vivir solo en el runtime del despliegue
- el scoring debe seguir disponible aunque la sincronizacion remota no lo este

## Prompt Injection

No aplica como riesgo principal en esta fase porque el proyecto no expone un
LLM ni automatizaciones con herramientas sensibles.

Si mas adelante agregamos IA para support staff, analitica o generacion de
reportes, entonces se vuelven obligatorias:

- separacion entre instrucciones del sistema y texto libre
- herramientas minimas por flujo
- auditoria de llamadas
- controles de salida y aprobacion humana

## Endurecimiento obligatorio para la siguiente fase

- pairing por PIN o QR con expiracion corta
- roles separados para operador, juez y display
- bitacora inmutable de deducciones y publicaciones
- watchdog de salud del ring host
- prueba de recuperacion tras corte de energia
- modo de contingencia con teclado local si caen remotos

