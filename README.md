# NodeSecure — Frontend Web Application

**Startup:** SafeZone · **Producto:** NodeSecure
**Curso:** 1ASI0729 Desarrollo de Aplicaciones Open Source · **NRC:** 7800 · **Ciclo:** 2026-20
**Docente:** Iván Robles Fernández

Aplicación web desarrollada con **Angular** que da soporte a la plataforma NodeSecure: control
inteligente de inventario potenciado por trazabilidad IoT. El software registra lo que
*digitalmente* debería ocurrir y los nodos sensores (ESP32 con contactos magnéticos) aportan la
evidencia física de lo que *realmente* sucedió; cuando ambas fuentes no cuadran, el motor de
discrepancias genera una alerta.

## Integrantes del equipo

| Apellidos y Nombres | Código |
|---|---|
| Anahua Ancachi, Liz Maribel | U202421123 |
| Pérez Bellido, Fernando Sebastián | U202410420 |
| Ravello Cárdenas, Luciana Angielina | U20221F887 |
| Sandoval Aiquipa, Kelber Yamir | U202418645 |

## Stack tecnológico

Conforme al *Final Project Statement* del curso:

| Capa | Tecnología |
|---|---|
| Frontend Web Application | Angular 20, TypeScript, HTML5, CSS3 |
| Lenguaje de diseño | Material Design vía **Angular Material** 20 (Material 3) |
| Design System | Tokens compartidos con la [NodeSecure Landing Page](https://securezoneteam.github.io/NodeSecure-Landing-Page/) |
| Internacionalización (i18n) | `@ngx-translate/core` — `en_US` (por defecto) y `es_419` |
| Accesibilidad (a11y) | Atributos ARIA, navegación por teclado, contraste |
| Backend simulado (Sprints 1–2) | `json-server` sobre `/api/v1` |
| RESTful Web Services (Sprints 3–4) | **Spring Boot + Spring Data JPA (Java)**, documentado con OpenAPI/Swagger |
| Control de versiones | Git + GitHub, GitFlow, Conventional Commits, Semantic Versioning |

> El idioma por defecto de mensajes, interfaz de usuario y documentación es **inglés**, tal como
> exige el enunciado. El informe del proyecto se mantiene en español.

## Estructura del repositorio

```
node-secure/
├── docs/                              # Documentación arquitectónica y de requisitos
│   ├── adrs.md                        # Architectural Decision Records (ADRs)
│   ├── class-diagram.puml             # Diagrama de clases del dominio (PlantUML)
│   └── user-stories.md                # User Stories y Requirements Traceability Matrix (RTM)
├── public/                            # Recursos estáticos públicos
│   ├── safezone-logo.svg              # Imagotipo de la marca
│   ├── favicon.ico                    # Favicon de la aplicación
│   └── i18n/                          # Diccionarios de traducción para @ngx-translate
│       ├── en.json                    # Cadenas en inglés (en_US)
│       └── es.json                    # Cadenas en español latinoamericano (es_419)
├── server/                            # Backend REST simulado (json-server)
│   ├── db.json                        # Base de datos simulada con datos de muestra
│   ├── routes.json                    # Reescritura de rutas (/api/v1/*)
│   └── start.sh                       # Script de arranque del backend simulado
├── src/
│   ├── index.html                     # Punto de entrada HTML, SEO Tags y Meta Tags
│   ├── main.ts                        # Bootstrap de la aplicación
│   ├── material-theme.scss            # Tema Material 3 y design tokens
│   ├── styles.css                     # Hoja de estilos global y paleta de marca
│   ├── environments/
│   │   ├── environment.ts             # Configuración de producción
│   │   └── environment.development.ts # Configuración de desarrollo local
│   └── app/
│       ├── app.config.ts              # Providers raíz (router, http, i18n, animaciones)
│       ├── app.routes.ts              # Definición de rutas raíz
│       ├── app.ts                     # Clase del componente shell
│       ├── app.html                   # Plantilla del shell
│       ├── app.css                    # Estilos del shell
│       ├── app.spec.ts                # Prueba unitaria del componente raíz
│       ├── iam/                       # Bounded Context: Identity and Access Management
│       │   ├── application/           # Gestión de estado (IamStore)
│       │   ├── domain/                # Modelo de dominio (User, SignIn/SignUp commands)
│       │   ├── infrastructure/        # Endpoints, interceptor JWT, guard, assemblers
│       │   └── presentation/          # Formularios Sign-In y Sign-Up
│       ├── company-registration/      # Bounded Context: registro de empresas cliente
│       ├── warehouse-management/      # Bounded Context: almacenes y zonas
│       ├── sensor-integration/        # Bounded Context: nodos ESP32 y eventos físicos
│       ├── security-alerts/           # Bounded Context: motor de discrepancias y alertas
│       ├── reporting/                 # Bounded Context: bitácora de trazabilidad
│       ├── subscription-management/   # Bounded Context: planes SaaS y facturación
│       └── shared/                    # Shared Kernel
│           ├── domain/                # Contratos base de dominio (BaseEntity)
│           ├── infrastructure/        # Cliente HTTP base, API endpoint base, assembler base
│           └── presentation/          # Layout shell, header, footer, language switcher
├── angular.json                       # Configuración del workspace de Angular CLI
├── CHANGELOG.md                       # Historial de versiones del proyecto
├── CONTRIBUTING.md                    # GitFlow, Conventional Commits y convenciones de código
├── eslint.config.js                   # Configuración plana de ESLint (TypeScript y Angular)
├── LICENSE.md                         # Licencia del proyecto
├── package.json                       # Dependencias npm y scripts del proyecto
├── README.md                          # Documentación principal del proyecto
├── tsconfig.json                      # Opciones raíz del compilador TypeScript (Target ES2024)
├── tsconfig.app.json                  # Opciones de compilación de la aplicación
└── tsconfig.spec.json                 # Opciones de compilación de pruebas unitarias
```

Cada bounded context replica la misma separación en capas, de modo que la estructura del frontend
es un espejo de la estructura de paquetes del RESTful API:

| Capa | Responsabilidad |
|---|---|
| `domain/` | Entidades, aggregates, value objects, enums y commands. Sin dependencias de Angular. |
| `application/` | Gestión de estado con *signals* (`*.store.ts`) y orquestación de casos de uso. |
| `infrastructure/` | Resources de la API (`*.response.ts`), assemblers y endpoints HTTP. |
| `presentation/` | Componentes y páginas standalone de Angular. |

## Bounded Contexts

| Bounded Context | Aggregates y entidades principales | User Stories |
|---|---|---|
| `iam` | `User`, `SignInCommand`, `SignUpCommand` | US13, US17, TS18 |
| `company-registration` | `Company` | US16 |
| `warehouse-management` | `Warehouse`, `WarehouseZone`, `StreetAddress` | US01, US04, US05 |
| `sensor-integration` | `SensorNode`, `PhysicalEvent`, `MacAddress` | US02, TS09, US19 |
| `security-alerts` | `SecurityAlert`, `ReconcileAlertCommand` | US03, US06, US07 |
| `reporting` | `TraceabilityRecord` | US08, US10, US11 |
| `subscription-management` | `SubscriptionPlan`, `Subscription`, `Money` | US15, US16 |

## Consistencia visual con la Landing Page

El enunciado exige que *"la experiencia debe ser consistente entre el Landing Page y la Web
Application"*. Para lograrlo, `src/styles.css` define los mismos design tokens que usa la Landing
Page, y `src/material-theme.scss` adapta Angular Material a esa paleta.

| Token | Valor | Uso |
|---|---|---|
| `--ns-blue-600` | `#2563eb` | Color primario de marca, enlaces, badges |
| `--ns-blue-500` | `#3b82f6` | Acento, palabras destacadas en títulos |
| `--ns-navy` | `#0f172a` | Títulos y texto de alto contraste |
| `--ns-footer` | `#253763` | Fondo del footer |
| `--ns-slate-500/600/700` | `#64748b` / `#475569` / `#334155` | Texto secundario y cuerpo |
| `--ns-slate-50` | `#f8fafc` | Fondo de página |
| `--ns-success` | `#22c55e` | Sensores en línea, eventos conciliados |
| `--ns-danger` | `#dc2626` | Discrepancias físicas y alertas críticas |
| `--ns-gradient-primary` | `linear-gradient(135deg, #3b82f6, #2563eb)` | Botones primarios |
| `--ns-radius-card` | `26px` | Tarjetas |
| `--ns-radius-button` | `14px` | Botones |
| `--ns-radius-pill` | `999px` | Header flotante, chips, enlaces de navegación |
| Tipografía | Inter (Arial como respaldo) | Toda la experiencia |

Elementos replicados de la Landing Page: header flotante tipo píldora con fondo translúcido y
`backdrop-filter`, botones con degradado azul y elevación al pasar el cursor, tarjetas con borde
suave y sombra difusa, badges de sección en mayúsculas, y footer `#253763` de cuatro columnas.

## Conexión entre la Landing Page y la Web Application

Los call-to-action de la Landing Page redirigen a la vista correspondiente de esta aplicación,
tal como exige el enunciado. La conexión se configura en un único archivo del repositorio de la
Landing Page (`js/config.js`):

```js
window.NODE_SECURE_CONFIG = {
  appBaseUrl: 'https://securezoneteam.github.io/NodeSecure-Frontend',
  openInNewTab: false
};
```

Mapeo de los CTA:

| CTA en la Landing Page | Destino en la Web Application | User Story |
|---|---|---|
| Navbar · "Iniciar sesión" | `/sign-in` | US13 |
| Navbar · "Registro →" | `/sign-up` | US13 |
| Hero · "Regístrate Ahora →" | `/sign-up` | US14 |
| Información · "Regístrate Ahora →" | `/sign-up?plan=PREMIUM` | US14 |
| Planes · Básico "Empezar →" | `/sign-up?plan=BASIC` | US15 |
| Planes · Premium "Empezar →" | `/sign-up?plan=PREMIUM` | US15 |
| Planes · Corporativo "Contactar ventas →" | `/sign-up?plan=CORPORATE` | US15 |

El parámetro `plan` lo leen `SignUp` y `SubscriptionPlanList`, de modo que el visitante no vuelve
a elegir el plan que ya seleccionó en la Landing Page. En sentido inverso, el logo del header y
los enlaces del footer regresan a la Landing Page usando `environment.landingPageUrl`.

## Puesta en marcha

Requisitos: Node.js 20.19 o superior y npm 10 o superior.

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar el backend REST simulado (terminal 1)
npm run server          # http://localhost:3000/api/v1

# 3. Levantar la aplicación web (terminal 2)
npm start               # http://localhost:4200
```

### Scripts disponibles

| Script | Descripción |
|---|---|
| `npm start` | Servidor de desarrollo de Angular en `http://localhost:4200`. |
| `npm run build` | Compilación de producción en `dist/node-secure`. |
| `npm run watch` | Compilación incremental en modo desarrollo. |
| `npm test` | Pruebas unitarias con Karma y Jasmine. |
| `npm run lint` | Análisis estático con ESLint y angular-eslint. |
| `npm run server` | Backend REST simulado con json-server. |
| `npm run build:gh-pages` | Compilación para GitHub Pages (`base-href`, `404.html` y `.nojekyll`). |

## Endpoints del backend simulado

Base URL de desarrollo: `http://localhost:3000/api/v1`

| Recurso | Métodos | Bounded Context |
|---|---|---|
| `/users` | GET, POST, PUT, DELETE | iam |
| `/companies` | GET, POST, PUT, DELETE | company-registration |
| `/warehouses` | GET, POST, PUT, DELETE | warehouse-management |
| `/warehouse-zones` | GET, POST, PUT, DELETE | warehouse-management |
| `/sensor-nodes` | GET, POST, PUT, DELETE | sensor-integration |
| `/physical-events` | GET, POST | sensor-integration |
| `/security-alerts` | GET, POST, PUT | security-alerts |
| `/traceability-records` | GET | reporting |
| `/subscription-plans` | GET | subscription-management |
| `/subscriptions` | GET, POST, PUT | subscription-management |
| `/invoices` | GET | subscription-management |

Al desplegar los Web Services reales basta con actualizar `serverBaseUrl` en
`src/environments/environment.ts`.

## Convenciones de código y control de versiones

Las convenciones de nomenclatura, el modelo de ramas GitFlow y el formato de los mensajes de
commit están descritos en [CONTRIBUTING.md](./CONTRIBUTING.md). Las decisiones de arquitectura
están registradas en [docs/adrs.md](./docs/adrs.md).

## Repositorios relacionados

| Producto | Repositorio |
|---|---|
| Landing Page (HTML5, CSS3, JavaScript) | *por definir* |
| Frontend Web Application (Angular) | este repositorio |
| RESTful Web Services (Spring Boot, Java) | *por definir* |
| Project Report (Markdown) | *por definir* |

## Licencia

Distribuido bajo licencia MIT. Ver [LICENSE.md](./LICENSE.md).
