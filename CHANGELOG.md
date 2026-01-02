<p align="center">
  <img src="https://img.shields.io/badge/Format-Keep%20a%20Changelog-blue.svg" alt="Keep a Changelog">
  <img src="https://img.shields.io/badge/Versioning-SemVer%202.0.0-green.svg" alt="Semantic Versioning">
  <img src="https://img.shields.io/badge/Status-Maintained-success.svg" alt="Maintenance Status">
</p>

---

## About This Changelog

All notable changes to **QR Pro** are documented in this file.

This project adheres to:
- **Format:** [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- **Versioning:** [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

### Version Number Scheme
```
MAJOR.MINOR.PATCH (e.g., 1.0.0)
  │     │     │
  │     │     └─── Bug fixes, patches (backward compatible)
  │     └───────── New features (backward compatible)
  └─────────────── Breaking changes (not backward compatible)
```

### Change Categories

- **Added** ✨ - New features or functionality
- **Changed** 🔄 - Changes to existing functionality
- **Deprecated** ⚠️ - Features that will be removed in future versions
- **Removed** 🗑️ - Features removed in this version
- **Fixed** 🐛 - Bug fixes
- **Security** 🔒 - Security vulnerability fixes

---

## [Unreleased]
### 🔮 Planned Features

- [ ] Dark/Light theme persistence in localStorage
- [ ] QR code animation effects
- [ ] Batch download as ZIP with custom names
- [ ] QR template library
- [ ] Advanced customization (patterns, colors, gradients)
- [ ] Analytics dashboard for generated QRs

---

## [1.1.2] - 2026-01-02

**Release Type:** Patch Release

### ✨ Added

- Columna promocional a la derecha con copy de servicios y CTA **"Reservar Asesoría Online"** (enlace por email `mailto:`).

### 🔄 Changed

- UI: la columna promocional se alinea a la altura de la vista previa del QR (solo en desktop).
- UI: el footer se renderiza al final del layout para que en responsive quede siempre abajo.
- Dev: `base` en desarrollo se fuerza a `/` para evitar problemas de navegación/HMR; en build se mantiene la lógica para Vercel y `/qr-pro/`.
- Testing: migración del runner a `deno test` (setup con `happy-dom` + `@testing-library/react`).
- Limpieza: removida la configuración legacy de Jest/Babel (scripts y dependencias asociadas).

### 🗑️ Removed

- Carga masiva (CSV/Excel) eliminada para reducir peso y complejidad.

### 🐛 Fixed

- Previsualización del QR: compatibilidad con exports “exóticos” (e.g. `forwardRef`/`memo`) de `react-qr-code`.

---

## [1.0.1] - 2026-01-01

**Release Type:** Patch Release

### 🔄 Changed

- Migración completa del código a TypeScript (`.ts/.tsx`) con verificación por `typecheck`.
- Carga masiva: soporte explícito para `.xlsx` y `.csv`.

### 🐛 Fixed

- Mensaje UI más claro cuando se intenta subir `.xls` (no soportado).
- Favicons y PWA icons: rutas y configuración ajustadas para funcionar correctamente bajo `base: /qr-pro/`.
- Favicon en pestaña: regeneración para mejorar legibilidad (evita padding/anti-aliasing que lo hacía ver como “punto” o deslavado).

### 🔒 Security

- Eliminada vulnerabilidad alta sin parche en `xlsx` removiendo la dependencia y migrando la lectura a `exceljs` (para `.xlsx`) + `papaparse` (para `.csv`).

### ✨ Added

- Scripts de utilidades para regenerar favicons desde una imagen fuente (PowerShell + generador de `favicon.ico` multi-size).
- Script `doctor` para escaneo anti-corrupción + verificación (`typecheck`, `test`, `lint`, `build`).

---

## [1.0.0] - 2025-12-31

**Release Name:** "Genesis"
**Release Type:** Initial Stable Release

### 🎉 Release Highlights

First stable release of QR Pro, a professional QR code generator with multiple formats, customization options, and modern UI.

---

### ✨ Added

#### Core Features

- **Multiple QR Types**
  - URL - Web links
  - Text - Free text
  - vCard - Contact information
  - WiFi - Network credentials
  - Email - Email with subject and body
  - SMS - Text messages
  - Event - Calendar events

- **Customization Options**
  - Color picker for QR code
  - Background color selection
  - Size options (128px, 256px, 512px)
  - Custom logo in QR center (with dynamic scaling)
  - Custom filename for downloads

- **Export Formats**
  - SVG - Vector format
  - PNG - Raster format with quality options
  - PDF - Document format

- **Additional Features**
  - Excel batch processing for mass QR generation
  - History of last 5 generated QRs with type tracking
  - Dark/Light theme toggle with CSS data attributes
  - Share functionality (Web Share API)
  - WhatsApp floating contact button with hover effects
  - Responsive design
  - Success/error feedback messages with auto-hide

#### Technical Features

- **Performance Optimizations**
  - useMemo for QR value calculation
  - useCallback for stable functions
  - Code splitting with manual chunks (vendor, qr, utils)
  - Lazy loading of dependencies
  - Optimized Vite build configuration
  - Memory leak prevention (blob URL cleanup)

- **Code Quality**
  - ESLint configuration with zero errors
  - Clean architecture with separated concerns
  - Comprehensive error handling
  - Input validation and sanitization
  - Proper TypeScript-like patterns with JSDoc

- **Accessibility**
  - ARIA labels on all interactive elements
  - Keyboard navigation support (Enter, Space)
  - Semantic HTML structure
  - Screen reader friendly
  - Focus management

- **GitHub Repository Standards**
  - Complete .github/ configuration
  - CI/CD workflows (ci.yml, deploy.yml, codeql.yml)
  - Issue and PR templates (YAML and Markdown)
  - CODEOWNERS file
  - CODE_OF_CONDUCT.md
  - SECURITY.md with vulnerability reporting
  - FUNDING.yml for sponsorship
  - Dependabot configuration for npm and GitHub Actions
  - CITATION.cff for academic citation
  - Professional CONTRIBUTING.md guide
  - CONTRIBUTORS.md with recognition section

- **Documentation**
  - Comprehensive README.md with badges
  - Detailed CHANGELOG.md (Keep a Changelog format)
  - GPL-3.0 LICENSE with project copyright (2022-2026)
  - Professional CONTRIBUTING.md with setup instructions
  - GitHub Pages deployment configuration

---

### 🔄 Changed

- Improved QR value synchronization across all download functions
- Enhanced logo positioning to scale with QR size dynamically
- Better filename sanitization for cross-platform compatibility (Windows/Unix)
- Optimized theme switching with CSS data attributes on body element
- Refactored WhatsApp button with improved SVG icon
- Updated all .github files with correct project references
- Enhanced history functionality to track QR type for proper restoration
- Improved error messages with user-friendly descriptions
- Updated Vite configuration with base URL for GitHub Pages deployment

---

### 🐛 Fixed

- Fixed logo not scaling correctly with different QR sizes (LogoInQR component)
- Corrected history functionality for all QR types (added type tracking)
- Fixed URL validation to only apply to URL type QRs
- Resolved Excel export filename sanitization issues
- Fixed memory leaks from unreleased blob URLs (useEffect cleanup)
- Corrected LICENSE file corruption (line 14 text merge issue)
- Fixed dependabot configuration (changed from pip to npm)
- Removed unused `logoFile` and `text` state variables
- Fixed all ESLint errors and warnings
- Corrected CODEOWNERS to reference qr-pro instead of wrong project

---

### 🔒 Security

- Input sanitization for all user inputs
- Safe filename generation with character filtering
- No external data collection
- Local-only processing
- CodeQL security scanning workflow
- Dependabot for automated vulnerability updates
- Proper SECURITY.md with responsible disclosure process

---

### 📦 Infrastructure

#### CI/CD Workflows

- **ci.yml** - Continuous Integration
  - ESLint checks on all PRs and pushes
  - Build verification
  - Test execution (when available)
  - Artifact upload for builds

- **deploy.yml** - GitHub Pages Deployment
  - Automated deployment to GitHub Pages
  - Build optimization for production
  - Proper permissions configuration

- **codeql.yml** - Security Analysis
  - Automated code security scanning
  - JavaScript vulnerability detection
  - Weekly scheduled scans

#### Community Health Files

- Issue templates (bug report, feature request)
- Pull request template with comprehensive checklist
- Code of Conduct (Contributor Covenant v2.1)
- Contributing guidelines
- Security policy
- Support documentation
- Funding options (GitHub Sponsors, PayPal, Open Collective)

---

### 🎨 UI/UX Improvements

- Improved WhatsApp floating button design
  - Cleaner SVG icon from assets
  - Smooth hover animations (scale + shadow)
  - Better accessibility with ARIA labels
  - Professional green color (#25d366)

- Theme System Enhancements
  - Complete dark/light mode implementation
  - CSS transitions for smooth theme switching
  - Proper styling for both themes (inputs, errors, success messages)
  - Data attribute approach for better performance

- User Feedback
  - Success messages for downloads (auto-hide after 3s)
  - Error messages with detailed descriptions
  - Visual confirmation for all actions

---

## Links & Resources

- 📖 [README.md](README.md) - Main documentation
- 🤝 [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute
- 🔒 [SECURITY.md](.github/SECURITY.md) - Security policy
- 📋 [LICENSE](LICENSE) - GPL-3.0 License

---

<div align="center">

© 2025 Andrés Antonio Cardoso

[⬆ Back to Top](#changelog)

</div>
