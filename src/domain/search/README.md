# Search

## Propósito
Gestionar la búsqueda global de productos con debounce, resultados y navegación contextual.

## Responsabilidades
- Capturar términos de búsqueda y mantener estado global.
- Ejecutar búsquedas contra API/cache con debounce y mínimos de caracteres.
- Mostrar resultados y permitir navegación a producto/resultado.
- Manejar accesibilidad y cierre de dropdown.

## Estructura
- components/: barra y dropdown de búsqueda (SearchBar, SearchInput, SearchDropdown).
- composables/: `useSearch`, `useSearchBar` orquestan consultas y UI.
- stores/: `searchStore` guarda término actual y helpers de estado.
- config/: parámetros de debounce y mínimos.

## Notas
- Depende de catálogo de productos y utilidades compartidas (logger, helpers de UI). Usa debounce para evitar sobrecarga.
- Endpoints consumidos: `GET /products/search?query={term}` (backend Products) y, opcionalmente, `GET /categories` para sugerencias de categoría. Documentar queryKey estable y debounce mínimo (p.ej. 300ms, minLength 2).

## Resumen operativo
- Propósito: búsqueda global de productos con debounce y resultados recortados.
- Endpoints usados: `GET /products/search`, opcional `GET /categories`.
- Roles requeridos: ninguno (público).
- Estados posibles: idle, loading, error, resultados parciales (limite inicial), total obtenido.
