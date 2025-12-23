# Products

## Propósito
Proveer catálogo de productos y categorías para browsing y detalle de producto.

## Responsabilidades
- Obtener productos y categorías desde la API.
- Mantener selección de producto/categoría y listas en store.
- Exponer vistas de listado y detalle con componentes de tarjetas y grids.
- Ofrecer utilidades de navegación y filtrado.

## Estructura
- api/: endpoints HTTP directos.
- services/: capa de servicios con mapeos y manejo de errores.
- stores/: `useProductsStore` (estado de lista y selección).
- composables/: `useProducts`, `useProductNavigation`, `useCategories`, etc.
- components/: UI de tarjetas, grids y detalles.
- config/, helpers/, interfaces/, views/: soporte de constantes, utilidades, tipos y páginas.

## Notas
- Depende de backend de productos/categorías; store expone métodos `resetStore`/`resetSelection` para navegación limpia.

## Resumen operativo
- Propósito: listar y detallar productos y categorías.
- Endpoints usados: `GET /products`, `GET /products/:id`, `GET /products/search`, `GET /products/low-stock` (admin), `GET /categories`.
- Roles requeridos: público para lectura; admin para low-stock y mutaciones.
- Estados posibles: loading, error, lista vacía, producto activo/inactivo/eliminado.
