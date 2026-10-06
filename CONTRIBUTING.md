# Contributing Guidelines

Startup: **SafeZone** · Product: **NodeSecure** · Course: 1ASI0729 (NRC 7800)

## 1. Branching model (GitFlow)

| Branch | Purpose | Naming convention |
|---|---|---|
| `main` | Production-ready code, one commit per release | `main` |
| `develop` | Integration branch for the next release | `develop` |
| Feature | One branch per feature or user story | `feature/<context>-<short-description>` |
| Release | Release stabilization | `release/<major>.<minor>.<patch>` |
| Hotfix | Urgent production fix | `hotfix/<major>.<minor>.<patch>` |

Examples: `feature/warehouse-management-register-warehouse`, `release/1.0.0`, `hotfix/1.0.1`.

Releases are tagged with [Semantic Versioning](https://semver.org/) 2.0.0.

## 2. Conventional Commits

Every commit message follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description in English, imperative mood>

[optional body]
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.
The scope is the bounded context, for example `iam`, `warehouse-management`, `sensor-integration`.

Example:

```
feat(sensor-integration): add connection status column to the IoT device list

Shows ONLINE / OFFLINE for every ESP32 node, covering acceptance criteria of US02.
```

## 3. Coding conventions

All identifiers, comments and documentation are written in English.

| Language | Reference |
|---|---|
| HTML | W3Schools HTML Style Guide, Google HTML/CSS Style Guide |
| CSS | Google HTML/CSS Style Guide, BEM naming for component classes |
| TypeScript | Google TypeScript Style Guide |
| Angular | Angular coding style guide (angular.dev) |
| Java (Web Services) | Google Java Style Guide, Spring Boot Features |
| Gherkin | Gherkin Conventions for Readable Specifications |

Angular specific rules applied in this repository:

- Folders use kebab-case, classes use PascalCase, members use camelCase.
- One bounded context per folder, with `domain`, `application`, `infrastructure` and
  `presentation` layers.
- Entities end with `.entity.ts`, API resources with `.response.ts`, translators with
  `.assembler.ts`, endpoints with `-api.endpoint.ts` and state holders with `.store.ts`.
- Components are standalone, use `ChangeDetectionStrategy.OnPush` and the built-in control flow
  (`@if`, `@for`).

## 4. Before opening a pull request

```bash
npm run lint
npm test
npm run build
```

Pull requests target `develop` and require the review of at least one other team member.
