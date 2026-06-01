# Research - Ring Scoring Foundation

## Objetivo

Aterrizar una primera base tecnica y de producto para `TKD-Software` usando
reglas oficiales accesibles, ejemplos reales del mercado y una arquitectura que
priorice continuidad del evento.

## Hallazgos de reglas oficiales

### World Taekwondo

- La pagina oficial de WT lista **WT Poomsae Competition Rules & Interpretation
  (September 30, 2024)** como referencia actual para poomsae:
  [WT Rules - Poomsae](https://www.worldtaekwondo.org/rules-wt/rules.html?sc=02).
- El documento oficial accesible de WT del **June 14, 2024** confirma el uso de
  dispositivos electronicos de scoring y publicacion automatica en pantalla:
  [WT Poomsae Competition Rules & Interpretation (June 14, 2024)](https://www.worldtaekwondo.org/att_file/documents/Poomsae_Competition_Rules_and_Interpretation_%28In_force_as_of_June_14_2024%29.pdf).

### Reglas paralelas utiles como referencia operativa

- El reglamento oficial de para poomsae del **September 30, 2024** detalla una
  estructura de **10.0 puntos totales**, divididos en **4.0 tecnica** y
  **6.0 presentacion**, con publicacion inmediata tras colacionar scores:
  [World Para Taekwondo Poomsae Competition Rules 20240930](https://www.worldtaekwondo.org/att_file/documents/World%20Para%20Taekwondo%20Poomsae%20Competition%20Rules%2020240930.pdf).
- La version oficial de **August 24, 2023** explicita tambien la entrada por
  instrumento electronico y el descarte automatico del score alto y bajo en los
  escenarios que lo requieren:
  [World Para Taekwondo Poomsae Competition Rules as of August 24, 2023](https://www.worldtaekwondo.org/att_file/documents/World%20Para%20Taekwondo%20Poomsae%20Competition%20Rules%20as%20of%20August%2024%202023_20231212.pdf).

## Hallazgos de productos existentes

### FreeScoreTKD

- Proyecto open source con largo historial y foco en poomsae con tablets o
  smartphones sobre Wi-Fi.
- Se plantea como appliance o servidor local, lo que valida la idea de operar
  por red local y no depender de nube en vivo.
- Fuente:
  [FreeScoreTKD](https://mikewongtkd.github.io/freescoretkd/) y
  [GitHub repository](https://github.com/mikewongtkd/freescoretkd).

### TKD Command

- Producto comercial moderno con enfoque claro en torneo real.
- Expone varios patrones importantes:
  - QR para conectar tablets de jueces
  - control por ring
  - dashboard multi-ring
  - broadcast display
  - funcionamiento sin internet
- Fuente:
  [TKD Command](https://tkdcommand.com/).

### PoomsaeScore

- Producto de scoring con enfoque iPad que refuerza necesidades de:
  - display externo
  - soporte de 3, 5 y 7 jueces
  - remotos por Wi-Fi
  - manejo separado de tecnica y presentacion
- Fuente:
  [PoomsaeScore](https://mwm.ai/apps/poomsaescore/734418503).

## Conclusiones para esta fase

1. El producto debe diseñarse como **ring host autoritativo** con modo offline.
2. La nube debe ser **replica y coordinacion posterior**, no dependencia del
   scoring en vivo.
3. El modelo base debe iniciar con:
   - atleta activo
   - panel de jueces
   - deducciones configuradas
   - score publicado
   - recuperacion local basica
4. Para una primera fundacion, un prototipo web local con motor de scoring,
   persistencia local y calidad de repo es un buen primer corte.
5. La siguiente fase fuerte debe ser **LAN + pairing + display separado**.

