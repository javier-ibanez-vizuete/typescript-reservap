import { useCallback, useEffect, useMemo, useState } from "react";
import { Dropdown } from "../components/Dropdown/Dropdown";
import DropdownItem from "../components/Dropdown/DropdownItem";
import DropdownMenu from "../components/Dropdown/DropdownMenu";
import { DropdownTrigger } from "../components/Dropdown/DropdownTrigger";
import NoContentPage from "../components/NoContentPage";
import ProductCard from "../components/Products/ProductCard";
import ProductsGrid from "../components/Products/ProductsGrid";
import { SkeletonCard } from "../components/Skeleton";
import Button from "../components/UI/Button";
import { Container } from "../components/UI/Container";
import type { ProductsCategories } from "../core/products/products.type";
import { getDataFromStorage } from "../helper/storage";
import { useDevice } from "../hooks/useDevice";
import { useProductsStore } from "../stores/productsStore";
import { useTranslate } from "../translations/useTranslate";
import { getFirstLetterCapital } from "../utils/textModications";

enum CategoryType {
    ALL = "all",
    DRINKS = "drinks",
    STARTERS = "starters",
    MAINS = "mains",
    DESSERTS = "dessert",
    SIDES = "sides",
}

export function MenuPage() {
    console.log("Render Menu Page");
    // const { products, productsCategories, fetchAllProductsData, dataLoad, productsError } = useProducts();
    const { products, categories, fetchAllProductsData, isLoading, productsError, resetError } =
        useProductsStore();
    const [selectedCategory, setSelectedCategory] = useState<ProductsCategories | "all">(() => {
        const categoryFromStorage = getDataFromStorage("selected_category");
        return (categoryFromStorage as ProductsCategories) || "all";
    });

    const { t } = useTranslate();
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();

    const onSelectCategory = useCallback(
        (category: ProductsCategories | "all") => setSelectedCategory(category),
        []
    );

    const handleResetFetchProducts = useCallback(() => {
        fetchAllProductsData();
        resetError();
    }, []);

    const MockedSkeletonCardLength = useMemo(() => {
        const mockedObject = { length: 4 };
        if (isMobile2Xs || isMobileXs) mockedObject.length = 3;
        if (isMobileSm) mockedObject.length = 6;
        if (isTablet) mockedObject.length = 9;
        if (isDesktop) mockedObject.length = 12;
        return mockedObject;
    }, [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop]);

    const filteredProducts = useMemo(() => {
        if (selectedCategory === CategoryType.ALL) return products;
        return products.filter(({ categories }) => categories.includes(selectedCategory));
    }, [selectedCategory, products]);

    useEffect(() => {}, []);

    const hasData = products?.length > 0 && categories?.length > 0;
    useEffect(() => {
        if (!hasData) fetchAllProductsData();
    }, [hasData]);

    if (productsError)
        return (
            <NoContentPage
                title={t("pages.menu_page.title")}
                content={t("pages.menu_page.error_content")}
                buttonText={t("pages.menu_page.error_text_button")}
                onClick={handleResetFetchProducts}
            />
        );
    return (
        <Container>
            <section className="flex flex-col gap-2">
                <h1>{t("pages.menu_page.title")}</h1>

                {isLoading && (
                    <ProductsGrid>
                        {Array.from(MockedSkeletonCardLength, (_, index) => (
                            <SkeletonCard
                                key={index}
                                showAvatar={false}
                                showImage={true}
                                showText={true}
                                textLines={3}
                                size="sm"
                            />
                        ))}
                    </ProductsGrid>
                )}

                {!isLoading && (
                    <>
                        <div className="flex items-center gap-2">
                            <Dropdown placement="right-start">
                                <DropdownTrigger variant="primary">{`${t("pages.menu_page.categories")} - ${getFirstLetterCapital(selectedCategory)}`}</DropdownTrigger>
                                <DropdownMenu variant="accent">
                                    <DropdownItem onClick={() => onSelectCategory(CategoryType.ALL)}>
                                        All
                                    </DropdownItem>
                                    {categories &&
                                        categories.map((category, index) => (
                                            <DropdownItem
                                                key={index}
                                                onClick={() => onSelectCategory(category)}
                                            >
                                                {getFirstLetterCapital(category)}
                                            </DropdownItem>
                                        ))}
                                </DropdownMenu>
                            </Dropdown>

                            {selectedCategory !== CategoryType.ALL && (
                                <Button
                                    variant="danger"
                                    onClick={() => setSelectedCategory(CategoryType.ALL)}
                                >
                                    {t("pages.menu_page.clear_filter")}
                                </Button>
                            )}
                        </div>

                        <ProductsGrid>
                            {filteredProducts.map((product) => {
                                return (
                                    <li key={product.id} className="flex">
                                        <ProductCard {...product} />
                                    </li>
                                );
                            })}
                        </ProductsGrid>
                    </>
                )}
            </section>
        </Container>
    );
}
