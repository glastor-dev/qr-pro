# QR Pro (Logística)

Herramienta interna de **GLASTOR-DEV** para generar, personalizar y **exportar códigos QR** usados en operaciones de logística (etiquetado, acceso rápido a recursos, contactos, eventos y onboarding de WiFi).

[![CI](https://github.com/glastor-dev/qr-pro/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/glastor-dev/qr-pro/actions/workflows/ci.yml) [![Deploy](https://github.com/glastor-dev/qr-pro/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/glastor-dev/qr-pro/actions/workflows/deploy.yml) [![CodeQL](https://github.com/glastor-dev/qr-pro/actions/workflows/codeql.yml/badge.svg?branch=master)](https://github.com/glastor-dev/qr-pro/actions/workflows/codeql.yml)
[![License](https://img.shields.io/github/license/glastor-dev/qr-pro)](https://github.com/glastor-dev/qr-pro/blob/master/LICENSE) [![Release](https://img.shields.io/github/v/release/glastor-dev/qr-pro)](https://github.com/glastor-dev/qr-pro/releases) [![Last Commit](https://img.shields.io/github/last-commit/glastor-dev/qr-pro)](https://github.com/glastor-dev/qr-pro/commits/master)
[![Stars](https://img.shields.io/github/stars/glastor-dev/qr-pro)](https://github.com/glastor-dev/qr-pro/stargazers) [![Forks](https://img.shields.io/github/forks/glastor-dev/qr-pro)](https://github.com/glastor-dev/qr-pro/forks) [![Issues](https://img.shields.io/github/issues/glastor-dev/qr-pro)](https://github.com/glastor-dev/qr-pro/issues) [![Pull Requests](https://img.shields.io/github/issues-pr/glastor-dev/qr-pro)](https://github.com/glastor-dev/qr-pro/pulls)

Nota: los badges de **CI/Deploy/CodeQL** requieren que los workflows estén publicados en el repositorio remoto.

![Preview](./src/assets/FireShot2.png)

## Tabla de Contenidos

- [QR Pro (Logística)](#qr-pro-logística)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Características](#características)
  - [Importación masiva](#importación-masiva)
  - [Exportación](#exportación)
  - [Requisitos](#requisitos)
  - [Uso](#uso)
  - [Scripts](#scripts)
  - [Tecnologías](#tecnologías)
  - [Buenas prácticas](#buenas-prácticas)
  - [Contribuir](#contribuir)
  - [Historial de cambios](#historial-de-cambios)
  - [Licencia](#licencia)

## Características

Tipos de QR soportados:

- **URL**
- **Texto**
- **vCard (Contacto)**
- **WiFi** (SSID / password / tipo)
- **Email**
- **SMS**
- **Evento**

Personalización:

- Color del QR, color de fondo y tamaño (128/256/512)
- Logo centrado (opcional)
- Modo accesible (foco/outline visible)

## Importación masiva

Genera un `.zip` con PNGs a partir de un archivo:

- `.xlsx` (Excel)
- `.csv`

Requisitos del archivo (datos reales usados por la app):

- Debe tener encabezados y al menos una fila.
- Debe incluir las columnas **"fecha"** y **"url"**.
- `.xls` no está soportado: **"xls no soportado, exporta a .xlsx"**.

## Exportación

- Descargar **SVG**
- Descargar **PNG**
- Compartir (si el navegador lo soporta)
- Exportar historial reciente a **PDF**
- Exportar historial reciente a **ZIP** (PNGs + `metadatos.csv`)

## Requisitos

- Node.js 20 (recomendado, alineado con CI)
- npm

## Uso

```bash
npm ci
npm run dev
```

Build de producción:

```bash
npm run build
```

## Scripts

- `npm run dev` — desarrollo
- `npm run build` — build de producción
- `npm test` — tests (Jest)
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript (`tsc`)

## Tecnologías

- **React 19**
- **Vite 7**
- **TypeScript**
- **Jest** + Testing Library
- **ESLint**
- **react-qr-code** + **qrcode**
- **jszip** + **file-saver**
- **jspdf**
- **exceljs** (`.xlsx`) + **papaparse** (`.csv`)

## Buenas prácticas

- **Performance**: estado acotado e historial limitado
- **Accesibilidad**: ARIA labels y navegación por teclado
- **Seguridad**: validación de archivos, sanitización de nombres, manejo de errores sin exponer datos sensibles

## Contribuir

¡Las contribuciones son bienvenidas! Por favor lee [CONTRIBUTING.md](./CONTRIBUTING.md) antes de enviar un Pull Request.

## Historial de cambios

Consulta el [CHANGELOG.md](./CHANGELOG.md) para ver versiones y cambios.

## Licencia

Ver [LICENSE](./LICENSE).
