export interface AdminInventoryDTO {
    productId: number;
    onHand: number;
    reserved: number;
    available: number;
    updatedAt: string;
}

export type AdjustStockType = 'INCREASE' | 'DECREASE' | 'SET';

export interface AdjustStockDto {
    quantity: number;
    type?: AdjustStockType;
    reason?: string;
    metadata?: Record<string, unknown>;
}
