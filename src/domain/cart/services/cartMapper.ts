import type { CartDTO, CartItemDTO } from "../interface/BackendShapeCart";

export interface CartItem {
    productId: number;
    quantity: number;
    price: number;
    lineTotal: number;
}

export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    createdAt: string;
    updatedAt: string;
}

export function mapCartItemDTO(dto: CartItemDTO): CartItem {
    return {
        productId: dto.productId,
        quantity: dto.quantity,
        price: dto.price,
        lineTotal: dto.lineTotal,
    };
}

export function mapCartDTO(dto: CartDTO): Cart {
    return {
        id: dto.id,
        userId: dto.userId,
        items: dto.items.map(mapCartItemDTO),
        total: dto.total,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
    };
}

export function mapCartListDTO(payload: { carts: CartDTO[]; total: number }): { carts: Cart[]; total: number } {
    return {
        total: payload.total,
        carts: payload.carts.map(mapCartDTO),
    };
}
