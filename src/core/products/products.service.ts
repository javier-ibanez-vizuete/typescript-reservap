import { getDataFromStorage, removeFromStorage, saveDataInStorage } from "../../helper/storage";
import type { Product, ProductsCategories } from "./products.type";

export const saveProductsInLocalStorage = (products: Product[]) => saveDataInStorage("products", products)

export const getProductsFromLocalStorage = () => getDataFromStorage("products");

export const removeProductsFromLocalStorage = () => removeFromStorage("products");

export const saveProductsCategoriesInLocalStorage = (categories: ProductsCategories[]) => saveDataInStorage("categories", categories)

export const getProductsCategoriesFromLocalStorage = () => getDataFromStorage("categories");

export const removeProductsCategoriesFromLocalStorage = () => removeFromStorage("categories");