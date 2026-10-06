# Architectural Decision Records (ADRs)

Startup: **SafeZone** · Product: **NodeSecure** · Course: 1ASI0729 Desarrollo de Aplicaciones Open Source (NRC 7800)

---

## ADR-001 - Angular as the Frontend Web Application framework

- **Status:** Accepted
- **Date:** 2026-10-05
- **Context:** The Final Project Statement establishes that Frontend Web Applications are
  built with the Angular Framework, using HTML5 and CSS3 for the static part of the templates
  and TypeScript as the programming language.
- **Decision:** Adopt Angular 20 with standalone components, signals and the new control flow
  syntax, following the Angular coding style guide.
- **Consequences:** The team cannot reuse Vue-based component libraries. Section 4.1.2 of the
  Project Report must be corrected accordingly.

## ADR-002 - Angular Material as the UI component library

- **Status:** Accepted
- **Date:** 2026-10-05
- **Context:** The design language of the Landing Page and the Web Application must be based on
  Material Design, and the statement names Angular Material as the component library.
- **Decision:** Use Angular Material 3 (`mat.theme`) with the NodeSecure palette defined in
  section 4.1.1 of the Project Report.
- **Consequences:** The previous reference to Vuetify / PrimeVue is removed from the report.

## ADR-003 - Folder organization by bounded context

- **Status:** Accepted
- **Date:** 2026-10-05
- **Context:** The solution applies Domain-Driven Design. The report identifies bounded contexts
  derived from the Design-Level EventStorming session.
- **Decision:** Mirror the `learning-center` reference layout: one folder per bounded context,
  each one split into `domain`, `application`, `infrastructure` and `presentation`, plus a
  `shared` kernel.
- **Consequences:** Every bounded context stays independently testable and the frontend structure
  matches the RESTful API package structure.

## ADR-004 - Spring Boot as the Web Services platform

- **Status:** Proposed
- **Date:** 2026-10-05
- **Context:** The Final Project Statement requires RESTful Web Services implemented with the
  Spring Boot Framework and Spring Data JPA, using Java as the programming language, and
  documented with the OpenAPI Specification through Swagger.
- **Decision:** Migrate the current ASP.NET Core / Entity Framework Core prototype to Spring Boot,
  preserving the bounded contexts and the DDD layering.
- **Consequences:** Technical story TS09 and section 5.1.1 of the Project Report must be rewritten;
  the C# codebase is kept only as a functional reference.

## ADR-005 - json-server as the fake backend for early sprints

- **Status:** Accepted
- **Date:** 2026-10-05
- **Context:** Sprint 1 and Sprint 2 deliver the Landing Page and the first version of the Web
  Application before the Web Services are deployed.
- **Decision:** Use `json-server` (`server/db.json`) exposing `/api/v1/*` so the Angular
  application can be developed against a stable contract.
- **Consequences:** Switching to the real API only requires changing `serverBaseUrl` in the
  environment files.

## ADR-006 - Internationalization with @ngx-translate and accessibility with ARIA

- **Status:** Accepted
- **Date:** 2026-10-05
- **Context:** The statement requires i18n for English (en_US) and Latin American Spanish (es_419),
  and a11y with ARIA attributes. English is the default language for all products.
- **Decision:** Load translation dictionaries from `public/i18n/` and keep ARIA labels on every
  interactive element and table header.
- **Consequences:** Every new view must register its labels in both dictionaries.
