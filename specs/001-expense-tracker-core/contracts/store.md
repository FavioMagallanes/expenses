# Store Contract: Zustand ExpenseStore

**Branch**: `001-expense-tracker-core` | **Date**: 2026-03-23 | **Phase**: 1
**Stack**: Zustand 5.0.12 + React 19.2.0

Este documento define el contrato público del store de Zustand. Todos los Custom Hooks y
componentes consumen el store exclusivamente a través de esta interfaz.

---

## Interfaz TypeScript

```typescript
// src/types/index.ts

export type Category = "BBVA" | "SUPERVIELLE" | "PRESTAMO" | "OTROS";

export interface Gasto {
  id: string;
  descripcion?: string;
  categoria: Category;
  monto_total: number; // enteros en centavos
  cuota_actual?: number; // solo categorías tarjeta
  total_cuotas?: number; // solo categorías tarjeta
  monto_por_cuota?: number; // calculado; solo categorías tarjeta; centavos
  fecha_registro: string; // ISO 8601
}

export interface Presupuesto {
  monto: number; // enteros en centavos
  fecha_configuracion: string; // ISO 8601
}

export interface ResumenMensual {
  presupuesto: number;
  total_gastado: number;
  saldo_restante: number;
  es_negativo: boolean;
}

export interface ExpenseStore {
  presupuesto: Presupuesto | null;
  gastos: Gasto[];
  setBudget: (monto: number) => void;
  editBudget: (monto: number) => void;
  addGasto: (gasto: Omit<Gasto, "id" | "fecha_registro">) => void;
  updateGasto: (
    id: string,
    changes: Partial<Omit<Gasto, "id" | "fecha_registro">>,
  ) => void;
  deleteGasto: (id: string) => void;
  resetAll: () => void;
  getResumen: () => ResumenMensual;
}
```

---

## Contratos de Acciones

### `setBudget(monto: number)`

- **Pre-condición**: `monto > 0` (entero en centavos)
- **Post-condición**: `presupuesto.monto === monto`; `presupuesto.fecha_configuracion` = ahora
- **Efecto secundario**: persiste en `localStorage`
- **Error si**: `monto ≤ 0` — el hook llamador DEBE validar antes de invocar

### `editBudget(monto: number)`

- Idéntico a `setBudget`; semánticamente diferencia "primera vez" de "edición"

### `addGasto(gasto)`

- **Pre-condición**: `gasto.monto_total > 0`; si tarjeta → `total_cuotas ≥ 1`
- **Post-condición**: `gastos` contiene el nuevo registro con `id` UUID y `fecha_registro`
- **Efecto secundario**: persiste en `localStorage`

### `updateGasto(id, changes)`

- **Pre-condición**: existe un gasto con `id`
- **Post-condición**: el gasto con `id` refleja los campos de `changes`; campos no incluidos en
  `changes` se preservan intactos (merge inmutable con spread)
- **Efecto secundario**: persiste en `localStorage`

### `deleteGasto(id)`

- **Pre-condición**: existe un gasto con `id`
- **Post-condición**: `gastos` no contiene el registro con `id`
- **Efecto secundario**: persiste en `localStorage`

### `resetAll()`

- **Pre-condición**: ninguna (siempre disponible)
- **Post-condición**: `presupuesto === null`; `gastos === []`
- **Efecto secundario**: borra clave en `localStorage`; UI vuelve al estado inicial
- **Regla UX**: el componente `reset-button.tsx` DEBE solicitar confirmación antes de invocar
  esta acción (FR-007); el store no gestiona el diálogo

### `getResumen()` (selector puro)

- **Entrada**: estado actual del store
- **Salida**: `ResumenMensual` calculado con Big.js (sin mutación del store)
- **Garantía**: `saldo_restante` nunca tiene error de punto flotante

---

## Categorías que habilitan cuotas

```typescript
export const CATEGORIAS_TARJETA: Category[] = ["BBVA", "SUPERVIELLE"];

export const esTarjeta = (cat: Category): boolean =>
  CATEGORIAS_TARJETA.includes(cat);
```

Los campos `cuota_actual`, `total_cuotas` y `monto_por_cuota` DEBEN estar presentes
cuando `esTarjeta(categoria) === true` y DEBEN ser `undefined` en caso contrario.

---

## Configuración Persist

```typescript
// src/core/storage/persist-config.ts
export const STORAGE_KEY = "expense-tracker-v1";

// Partialize: solo persiste presupuesto y gastos; getResumen es función, no se serializa
export const partialize = (state: ExpenseStore) => ({
  presupuesto: state.presupuesto,
  gastos: state.gastos,
});
```

> **Zustand v5 — breaking change**: el middleware `persist` ya no persiste el estado inicial
> automáticamente al crear el store. El estado inicial (`presupuesto: null, gastos: []`) se
> hidrata desde `localStorage` en el primer render. Si no existe clave previa, el store arranca
> con los valores del inicializador sin necesidad de llamar `setState` explícitamente, ya que
> el estado vacío es el comportamiento esperado para una instalación nueva.
