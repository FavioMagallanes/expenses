# Tasks: App de Control de Gastos Mensuales

**Input**: Design documents from `/specs/001-expense-tracker-core/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/ ✅ quickstart.md ✅

**Stack**: React 19 · TypeScript 5.7 · Zustand 5 · Big.js 6 · Tailwind CSS 4 · Vite 6
**Architecture**: Screaming Architecture · SPA (sin router) · Hooks/Presentational split · kebab-case

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias incompletas)
- **[Story]**: Historia de usuario correspondiente (US1–US5)
- Rutas absolutas desde la raíz del proyecto

---

## Phase 1: Setup — Proyecto e Infraestructura Base

**Purpose**: Inicialización del proyecto, tokens de diseño y estructura de carpetas.

- [ ] T001 Crear proyecto Vite 6 + React 19 + TypeScript 5.7 con `npm create vite@latest expenses -- --template react-ts`
- [ ] T002 Instalar dependencias de producción: `npm install zustand big.js`
- [ ] T003 Instalar dependencias de desarrollo: `npm install -D tailwindcss @tailwindcss/vite`
- [ ] T004 Configurar plugin Tailwind v4 en `vite.config.ts` — agregar `tailwindcss()` al array `plugins`
- [ ] T005 Reemplazar `src/index.css` con `@import "tailwindcss"` y tokens del Design System
- [ ] T006 Crear `src/index.css` con las custom properties del Design System "The Digital Ledger":
  ```css
  @import 'tailwindcss';
  @theme {
    --color-background: #f9f9f7;
    --color-surface-container-low: #f2f4f2;
    --color-primary: #005fad;
    --radius-DEFAULT: 0px; /* No-Line Rule: 0px borders */
    --radius-sm: 0px;
    --radius-md: 0px;
    --radius-lg: 0px;
  }
  ```
- [ ] T007 [P] Descargar assets Stitch — Dashboard HTML: `curl -L "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzdjY2E4NTg0ZTFhZjQ1ZGI5MTI5YmNiZTdkNzIwYzQ0EgsSBxCEof6_1BcYAZIBJAoKcHJvamVjdF9pZBIWQhQxNzA3NTQzOTQwNzQzNzg1NjI5NQ&filename=&opi=89354086" -o src/assets/stitch-dashboard.html`
- [ ] T008 [P] Descargar assets Stitch — Quick Entry Modal HTML: `curl -L "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2E1NWM4YmQ5MTAyNTQwNWZiYzBhMTRkZGZiNGU4NzA3EgsSBxCEof6_1BcYAZIBJAoKcHJvamVjdF9pZBIWQhQxNzA3NTQzOTQwNzQzNzg1NjI5NQ&filename=&opi=89354086" -o src/assets/stitch-quick-entry-modal.html`
- [ ] T009 Crear estructura de carpetas: `src/core/math/`, `src/core/storage/`, `src/features/budget/`, `src/features/expense-registration/`, `src/features/expense-history/`, `src/store/`, `src/types/`
- [ ] T010 [P] Configurar ESLint + Prettier con reglas para TypeScript y React 19 en `eslint.config.js` y `.prettierrc`

**Checkpoint**: Proyecto creado, Tailwind v4 configurado con tokens, assets Stitch descargados, estructura de carpetas lista.

---

## Phase 2: Foundational — Tipos, Core y Store

**Purpose**: Infraestructura compartida que TODA feature requiere. Nada puede implementarse sin esta fase.

**⚠️ CRÍTICO**: Ninguna feature puede comenzar hasta completar esta fase.

- [ ] T011 Crear `src/types/index.ts` — definir `Category`, `Gasto`, `Presupuesto`, `ResumenMensual`, `ExpenseStore`, `CATEGORIAS_TARJETA`, `esTarjeta` según contrato `contracts/store.md`
- [ ] T012 [P] Crear `src/core/math/finance.ts` — funciones puras Big.js:
  - `calcMontoCuota = (monto: number, cuotas: number): number` — `Big(monto).div(cuotas).round(2, 1).toNumber()`
  - `calcTotalGastado = (gastos: Gasto[]): number` — reduce con `Big` sobre `monto_total`
  - `calcSaldo = (presupuesto: number, totalGastado: number): number`
  - Configurar `Big.RM = 1` (ROUND_HALF_UP) al inicio del módulo
- [ ] T013 [P] Crear `src/core/storage/persist-config.ts` — exportar `STORAGE_KEY = 'expense-tracker-v1'` y función `partialize`
- [ ] T014 Crear `src/store/expense-store.ts` — Zustand 5 store con `persist` middleware:
  - Implementar todas las acciones del contrato: `setBudget`, `editBudget`, `addGasto`, `updateGasto`, `deleteGasto`, `resetAll`
  - `getResumen` como selector puro usando `calcTotalGastado` y `calcSaldo` de `src/core/math/finance.ts`
  - Agregar slice de navegación SPA: `isModalOpen: boolean`, `openModal: () => void`, `closeModal: () => void` (sin react-router)
  - Usar `partialize` para excluir funciones de la serialización
- [ ] T015 [P] Crear `src/shared/ui/primary-button.tsx` — botón con degradado primario del Design System (bg `primary` → hover 10% más oscuro), sin border radius (No-Line Rule)
- [x] T016 [P] Crear `src/shared/ui/ledger-input.tsx` — input con estilo "The Digital Ledger": borde inferior 1px `primary`, sin bordes lateral/superior, fondo `surface-container-low`, sin outline en focus. **Naming rule**: los componentes UI propios del proyecto usan el prefijo `Ledger`; nunca hacer referencia a productos de terceros (ej. Notion) en nombres de componentes, interfaces ni comentarios.

**Checkpoint**: Tipos, funciones de cálculo, store y componentes base compartidos listos. Features pueden implementarse en paralelo.

---

## Phase 3: US1 — Configurar Presupuesto Mensual (Priority: P1) 🎯 MVP-A

**Goal**: El usuario puede definir y editar el presupuesto mensual; el saldo se calcula al instante.

**Independent Test**: Ingresar $50.000, confirmar y verificar que `getResumen().saldo_restante === 5000000` (centavos).

- [ ] T017 [US1] Crear `src/features/budget/use-budget.ts` — hook que consume el store: expone `presupuesto`, `saldo`, `setBudget`, `editBudget`; valida que `monto > 0` antes de llamar al store; usa `getResumen()` para derivar `saldo_restante`
- [ ] T018 [P] [US1] Crear `src/features/budget/budget-form.tsx` — componente presentacional: recibe `onSubmit(monto: number)`, `isEditing: boolean`; usa `ledger-input.tsx` y `primary-button.tsx`; sin lógica de validación interna
- [ ] T019 [P] [US1] Crear `src/features/budget/budget-summary.tsx` — componente presentacional: recibe `presupuesto`, `totalGastado`, `saldoRestante`, `esNegativo`; aplica `text-[--color-primary]` para saldo positivo y `text-red-600` para negativo (FR-012); fondo `surface-container-low` con Tonal Layering

**Checkpoint**: US1 completa y verificable de forma independiente.

---

## Phase 4: US2 + US3 — Registro de Gastos y Resumen (Priority: P1) 🎯 MVP-B

**Goal**: El usuario registra un gasto con categoría, cuotas y ve el resumen actualizado instantáneamente.

**Independent Test**: Registrar $12.000 en 3 cuotas con BBVA; verificar `monto_por_cuota === 400000` centavos y `saldo_restante` reducido en `1200000` centavos, todo en ≤ 300 ms.

- [ ] T020 [US2] Crear `src/features/expense-registration/category-picker.tsx` — componente presentacional: recibe `value: Category`, `onChange(cat: Category) => void`; renderiza 4 botones/chips para BBVA, SUPERVIELLE, PRÉSTAMO, OTROS; selección activa con fondo `primary` y texto blanco; sin border radius (No-Line Rule); quick-select en un tap (FR-011)
- [ ] T021 [US2] Crear `src/features/expense-registration/use-expense-form.ts` — hook: gestiona estado del formulario; detecta `esTarjeta(categoria)` para habilitar/deshabilitar campos de cuotas (FR-003); calcula `montoPorCuota` en tiempo real usando `calcMontoCuota` de `src/core/math/finance.ts` (FR-004); expone `autoFocusRef` para foco automático en monto (FR-010); valida todos los campos antes de llamar `addGasto`
- [ ] T022 [US2] Crear `src/features/expense-registration/expense-form.tsx` — componente presentacional: recibe todas las props del hook; usa `autoFocusRef` en el input de monto; muestra/oculta sección de cuotas condicionalmente; usa `category-picker.tsx`, `ledger-input.tsx`, `primary-button.tsx`; flujo completo en ≤ 4 interacciones (SC-001)
- [ ] T023 [US3] Crear `src/features/expense-history/expense-item.tsx` — componente presentacional: recibe un `Gasto`; muestra descripción, `categoria`, monto total formateado y, si es tarjeta, "Cuota X de Y — $monto_cuota"; fondo `surface-container-low`; sin divisores entre items (No-Line Rule)
- [ ] T024 [US3] Crear `src/features/expense-history/expense-list.tsx` — componente presentacional: recibe `gastos: Gasto[]`; renderiza lista de `expense-item.tsx` con Tonal Layering alternado; muestra estado vacío con CTA cuando `gastos.length === 0`; sin `border` entre items (0px — No-Line Rule)

**Checkpoint**: US2 y US3 completas; formulario de registro y lista de gastos funcionan de forma independiente.

---

## Phase 5: US4 — Editar y Eliminar Gastos (Priority: P2)

**Goal**: El usuario puede corregir o eliminar un gasto; el saldo refleja el cambio en ≤ 300 ms sin recarga.

**Independent Test**: Editar monto de $5.000 a $8.000; verificar que `saldo_restante` disminuye en `300000` centavos sin recarga de página.

- [ ] T025 [US4] Crear `src/features/expense-history/use-expenses.ts` — hook: consume `gastos`, `updateGasto`, `deleteGasto` del store; expone `handleEdit(id, changes)` y `handleDelete(id)`; actualización optimista: aplica cambio en UI primero, revierte si falla la persistencia (SC-002 + Principio IV)
- [ ] T026 [US4] Actualizar `src/features/expense-history/expense-item.tsx` — agregar botones "Editar" y "Eliminar" como props opcionales `onEdit?` y `onDelete?`; sin cambios en lógica de presentación existente
- [ ] T027 [US4] Crear `src/features/expense-history/edit-expense-modal.tsx` — componente presentacional: reutiliza `expense-form.tsx` precargado con los valores del gasto a editar; recibe `gasto: Gasto`, `onSave`, `onCancel`; se muestra/oculta con estado booleano del store (sin router)

**Checkpoint**: US4 completa; CRUD de gastos totalmente funcional.

---

## Phase 6: US5 — Reiniciar Todo (Priority: P3)

**Goal**: El usuario puede limpiar todos los datos del mes con confirmación robusta (no ejecutable en un gesto involuntario).

**Independent Test**: Con gastos y presupuesto, ejecutar "Reiniciar Todo" → confirmar → verificar `gastos === []` y `presupuesto === null`.

- [ ] T028 [US5] Crear `src/features/expense-history/reset-button.tsx` — componente presentacional: recibe `onConfirm: () => void`; al primer click muestra diálogo de confirmación inline (sin modal externo); el diálogo muestra advertencia explícita "Se borrarán todos los gastos y el presupuesto"; solo el botón de confirmación secundario llama `onConfirm`; cancelar descarta sin efecto (FR-007, SC-006)
- [ ] T029 [US5] Conectar `reset-button.tsx` con acción `resetAll()` del store en `src/app.tsx`; verificar que `resetAll` limpia `localStorage` y resetea UI al estado inicial

**Checkpoint**: US5 completa; "Reiniciar Todo" requiere siempre doble confirmación.

---

## Phase 7: Integración SPA y Composición Final

**Purpose**: Ensamblar todas las features en la SPA, implementar navegación por estado y aplicar el estilo editorial completo.

- [ ] T030 Actualizar `src/store/expense-store.ts` — verificar que el slice de navegación (`isModalOpen`, `openModal`, `closeModal`) está correctamente separado del slice de datos; confirmar que no hay dependencia de react-router en ningún archivo
- [ ] T031 Crear `src/app.tsx` — componer la SPA:
  - Renderiza `budget-summary.tsx` + `expense-list.tsx` + `reset-button.tsx` como Dashboard siempre visible
  - Renderiza `expense-form.tsx` condicionalmente según `isModalOpen` del store (navegación SPA sin router)
  - Botón flotante "＋ Nuevo Gasto" con fondo `primary` y degradado; llama `openModal()`
  - Aplica fondo `background` (#f9f9f7) al root
- [ ] T032 Actualizar `src/main.tsx` — importar `src/index.css`; montar `<App />` en `#root`
- [ ] T033 [P] Revisar todos los componentes presentacionales — confirmar que ningún `.tsx` llama directamente al store (solo recibe props); mover cualquier llamada al store al hook correspondiente
- [ ] T034 [P] Auditoría No-Line Rule — verificar que ningún componente usa `rounded-*`, `border-*` o `ring-*` con valores distintos de 0; reemplazar por clases Tailwind de borde inferior si es necesario
- [ ] T035 [P] Verificar tokens del Design System — confirmar que `background`, `surface-container-low` y `primary` se usan consistentemente en todos los componentes siguiendo el Tonal Layering del Design System "The Digital Ledger"

