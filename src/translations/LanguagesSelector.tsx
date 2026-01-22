import { memo, useMemo } from "react";

import classNames from "classnames";
import { useTranslation } from "react-i18next";

import { Dropdown, type DropdownPlacementValues } from "../components/Dropdown/Dropdown";
import DropdownItem from "../components/Dropdown/DropdownItem";
import DropdownMenu from "../components/Dropdown/DropdownMenu";
import { DropdownTrigger } from "../components/Dropdown/DropdownTrigger";
import Image from "../components/UI/Image";
import ImageContainer from "../components/UI/ImageContainer";
import { FLAGS_URL_DATA } from "../data/flagsData";
import { useDevice } from "../hooks/useDevice";
import type { LanguageKey } from "../types/index.type";

export type LanguagesSelectorProps = {
    placement?: DropdownPlacementValues;
    onClick?: () => void;
};

function LanguagesSelector({ placement = "bottom-start", onClick = () => {} }: LanguagesSelectorProps) {
    const { i18n } = useTranslation();
    const languages = Object.keys(i18n.options.resources ?? {});
    const language = i18n?.language as LanguageKey;
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();

    const languagesMap: { [key: string]: string } = {
        es: "Español",
        en: "English",
        fr: "François",
        de: "Deutsch",
        zh: "中文",
    };

    const iconsSizeConfig = useMemo(
        () =>
            classNames({
                "w-6": isMobile2Xs,
                "w-7": isMobileXs,
                "w-8": isMobileSm,
                "w-9": isTablet,
                "w-10": isDesktop,
            }),
        [isMobile2Xs, isMobileSm, isMobileXs, isTablet, isDesktop]
    );

    return (
        <Dropdown placement={placement} className="rounded-full" onClick={onClick}>
            <DropdownTrigger className="active:scale-95" variant="none" shadow={false}>
                <ImageContainer size={iconsSizeConfig}>
                    <Image imageData={FLAGS_URL_DATA[language]} />
                </ImageContainer>
            </DropdownTrigger>
            <DropdownMenu variant="accent">
                {languages.map((language) => (
                    <DropdownItem
                        key={language}
                        onClick={() => i18n.changeLanguage(language)}
                        className="perfect-center gap-2"
                    >
                        <span>{languagesMap[language]}</span>
                        <ImageContainer size={iconsSizeConfig}>
                            <Image imageData={FLAGS_URL_DATA[language as LanguageKey]} />
                        </ImageContainer>
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
}

export default memo(LanguagesSelector);
