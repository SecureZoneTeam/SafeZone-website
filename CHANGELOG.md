# Changelog

All notable changes to the NodeSecure Frontend Web Application are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- US06 - Security push notifications.
- US11 - Incident report export (PDF / Excel).
- US16 - Subscription checkout and billing.

## [1.0.0] - 2026-10-05

### Added
- Angular 20 workspace following the bounded-context layout of the course reference project.
- Shared kernel: `BaseEntity`, `BaseApiEndpoint`, `BaseAssembler`, shell layout, header, footer
  and language switcher.
- Identity and Access Management bounded context: Sign-In, Sign-Up, `IamStore`, JWT interceptor
  and authentication guard (US13, US17, TS18).
- Warehouse Management bounded context: warehouse list and registration form (US01, US04, US05).
- Sensor Integration bounded context: IoT device list with connection status (US02, US19).
- Security Alerts bounded context: alert list and false-alarm reconciliation (US03, US07).
- Reporting bounded context: traceability log with discrepancy filter (US08, US10).
- Subscription Management bounded context: SaaS plan comparison (US15).
- Company Registration bounded context: company aggregate and store.
- Internationalization (i18n) in English and Latin American Spanish, plus ARIA attributes (a11y).
- Fake REST API backend based on `json-server` exposing `/api/v1`.
