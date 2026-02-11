import { api } from "../http/axios";
import type { Product, ProductsCategories } from "./products.type";

export const getProductsApi = async (): Promise<Product[]> => {
    try {
        const response = await api.get("/products");
        return response.data
    } catch (error) {
        throw error
    }
}

export const getProductsCategoriesApi = async (): Promise<ProductsCategories[]> => {
    try {
        const response = await api.get("/products/categories");
        return response.data
    } catch (error) {
        throw error
    }
}