**Checkpoint**: SPA completamente funcional; navegación por estado; estilo editorial aplicado.

---

## Phase 8: Polish y Criterios de Éxito

**Purpose**: Validar criterios de aceptación del spec.md antes de dar por terminada la implementación.

- [ ] T036 [P] Validar SC-001 — recorrer el flujo "monto → tarjeta → cuotas → confirmar" contando interacciones; ajustar UX si supera 4 pasos
- [ ] T037 [P] Validar SC-002 — medir tiempo desde confirmación de gasto hasta actualización visible del saldo; debe ser ≤ 300 ms (sin animaciones bloqueantes)
- [ ] T038 [P] Validar SC-003 — revisar manualmente en code review: `calcMontoCuota(1200000, 3) === 400000`; `calcMontoCuota(100, 3) === 34` (half-up); `calcMontoCuota(100, 1) === 100`
- [ ] T039 [P] Validar SC-004 — desconectar red y verificar que todas las funciones principales operan sin errores
- [ ] T040 [P] Validar SC-005 — auditar con DevTools Network que no hay fetch/XHR saliente en ningún flujo
- [ ] T041 [P] Validar SC-006 — confirmar que no hay camino para invocar `resetAll()` sin pasar por la confirmación secundaria
- [ ] T042 [P] Validar SC-007 — revisar que cada campo numérico inválido muestra un mensaje específico (no genérico)
- [ ] T043 Ejecutar linter y formatter: `npm run lint && npm run format:check`; corregir cualquier violación antes del merge

