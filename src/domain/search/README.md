# Search Domain

Este dominio gestiona la búsqueda global de productos por título, incluyendo lógica de debounce, filtrado local y navegación.

## Estructura

- **components/**: UI de la barra de búsqueda (`SearchBar`, `SearchInput`, `SearchDropdown`).
- **composables/**: Casos de uso (`useSearch`, `useSearchBar`).
- **config/**: Configuración (`search.config.ts`).
- **stores/**: Estado global (`searchStore`).

## Uso

El componente principal es `SearchBar`, que utiliza `useSearchBar` para coordinar input, resultados y navegación.

### Store (`searchStore`)

- `searchTerm`: término actual (readonly).
- `setSearchTerm(term)`: actualiza el término.
- `resetStore()`: limpia el estado.

### Composables

- **`useSearch`**: ejecuta la búsqueda de productos contra API/cache, con debounce y mínimo de caracteres.
- **`useSearchBar`**: orquesta la interacción del usuario (input, dropdown, selección, navegación).

## Dependencias

- **products domain**: `getProducts`, `ProductInterface`.
- **shared kernel**: utilidades (`logger`) y composables (`useClickOutside`, `useBufferedInput`, `useDropdownNavigation`).

## Arquitectura

- **Components**: Renderizan UI y capturan eventos.
- **Composables**: Casos de uso que conectan UI con estado y servicios.
- **Store**: Estado global reactivo, encapsulado y con acciones controladas.
- **Config**: Centraliza parámetros (debounce, minChars, staleTime).

## Principios

- **Dependencias unidireccionales**: Components → Composables → Store/Servicios.
- **Encapsulación**: El store no expone estado mutable.
- **Reutilización**: Lógica compleja extraída en composables compartidos.
- **Trazabilidad**: Logging en acciones y eventos clave.

## Convenciones del Dominio

### Performance

- **Debounce**: Las búsquedas en tiempo real deben usar debounce (configurado en `config/`) para evitar sobrecarga.
- **Caching**: Utilizar `staleTime` adecuado para evitar re-fetching innecesario de productos.

### Interacción

- **Accesibilidad**: Los dropdowns de búsqueda deben ser navegables por teclado.
- **Feedback**: Mostrar estado de carga (`isLoading`) y mensajes de "sin resultados".
