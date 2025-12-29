import { productsClient } from '../../api/productsApi'
import type { CreateProductDto, ProductResponse } from '../../types/backendShape'
import { createProductSchema } from '../../types/product.schemas'

export class SaveProductUsecase {
  async execute(dto: CreateProductDto): Promise<ProductResponse> {
    const validated = createProductSchema.parse(dto)
    return productsClient.saveProduct(validated)
  }
}
