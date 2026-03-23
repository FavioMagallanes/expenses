# Quickstart: App de Control de Gastos Mensuales

**Branch**: `001-expense-tracker-core` | **Date**: 2026-03-23

---

## Requisitos previos

- Node.js ≥ 20
- npm ≥ 10 (o pnpm / yarn)

---

## Setup inicial

```bash
# 1. Crear proyecto Vite 6 + React + TypeScript
npm create vite@latest expenses -- --template react-ts
cd expenses

# 2. Instalar dependencias de producción
npm install zustand big.js

# 3. Instalar Tailwind CSS v4 con el plugin oficial de Vite
npm install -D tailwindcss @tailwindcss/vite
```

Reemplazar el contenido de `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

Reemplazar el contenido de `src/index.css`:

```css
@import "tailwindcss";
```

> **Tailwind v4**: ya no requiere `tailwind.config.js` ni directivas `@tailwind base/components/utilities`.
> El contenido se detecta automáticamente.

---

## Estructura de carpetas a crear

```bash
mkdir -p src/core/math
mkdir -p src/core/storage
mkdir -p src/features/budget
mkdir -p src/features/expense-registration
mkdir -p src/features/expense-history
mkdir -p src/store
mkdir -p src/types
```

---

## Archivos clave y su responsabilidad

| Archivo                                                 | Responsabilidad                                                                     |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `src/types/index.ts`                                    | Tipos e interfaces compartidos (`Category`, `Gasto`, `Presupuesto`, `ExpenseStore`) |
| `src/core/math/finance.ts`                              | Funciones puras Big.js: `calcMontoCuota`, `calcTotalGastado`, `calcSaldo`           |
| `src/core/storage/persist-config.ts`                    | Clave de storage y función `partialize`                                             |
| `src/store/expense-store.ts`                            | Store Zustand con `persist`; implementa todas las acciones del contrato             |
| `src/features/budget/use-budget.ts`                     | Hook: leer/escribir presupuesto, validar monto                                      |
| `src/features/budget/budget-form.tsx`                   | Form presentacional de presupuesto                                                  |
| `src/features/budget/budget-summary.tsx`                | Muestra presupuesto / gastado / saldo                                               |
| `src/features/expense-registration/use-expense-form.ts` | Hook: estado del form, habilitación de cuotas, autofocus                            |
| `src/features/expense-registration/expense-form.tsx`    | Form de nuevo gasto (puramente presentacional)                                      |
| `src/features/expense-registration/category-picker.tsx` | Selector rápido de las 4 categorías                                                 |
| `src/features/expense-history/use-expenses.ts`          | Hook: lista, editar, eliminar, reset                                                |
| `src/features/expense-history/expense-list.tsx`         | Lista de gastos con alerta de saldo negativo                                        |
| `src/features/expense-history/expense-item.tsx`         | Fila individual de gasto                                                            |
| `src/features/expense-history/reset-button.tsx`         | Botón "Reiniciar Todo" + diálogo confirmación                                       |
| `src/app.tsx`                                           | Composición de todas las features                                                   |

---

## Orden de implementación recomendado

1. **`src/types/index.ts`** — tipos base que todos los demás archivos importan
2. **`src/core/math/finance.ts`** — lógica financiera pura; revisable en code review antes de UI
3. **`src/store/expense-store.ts`** — store con persist; valida el modelo de datos completo
4. **`src/features/budget/`** — primer flujo visible: configurar presupuesto
5. **`src/features/expense-registration/`** — flujo principal: registrar gasto
6. **`src/features/expense-history/`** — CRUD, lista y reset
7. **`src/app.tsx`** — integración final

---

## Convenciones de código

- **Archivos y carpetas**: `kebab-case` (ej. `expense-form.tsx`, `use-budget.ts`)
- **Funciones**: arrow functions; una línea cuando sea posible
- **Inmutabilidad**: usar `.map`, `.filter`, `.reduce`; nunca mutar arrays/objetos directamente
- **Comentarios**: solo cuando la lógica financiera lo requiera estrictamente
- **Linter**: ESLint + Prettier configurados en `eslint.config.js` y `.prettierrc`
- **Sin `float`/`double` para montos**: siempre `Big(valor)`; convertir a centavos para persistir

---

## Levantar en desarrollo

```bash
npm run dev
# → http://localhost:5173
```

## Build de producción

```bash
npm run build
# → dist/ listo para servir de forma estática (no requiere servidor)
```