**Checkpoint**: Todos los Success Criteria del spec.md verificados. Listo para merge.

---

## Dependencies — Orden de Completitud

```
Phase 1 (Setup)
    └─► Phase 2 (Foundational: types + core + store + shared UI)
            ├─► Phase 3 (US1: Budget)          — puede comenzar en paralelo con Phase 4
            ├─► Phase 4 (US2+US3: Registration + History)  — puede comenzar en paralelo con Phase 3
            ├─► Phase 5 (US4: CRUD)            — requiere Phase 4 completa
            └─► Phase 6 (US5: Reset)           — requiere Phase 2 completa
                    └─► Phase 7 (Integration)  — requiere Phases 3+4+5+6 completas
                            └─► Phase 8 (Polish) — requiere Phase 7 completa
```

### Tareas paralelizables dentro de Phase 2

```
T011 (types) → T012 (math) [P] + T013 (storage) [P] en paralelo
                        └─────────────────────────┘
                                    │
                                  T014 (store)
                                    │
                          T015 [P] + T016 [P] en paralelo
```

### MVP incremental sugerido

| MVP       | Phases      | Entrega                                   |
| --------- | ----------- | ----------------------------------------- |
| **MVP-A** | 1 + 2 + 3   | Configurar presupuesto y ver saldo        |
| **MVP-B** | + 4         | Registrar gastos y ver resumen            |
| **MVP-C** | + 5 + 6 + 7 | CRUD completo, reset y SPA integrada      |
| **Final** | + 8         | Polish y validación de criterios de éxito |

