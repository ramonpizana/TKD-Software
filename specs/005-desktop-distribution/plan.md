# Implementation Plan: Desktop Distribution

## Goal

Convertir la base actual en un flujo de distribucion desktop utilizable:
build local, artefactos ubicables, limpieza de procesos y pipeline Windows reproducible.

## Scope

- endurecer `desktop:dev` y `desktop:build`
- documentar salida y uso de artefactos
- agregar workflow de build/release en GitHub

## Non-Goals

- firma de codigo
- auto-updater en produccion
- publicacion en Microsoft Store

## Deliverables

- scripts de limpieza y localizacion de artefactos
- workflow de GitHub Actions para Windows
- documentacion de distribucion
