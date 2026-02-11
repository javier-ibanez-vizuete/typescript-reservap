type ProductImage = {
    url: string;
    webp: string;
    avif: string;
    alt: string;
}

export interface Product {
    name: string;
    description: string;
    categories: ProductsCategories[];
    price: number;
    deliveryPrice: number;
    image: ProductImage;
    createdAt: string;
    updatedAt: string;
    id: string;
}

export type ProductsCategories = "drinks" | "starters" | "mains" | "desserts" | "sides"