export type OrderType = {
    userId: string;
    items: ItemType[];
    status: "pending" | "preparing" | "delivered" | "cancelled";
    subtotal: number;
    tax: number;
    total: number;
    placedAt: string;
    createdAt: string;
    updatedAt: string;
    id: string;
}

type ItemType = {
    productId: string;
    qty: number;
    price: number;
    name: string;
}