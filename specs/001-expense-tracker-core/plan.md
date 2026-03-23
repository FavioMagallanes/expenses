# Implementation Plan: App de Control de Gastos Mensuales

**Branch**: `001-expense-tracker-core` | **Date**: 2026-03-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-expense-tracker-core/spec.md`

## Summary

Aplicación web de finanzas personales (SPA) que permite definir un presupuesto mensual,
registrar gastos con 4 categorías fijas (Tarjeta BBVA, Tarjeta Supervielle, Préstamo, Otros),
calcular cuotas con aritmética de punto fijo (Big.js), gestionar registros con CRUD completo
y reiniciar el período mensual. La arquitectura sigue Screaming Architecture organizada por
dominios de negocio bajo `src/features/`. La lógica de negocio reside exclusivamente en
Custom Hooks; los componentes son puramente presentacionales.

## Technical Context

**Language/Version**: TypeScript 5.7
**Primary Dependencies**: React 19, Zustand 5 (+ `zustand/middleware` persist), Big.js 6,
Tailwind CSS 4, Vite 6
**Storage**: `localStorage` vía middleware `persist` de Zustand — sin base de datos externa
**Testing**: Sin suite de tests en esta versión (decisión documentada en constitution v1.0.2)
**Target Platform**: Navegador web moderno (Chrome/Firefox/Safari/Edge), uso offline-first
**Project Type**: Web SPA — single-user, sin backend
**Performance Goals**: Actualización de saldo ≤ 300 ms tras cualquier mutación (SC-002)
**Constraints**: 100 % offline (SC-004); ningún dato sale del dispositivo (SC-005);
aritmética con Big.js, prohibido `float`/`double` para montos (Principio I constitución)
**Scale/Scope**: Uso personal, ~50–200 registros de gastos por mes

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principio                 | Cumplimiento | Evidencia en el plan                                                                           |
| ------------------------- | ------------ | ---------------------------------------------------------------------------------------------- |
| I. Precisión Matemática   | ✅           | Big.js para toda aritmética; redondeo half-up documentado en `src/core/math/`                  |
| II. Privacidad de Datos   | ✅           | `localStorage` sin red; sin dependencias con telemetría; ningún fetch externo                  |
| III. UX de Entrada Rápida | ✅           | Foco automático en monto (FR-010); pickers de tarjeta (FR-011); ≤ 4 interacciones              |
| IV. Estado Predictivo     | ✅           | Store Zustand derivado síncrono; `saldo_restante` calculado en selector, sin estado intermedio |
| V. Código Limpio          | ✅           | Screaming Architecture por dominio; hooks puros separados de JSX; linter + Prettier en CI      |

**Resultado del gate**: ✅ APROBADO — sin violaciones. Procede a Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-expense-tracker-core/
├── plan.md          # este archivo
├── research.md      # Phase 0
├── data-model.md    # Phase 1
├── quickstart.md    # Phase 1
├── contracts/       # Phase 1
│   └── store.md
└── tasks.md         # Phase 2 (/speckit.tasks — no creado por /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
├── core/
│   ├── math/
│   │   └── finance.ts          # funciones puras Big.js: calcCuota, roundHalfUp, sumGastos
│   └── storage/
│       └── persist-config.ts   # configuración del middleware persist de Zustand
│
├── features/
│   ├── budget/
│   │   ├── use-budget.ts       # hook: setBudget, editBudget, validación FR-001
│   │   ├── budget-form.tsx     # componente presentacional: campo monto + confirmar
│   │   └── budget-summary.tsx  # muestra presupuesto, total gastado, saldo restante
│   │
│   ├── expense-registration/
│   │   ├── use-expense-form.ts # hook: estado del form, lógica cuotas FR-003/004, autofocus FR-010
│   │   ├── expense-form.tsx    # componente presentacional: pickers FR-011, campos cuotas
│   │   └── category-picker.tsx # selector rápido de las 4 categorías FR-002/011
│   │
│   └── expense-history/
│       ├── use-expenses.ts     # hook: CRUD FR-006, saldo derivado FR-005, reset FR-007
│       ├── expense-list.tsx    # lista de gastos con indicador visual de saldo negativo FR-012
│       ├── expense-item.tsx    # fila: descripción, categoría, cuota X/Y, monto
│       └── reset-button.tsx    # botón "Reiniciar Todo" con diálogo de confirmación FR-007
│
├── store/
│   └── expense-store.ts        # Zustand store: BudgetSlice + ExpensesSlice + resetAll
│
├── types/
│   └── index.ts                # Category enum, Gasto, Presupuesto, ResumenMensual
│
├── app.tsx                     # raíz: composición de features
└── main.tsx                    # punto de entrada Vite
```

**Structure Decision**: Screaming Architecture — cada directorio bajo `src/features/` nombra
su dominio de negocio. `src/core/` contiene exclusivamente funciones puras de cálculo y
configuración de persistencia; no importa nada de React. Los componentes `.tsx` no contienen
lógica de negocio; toda la lógica vive en Custom Hooks (`.ts`).

## Complexity Tracking

> Sin violaciones a la constitución — sección no aplica.
