import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../core/auth/useAuth";
import { useLoading } from "../hooks/useLoading";
import { useTranslate } from "../translations/useTranslate";
import Avatar from "./Avatar";
import { Dropdown } from "./Dropdown/Dropdown";
import DropdownMenu from "./Dropdown/DropdownMenu";
import { DropdownTrigger } from "./Dropdown/DropdownTrigger";
import LoadingButton from "./LoadingButton";
import Button from "./UI/Button";

export type ProfileButtonProps = {
    onClick: () => void;
};

function ProfileButton({ onClick }: ProfileButtonProps) {
    const { user } = useAuth();
    const { logout } = useAuth();

    const { isLoading, setIsLoading } = useLoading();
    const navigate = useNavigate();
    const { t } = useTranslate();

    const handleGoProfile = useCallback(() => navigate("/user"), [navigate]);

    const handleLogout = useCallback(async () => {
        setIsLoading(true);
        try {
            await logout();
        } catch (err) {
            console.error("Hubo un problema con el Logout 'Navbar-handleLogout()'", err);
        } finally {
            setIsLoading(false);
            navigate("/");
        }
    }, [navigate, logout]);
    // FALTA METERLE LAS PROPIEDADES A AVATAR CUANDO CREE EL LOGIN
    return (
        <Dropdown placement="bottom-end" onClick={onClick}>
            <DropdownTrigger variant="none" shadow={false}>
                <Avatar
                    // avatar={user?.avatar}
                    // alt="Avatar"
                    // online={user?.isActive}
                    // fallback={user?.name}
                    className="shadow-md"
                />
            </DropdownTrigger>
            <DropdownMenu variant="accent">
                <Button variant="primary" onClick={handleGoProfile}>
                    {t("components.profile_button.profile")}
                </Button>
                <LoadingButton
                    loading={isLoading}
                    loadingText={t("components.profile_button.loggin_out")}
                    variant="danger"
                    onClick={handleLogout}
                >
                    {t("components.profile_button.logout")}
                </LoadingButton>
            </DropdownMenu>
        </Dropdown>
    );
}

export default memo(ProfileButton);
