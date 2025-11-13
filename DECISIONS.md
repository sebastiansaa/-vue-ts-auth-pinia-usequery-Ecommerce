# DECISIONS — Resumen corto

Decisiones clave y cuándo revisarlas.

1. Paginación "mostrar más" (SearchDropdown)

- Mantener la paginación incremental en el componente `SearchDropdown`.
- Revisar si: el dataset crece o se necesita paginación backend → mover a `useSearch` o exponer props (`initialLimit`/`increment`).

2. Lógica mínima de error/retry en `SearchDropdown`

- Mantener unas líneas de manejo de error y retry en el componente por alta cohesión con la UI.
- Revisar si: la misma lógica se repite en otros dropdowns o crece en complejidad → extraer a un composable.

---
