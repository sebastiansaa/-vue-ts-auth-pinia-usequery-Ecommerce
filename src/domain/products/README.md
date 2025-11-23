# Products Domain

Este dominio maneja toda la lógica relacionada con la visualización y gestión de productos y categorías.

## Estructura

- **api/**: Definición de endpoints y llamadas HTTP directas (axios).
- **components/**: Componentes Vue específicos del dominio (Cards, Grids, Details).
- **composables/**: Lógica de negocio reutilizable (Hooks).
- **config/**: Configuración específica del dominio (Query Keys, UI constants).
- **helpers/**: Funciones de utilidad puras.
- **interfaces/**: Tipos TypeScript.
- **services/**: Capa de abstracción sobre la API, incluye logging y manejo de errores.
- **stores/**: Gestión del estado global (Pinia).
- **views/**: Vistas principales (Páginas).

## Store: `useProductsStore`

El store de productos sigue el patrón de **Strict Encapsulation**:

- El estado (`_productsList`, `_selectedProductDTO`, `_selectedProductId`) es privado.
- Se expone solo a través de `computed` (getters) y métodos (actions).
- Incluye `resetStore()` para limpiar todo el estado y `resetSelection()` para limpiar solo el producto seleccionado.

### Uso

```typescript
import { useProductsStore } from '../stores/productsStore'

const store = useProductsStore()

// Acciones
store.selectProductById(123) // Selecciona un producto por ID
store.resetSelection() // Limpia solo el producto seleccionado (útil al navegar)
store.resetStore() // Limpia todo el estado

// Getters
console.log(store.productsList)
console.log(store.selectedProductDTO)
```

## Composables

### `useProductNavigation`

Maneja la navegación entre productos y categorías, asegurando que el estado del store se actualice correctamente antes de cambiar de ruta.

### `useCategories`

Obtiene y filtra las categorías principales para la navegación.

### `useProducts`

Obtiene la lista de productos, opcionalmente filtrada por categoría.

## Services

Los servicios (`getProducts`, `getProductById`, `getCategories`) envuelven las llamadas a la API y añaden una capa de **Logging** estandarizado.
