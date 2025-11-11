// Busca los productos segun title

import { getProducts } from "../../products/products/services/getProducts";
import type { ProductInterface } from "../../products/products/interfaces";

export const searchProductByTitle = async (title: string): Promise<ProductInterface[]> => {
  try {
    if (!title || title.trim().length === 0) {
      return [];
    }

    const allProducts = await getProducts();
    const filteredProducts = allProducts.filter(product =>
      product.title.toLowerCase().includes(title.toLowerCase().trim())
    );
    return filteredProducts;
  } catch (error) {
    console.error("Error searching products by title:", error);
    throw error;
  }
}
