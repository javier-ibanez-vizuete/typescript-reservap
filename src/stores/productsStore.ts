import { create } from "zustand";
import type { TypeOfToasts } from "../contexts/ToastsContext";
import { getProductsApi, getProductsCategoriesApi } from "../core/products/products.api";
import { getProductsCategoriesFromLocalStorage, getProductsFromLocalStorage, saveProductsCategoriesInLocalStorage, saveProductsInLocalStorage } from "../core/products/products.service";
import type { Product, ProductsCategories } from "../core/products/products.type";


type useProductsState = {
    products: Product[];
    categories: ProductsCategories[];
    isLoading: Boolean;
    productsError: Boolean;

    initializeFromStorage: () => void,
    fetchAllProductsData: (showToastCallback?: (msg: string, type: TypeOfToasts, duration: number) => string) => Promise<void>
    resetError: () => void
}

export const useProductsStore = create<useProductsState>((set) => ({
    products: [],
    categories: [],
    isLoading: false,
    productsError: false,

    initializeFromStorage: () => {
        const productsFromStorage = getProductsFromLocalStorage();
        const categoriesFromStorage = getProductsCategoriesFromLocalStorage();

        set({
            products: (productsFromStorage as Product[]) || [],
            categories: (categoriesFromStorage as ProductsCategories[]) || [],
        })
    },

    fetchAllProductsData: async (showToastCallback) => {
        set({ isLoading: true })
        try {
            const [productsData, categoriesData] = await Promise.all([getProductsApi(), getProductsCategoriesApi()]);

            set({
                products: productsData,
                categories: categoriesData
            })

            saveProductsInLocalStorage(productsData)
            saveProductsCategoriesInLocalStorage(categoriesData)

        } catch (error) {
            set({ productsError: true });
            showToastCallback?.("Error Loading Data", "error", 3000);
            throw error
        } finally {
            set({ isLoading: false })
        }
    },

    resetError: () => set({ productsError: false })
}));

useProductsStore.getState().initializeFromStorage();