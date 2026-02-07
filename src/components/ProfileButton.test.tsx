// @ts-nocheck
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "../core/auth/useAuth";
import { useLoading } from "../hooks/useLoading";
import { render, screen, waitFor } from "../test/test-utils";
import ProfileButton from "./ProfileButton";

vi.mock("../core/auth/useAuth");
vi.mock("../hooks/useLoading");

const mockNavigate = vi.fn();
const mockUseAuth = vi.mocked(useAuth);
const mockUseLoading = vi.mocked(useLoading);
const mockLogout = vi.fn();
const mockSetIsLoading = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: { url: "https://example.com/avatar.jpg", alt: "Example of avatar" },
    isActive: true,
};

describe("ProfileButton Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockUseAuth.mockReturnValue({
            user: mockUser,
            logout: mockLogout,
            login: vi.fn(),
            register: vi.fn(),
            isLoggedIn: true,
        });

        mockUseLoading.mockReturnValue({
            isLoading: false,
            setIsLoading: mockSetIsLoading,
        });
    });

    it("should return null when user is not available", () => {
        mockUseAuth.mockReturnValue({
            user: null,
            logout: mockLogout,
            login: vi.fn(),
            register: vi.fn(),
            isLoggedIn: false,
        });

        const { container } = render(<ProfileButton />);

        const profile = container.firstChild;

        expect(profile).toBeNull();
    });

    it("should render component with user data when logged in", () => {
        render(<ProfileButton />);

        const profile = screen.getByRole("menu");

        expect(profile).toBeInTheDocument();
        expect(profile).not.toBeNull();
    });

    it("should navigate to /user when profile button is clicked", async () => {
        const user = userEvent.setup();
        render(<ProfileButton />);

        const triggerButton = screen.getByRole("button");
        await user.click(triggerButton);

        const profile = screen.getByRole("menu");
        expect(profile).toHaveAttribute("aria-expanded", "true");

        const profileButton = screen.getByTestId("profile-button-navigation");
        expect(profileButton).toBeInTheDocument();
        expect(profileButton).not.toBeNull();

        await user.click(profileButton);

        expect(mockNavigate).toHaveBeenCalledWith("/user");
    });

    it("should call logout and navigate to home when logout button is clicked", async () => {
        const user = userEvent.setup();
        render(<ProfileButton />);

        const triggerButton = screen.getByRole("button");
        await user.click(triggerButton);

        const logoutButton = screen.getByTestId("logout-button-navigation");
        await user.click(logoutButton);

        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    it("should set loading state to true when logout starts", async () => {
        const user = userEvent.setup();
        render(<ProfileButton />);

        const triggerButton = screen.getByRole("button");
        await user.click(triggerButton);

        const logoutButton = screen.getByTestId("logout-button-navigation");
        await user.click(logoutButton);

        await waitFor(() => {
            expect(mockSetIsLoading).toHaveBeenCalledWith(true);
        });
    });

    it("should set loading state to false after logout completes", async () => {
        const user = userEvent.setup();
        render(<ProfileButton />);

        const triggerButton = screen.getByRole("button");
        await user.click(triggerButton);

        const logoutButton = screen.getByTestId("logout-button-navigation");
        await user.click(logoutButton);

        await waitFor(() => {
            expect(mockSetIsLoading).toHaveBeenCalledWith(false);
        });
    });

    it("should display loading text during logout process", async () => {
        const user = userEvent.setup();
        mockUseLoading.mockReturnValue({
            isLoading: true,
            setIsLoading: mockSetIsLoading,
        });

        render(<ProfileButton />);
        const triggerButton = screen.getByRole("button");

        await userEvent.click(triggerButton);

        const logoutButton = screen.getByTestId("logout-button-navigation");
        expect(logoutButton.textContent).not.toContain("Cerrar sesión");
        expect(logoutButton.textContent).toContain("Cerrando sesión");
    });

    it("should handle logout errors and still navigate to home", async () => {
        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        mockLogout.mockRejectedValue(new Error("Logout failed"));
        const user = userEvent.setup();
        render(<ProfileButton />);

        const triggerButton = screen.getByRole("button");
        await user.click(triggerButton);

        const logoutButton = screen.getByTestId("logout-button-navigation");
        await user.click(logoutButton);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(mockSetIsLoading).toHaveBeenCalledWith(false);
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    it("should call onClick prop when interacting with dropdown", async () => {
        const onClickMock = vi.fn();
        const user = userEvent.setup();
        render(<ProfileButton onClick={onClickMock} />);

        const dropdown = screen.getByRole("menu");

        const triggerButton = screen.getByRole("button");
        await waitFor(() => {
            user.click(triggerButton);
            expect(dropdown).toHaveAttribute("data-open", "true");
            expect(onClickMock).toHaveBeenCalledTimes(1);
            expect(onClickMock).toHaveBeenCalled();
        });
    });

    it("should render both buttons when user open dropdown profile and logout buttons", async () => {
        const user = userEvent.setup();
        render(<ProfileButton />);

        const triggerButton = screen.getByRole("button");
        await user.click(triggerButton);

        const profileButton = screen.getByTestId("profile-button-navigation");
        const logoutButton = screen.getByTestId("logout-button-navigation");

        expect(profileButton).toBeInTheDocument();
        expect(profileButton).not.toBeNull();
        expect(logoutButton).toBeInTheDocument();
        expect(logoutButton).not.toBeNull();
    });
});
