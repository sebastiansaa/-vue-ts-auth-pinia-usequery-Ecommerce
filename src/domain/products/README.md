# Products Domain

## Propósito

Catálogo de productos con búsqueda, filtrado por categorías, navegación de detalles y CRUD admin.

## Vistas / Rutas

| Ruta                        | Params/Props                     | Propósito                                         |
| --------------------------- | -------------------------------- | ------------------------------------------------- |
| `/products/:categoryId`     | `categoryId` (number)            | Listado de productos por categoría con paginación |
| `/products/:categoryId/:id` | `categoryId`, `id` (props: true) | Detalle de producto individual                    |

## Guards / Políticas

- **Sin guards en rutas públicas**: Listado y detalle accesibles sin autenticación
- **adminGuard en panel admin**: CRUD de productos requiere rol `admin` (rutas `/admin/products/*`)

## Estados Clave

| Estado                         | Descripción            | Impacto Usuario/Módulos    |
| ------------------------------ | ---------------------- | -------------------------- |
| `isLoading: true`              | Cargando productos     | Muestra skeleton cards     |
| `products: []`                 | Sin resultados         | Muestra "No hay productos" |
| `selectedProduct: null`        | Producto no encontrado | Muestra 404 en detalle     |
| `lowStock: ProductInterface[]` | Stock < threshold      | Alerta en panel admin      |

## Integración

### Stores/Composables Exportados

- **productsStore**: `setProductsList()`, `selectProduct()`, `selectProductById()`, `resetSelection()`, getters `productsList`, `selectedProductDTO`
- **useProducts**: Query paginada con filtros (page, limit, categoryId)
- **useProductById**: Query individual con `staleTime: 5min`
- **useCategories**: Query de categorías con caché extendido
- **useProductNavigation**: Helper para navegación prev/next en listados

### Eventos Globales

- **No dispara eventos**: Operaciones síncronas
- **No escucha eventos**: Autónomo

### Variables de Entorno

- **No lee envs**: Usa configuración global de Axios

## Invariantes / Reglas UI

- **Paginación client-side**: Store mantiene lista completa, componentes paginan en memoria (optimización futura: server-side)
- **Selección temporal**: `selectedProduct` en store solo para navegación prev/next, no persiste en localStorage
- **Admin CRUD con validación**: `assertAdmin()` verifica rol antes de ejecutar operaciones, lanza error + toast si falla
