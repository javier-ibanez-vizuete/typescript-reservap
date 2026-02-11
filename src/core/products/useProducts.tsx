import { useCallback, useContext, useMemo, useState } from "react";
import { ProductsContext } from "../../contexts/ProductsContext";
import { useToast } from "../../contexts/ToastsContext";
import { useLoading } from "../../hooks/useLoading";
import { getProductsApi, getProductsCategoriesApi } from "./products.api";
import { saveProductsCategoriesInLocalStorage, saveProductsInLocalStorage } from "./products.service";

export const useProducts = () => {
    const productsContext = useContext(ProductsContext);

    const dataLoad = useLoading();

    const [productsError, setProductsError] = useState<boolean>(false);
    const { showToast } = useToast();

    if (!productsContext) throw new Error("UseProducts must be within a Products Provider");

    const { products, productsCategories, setProducts, setProductsCategories } = productsContext;

    const fetchAllProductsData = useCallback(async () => {
        try {
            dataLoad.setIsLoading(true);
            setProductsError(false);

            const [productsData, categoriesData] = await Promise.all([
                getProductsApi(),
                getProductsCategoriesApi(),
            ]);

            setProducts(productsData);
            saveProductsInLocalStorage(productsData);
            setProductsCategories(categoriesData);
            saveProductsCategoriesInLocalStorage(categoriesData);
        } catch (error) {
            showToast("ERROR AL CARGAR LOS DATOS", "error", 3000);
            setProductsError(true);
            throw error;
        } finally {
            dataLoad.setIsLoading(false);
        }
    }, [dataLoad, setProducts, setProductsCategories, showToast]);

    const useProductsValue = useMemo(
        () => ({
            products,
            productsCategories,
            fetchAllProductsData,
            dataLoad,
            productsError,
        }),
        [products, productsCategories, fetchAllProductsData, dataLoad, productsError]
    );

    return useProductsValue;
};
