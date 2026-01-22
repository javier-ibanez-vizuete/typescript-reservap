import classNames from "classnames";
import { memo, useMemo } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { AVATAR_DATA } from "../data/avatarData";
import { useDevice } from "../hooks/useDevice";
import type { FormType } from "../pages/RegisterPage";
import { Dropdown } from "./Dropdown/Dropdown";
import DropdownItem from "./Dropdown/DropdownItem";
import DropdownMenu from "./Dropdown/DropdownMenu";
import { DropdownTrigger } from "./Dropdown/DropdownTrigger";
import Image from "./UI/Image";
import ImageContainer from "./UI/ImageContainer";

type AvatarSelectorProps = {
    field: ControllerRenderProps<FormType, "avatar">;
};

function AvatarSelector({ field }: AvatarSelectorProps) {
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();

    const autoBigSizeConfig = useMemo(
        () =>
            classNames({
                "w-20": isMobile2Xs || isMobileXs,
                "w-32": isMobileSm || isTablet,
                "w-48": isDesktop,
            }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop]
    );

    const autoSmallSizeConfig = useMemo(
        () =>
            classNames({
                "w-16": isMobile2Xs || isMobileXs,
                "w-20": isMobileSm || isTablet,
                "w-36": isDesktop,
            }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop]
    );

    const direction = isDesktop || isTablet ? "row" : "col";

    return (
        <Dropdown className="justify-center" placement="center-center">
            <DropdownTrigger variant="none" shadow={false}>
                <ImageContainer size={autoBigSizeConfig ?? ""}>
                    <Image imageData={field.value} className="rounded-md" />
                </ImageContainer>
            </DropdownTrigger>
            <DropdownMenu variant="background" direction={direction}>
                {AVATAR_DATA.map((avatar) => {
                    const isSelectedAvatar = field.value.url === avatar.url;
                    return (
                        <DropdownItem key={avatar?.url} onClick={() => field.onChange(avatar)}>
                            <ImageContainer size={autoSmallSizeConfig ?? ""}>
                                <Image
                                    imageData={avatar}
                                    className={isSelectedAvatar ? "animate-pulse" : ""}
                                />
                            </ImageContainer>
                        </DropdownItem>
                    );
                })}
            </DropdownMenu>
        </Dropdown>
    );
}

export default memo(AvatarSelector);
