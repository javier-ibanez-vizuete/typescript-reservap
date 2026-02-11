import { useCallback, useEffect, useMemo, useState } from "react";
import { Dropdown } from "../components/Dropdown/Dropdown";
import DropdownItem from "../components/Dropdown/DropdownItem";
import DropdownMenu from "../components/Dropdown/DropdownMenu";
import { DropdownTrigger } from "../components/Dropdown/DropdownTrigger";
import ProductCard from "../components/Products/ProductCard";
import ProductsGrid from "../components/Products/ProductsGrid";
import { SkeletonCard } from "../components/Skeleton";
import Button from "../components/UI/Button";
import { Container } from "../components/UI/Container";
import type { ProductsCategories } from "../core/products/products.type";
import { useProducts } from "../core/products/useProducts";
import { useDevice } from "../hooks/useDevice";
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
    const { products, productsCategories, fetchAllProductsData, dataLoad, productsError } = useProducts();
    const [selectedCategory, setSelectedCategory] = useState<ProductsCategories | "all">("all");

    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();

    const onSelectCategory = useCallback(
        (category: ProductsCategories | "all") => setSelectedCategory(category),
        []
    );

    const MockedSkeletonCardLength = useMemo(() => {
        const mockedObject = { length: 4 };
        if (isMobile2Xs || isMobileXs) mockedObject.length = 3;
        if (isMobileSm) mockedObject.length = 6;
        if (isTablet) mockedObject.length = 9;
        if (isDesktop) mockedObject.length = 12;
        return mockedObject;
    }, [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop]);
    // TODO: TERMINAR MENU PAGE.
    // TODO: METER PERSISTENCIA en getProducts()
    const hasData = products?.length > 0 && productsCategories?.length > 0;

    const filteredProducts = useMemo(() => {
        if (selectedCategory === CategoryType.ALL) return products;
        return products.filter(({ categories }) => categories.includes(selectedCategory));
    }, [selectedCategory, products]);

    useEffect(() => {
        if (!hasData) fetchAllProductsData();
    }, [hasData]);

    if (productsError)
        return (
            <Container>
                <h1>NO HAY PRODUCTOS</h1>
            </Container>
        );
    return (
        <Container>
            <section className="flex flex-col gap-2">
                <h1>PAGINA DE MENU</h1>

                {dataLoad.isLoading && (
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

                {!dataLoad.isLoading && (
                    <>
                        <div className="flex items-center gap-2">
                            <Dropdown placement="right-start">
                                <DropdownTrigger variant="primary">{`Categories - ${getFirstLetterCapital(selectedCategory)}`}</DropdownTrigger>
                                <DropdownMenu variant="accent">
                                    <DropdownItem onClick={() => onSelectCategory(CategoryType.ALL)}>
                                        All
                                    </DropdownItem>
                                    {productsCategories &&
                                        productsCategories.map((category, index) => (
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
                                    Clear Category
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