---

## Implementation Strategy

1. **Empezar por `src/types/index.ts` y `src/core/math/finance.ts`** — son la base de todo.
   Sin ellos, el store y los hooks no pueden compilar.
2. **El store es el contrato de la app** — implementarlo completamente antes de tocar cualquier
   componente. Referencia: `contracts/store.md`.
3. **Hooks antes que componentes** — cada hook debe poder usarse de forma aislada. Los
   componentes son solo plantillas de presentación que reciben props.
4. **Stitch como referencia visual** — los assets descargados en T007/T008 son la fuente de
   verdad para espaciado, colores y tipografía. No inventar estilos; traducir los tokens de
   Stitch a clases Tailwind.
5. **No instalar react-router** — toda navegación es un booleano en el store.
   Si surge la necesidad de múltiples rutas, abrir una enmienda a la constitución primero.

---

## Summary

| Métrica                            | Valor                  |
| ---------------------------------- | ---------------------- |
| Total de tareas                    | 43                     |
| Phase 1 — Setup                    | 10 tareas              |
| Phase 2 — Foundational             | 6 tareas               |
| Phase 3 — US1 Budget               | 3 tareas               |
| Phase 4 — US2+US3 Registro+Resumen | 5 tareas               |
| Phase 5 — US4 CRUD                 | 3 tareas               |
| Phase 6 — US5 Reset                | 2 tareas               |
| Phase 7 — Integración SPA          | 6 tareas               |
| Phase 8 — Polish                   | 8 tareas               |
| Tareas paralelizables [P]          | 22 tareas              |
| MVP mínimo (MVP-A)                 | Phases 1–3 → 19 tareas |
