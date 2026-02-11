import { createContext, useEffect, useMemo, useState, type ReactNode, type SetStateAction } from "react";
import {
    getProductsCategoriesFromLocalStorage,
    getProductsFromLocalStorage,
} from "../core/products/products.service";
import type { Product, ProductsCategories } from "../core/products/products.type";

type ProductsContextValue = {
    products: Product[];
    productsCategories: ProductsCategories[];
    setProducts: (value: SetStateAction<Product[]>) => void;
    setProductsCategories: (value: SetStateAction<ProductsCategories[]>) => void;
};

type ProductsProviderProps = {
    children: ReactNode;
};

export const ProductsContext = createContext<ProductsContextValue | null>(null);

export const ProductsProvider = ({ children }: ProductsProviderProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [productsCategories, setProductsCategories] = useState<ProductsCategories[]>([]);

    useEffect(() => {
        const productsFromStorage = getProductsFromLocalStorage();
        if (productsFromStorage) setProducts(productsFromStorage);

        const productsCategoriesFromStorage = getProductsCategoriesFromLocalStorage();
        if (productsCategoriesFromStorage) setProductsCategories(productsCategoriesFromStorage);
    }, []);

    const contextValue = useMemo(
        () => ({ products, productsCategories, setProducts, setProductsCategories }),
        [products, productsCategories]
    );
    return <ProductsContext value={contextValue}>{children}</ProductsContext>;
};
