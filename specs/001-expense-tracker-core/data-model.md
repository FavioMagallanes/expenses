# Data Model: App de Control de Gastos Mensuales

**Branch**: `001-expense-tracker-core` | **Date**: 2026-03-23 | **Phase**: 1

---

## Entidades

### `Category` (enum)

```
BBVA        → "Tarjeta BBVA"
SUPERVIELLE → "Tarjeta Supervielle"
PRESTAMO    → "Préstamo"
OTROS       → "Otros"
```

- Valor fijo, no editable por el usuario (FR-002).
- Solo `BBVA` y `SUPERVIELLE` habilitan campos de cuotas (FR-003).

---

### `Gasto`

| Campo             | Tipo                        | Restricciones                     | Notas                                                      |
| ----------------- | --------------------------- | --------------------------------- | ---------------------------------------------------------- |
| `id`              | `string` (UUID v4)          | Único, inmutable                  | Generado al crear                                          |
| `descripcion`     | `string`                    | Opcional, max 120 chars           | Texto libre; no afecta cálculos                            |
| `categoria`       | `Category`                  | Obligatorio                       | Enum; no texto libre (FR-011)                              |
| `monto_total`     | `number` (entero, centavos) | > 0                               | Almacenado en centavos; Big.js en cálculos                 |
| `cuota_actual`    | `number` (entero)           | ≥ 1; solo si categoría es tarjeta | `null` para PRESTAMO/OTROS                                 |
| `total_cuotas`    | `number` (entero)           | ≥ 1; solo si categoría es tarjeta | `null` para PRESTAMO/OTROS                                 |
| `monto_por_cuota` | `number` (entero, centavos) | Calculado; solo tarjetas          | `Big(monto_total).div(total_cuotas).round(2,1)` → centavos |
| `fecha_registro`  | `string` (ISO 8601)         | Automático                        | `new Date().toISOString()`                                 |

**Invariante**: Si `categoria` ∈ {BBVA, SUPERVIELLE} → `cuota_actual`, `total_cuotas` y
`monto_por_cuota` DEBEN estar presentes y ser válidos.

---

### `Presupuesto`

| Campo                 | Tipo                        | Restricciones | Notas                            |
| --------------------- | --------------------------- | ------------- | -------------------------------- |
| `monto`               | `number` (entero, centavos) | > 0           | Único por sesión de mes          |
| `fecha_configuracion` | `string` (ISO 8601)         | Automático    | Fecha de la última configuración |

---

### `ResumenMensual` (valor derivado — no persiste)

Calculado en tiempo real por selector del store; nunca almacenado.

| Campo            | Fórmula                                              |
| ---------------- | ---------------------------------------------------- |
| `presupuesto`    | `Presupuesto.monto`                                  |
| `total_gastado`  | `Σ gasto.monto_total` para todos los gastos          |
| `saldo_restante` | `presupuesto − total_gastado`                        |
| `es_negativo`    | `saldo_restante < 0` → activa alerta visual (FR-012) |

---

## Estado del Store (Zustand)

```typescript
interface ExpenseStore {
  // State
  presupuesto: Presupuesto | null;
  gastos: Gasto[];

  // Budget actions
  setBudget: (monto: number) => void; // FR-001
  editBudget: (monto: number) => void; // FR-001 edición

  // Expense actions
  addGasto: (gasto: Omit<Gasto, "id" | "fecha_registro">) => void; // FR-006 CREATE
  updateGasto: (id: string, changes: Partial<Gasto>) => void; // FR-006 UPDATE
  deleteGasto: (id: string) => void; // FR-006 DELETE

  // Master reset
  resetAll: () => void; // FR-007

  // Derived selector (no persiste)
  getResumen: () => ResumenMensual;
}
```

---

## Reglas de Validación

| Campo                | Regla                           | Mensaje de error                                      |
| -------------------- | ------------------------------- | ----------------------------------------------------- |
| `presupuesto.monto`  | Entero > 0                      | "El presupuesto debe ser un número positivo"          |
| `gasto.monto_total`  | Entero > 0                      | "El monto debe ser un número positivo"                |
| `gasto.total_cuotas` | Entero ≥ 1 (solo tarjetas)      | "El número de cuotas debe ser al menos 1"             |
| `gasto.cuota_actual` | 1 ≤ cuota_actual ≤ total_cuotas | "La cuota actual no puede superar el total de cuotas" |
| `gasto.categoria`    | Valor del enum `Category`       | "Selecciona una categoría válida"                     |

---

## Transiciones de Estado

```
[Sin presupuesto]
    │ setBudget(monto > 0)
    ▼
[Presupuesto configurado] ◄──── editBudget(monto > 0)
    │ addGasto(...)
    ▼
[Con gastos]
    │ updateGasto / deleteGasto
    ▼
[Con gastos actualizados]
    │ resetAll() + confirmación
    ▼
[Sin presupuesto]   ← estado inicial
```
