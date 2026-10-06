# Functional User Stories and Requirements Traceability Matrix (RTM)

Startup: **SafeZone** · Product: **NodeSecure**

The full narrative, acceptance criteria in Gherkin and estimation live in the Project Report
(`README.md`, sections 3.1 and 3.3). This file keeps the traceability between each User Story,
its bounded context and the artifacts that implement it in this repository.

## Epics

| Epic ID | Title |
|---|---|
| EP01 | Monitoring and IoT Dashboard |
| EP02 | Logistics Infrastructure Management |
| EP03 | Alerts and Discrepancy Engine |
| EP04 | Audit and Traceability |
| EP05 | API Integrations and Backend |
| EP06 | Landing Page and Acquisition |
| EP07 | SaaS Model and Billing |
| EP08 | Hardware Integration (Sensors) |
| EP09 | Identity and Access Management (IAM) |
| EP10 | Mobile User Experience |

## Requirements Traceability Matrix

| Story ID | Title | Epic | Bounded Context | Implementation artifact |
|---|---|---|---|---|
| US01 | Visualize warehouse network | EP01 | warehouse-management | `presentation/pages/warehouse-list` |
| US02 | Monitor IoT connection status | EP01, EP08 | sensor-integration | `presentation/pages/sensor-node-list` |
| US03 | Real-time discrepancy audit | EP01, EP03 | security-alerts | `application/security-alert.store.ts` |
| US04 | Register new infrastructure | EP02 | warehouse-management | `presentation/pages/warehouse-form` |
| US05 | Configure operating shifts | EP02, EP03 | warehouse-management | `domain/model/warehouse-zone.entity.ts` |
| US06 | Security push notifications | EP03 | security-alerts | pending - Sprint 3 |
| US07 | Justify or dismiss false alarms | EP03, EP04 | security-alerts | `domain/model/reconcile-alert.command.ts` |
| US08 | Immutable traceability log | EP04 | reporting | `presentation/pages/traceability-log` |
| TS09 | IoT payload reception (API) | EP05, EP08 | sensor-integration | RESTful API - Spring Boot |
| US10 | Advanced audit filters | EP04 | reporting | `application/reporting.store.ts` |
| US11 | Export incident report | EP04 | reporting | pending - Sprint 3 |
| US12 | Mobile access and navigation | EP10 | shared | `presentation/components/header` |
| US13 | Secure authentication (sign-in) | EP09 | iam | `presentation/pages/sign-in` |
| US14 | Visualize Landing Page | EP06 | landing page repository | separate repository |
| US15 | SaaS plan comparison | EP06, EP07 | subscription-management | `presentation/pages/subscription-plan-list` |
| US16 | Subscription and billing | EP07 | subscription-management | pending - Sprint 3 |
| US17 | Role management (RBAC) | EP02, EP09 | iam | `domain/model/user.entity.ts` |
| TS18 | JWT token generation | EP05, EP09 | iam | `infrastructure/authentication.interceptor.ts` |
| US19 | Link IoT sensor to zone | EP08 | sensor-integration | `domain/model/mac-address.ts` |
