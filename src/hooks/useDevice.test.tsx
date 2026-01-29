import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDevice } from "./useDevice";
import { useWindowWidth } from "./useWindowWidth";

vi.mock("./useWindowWidth.tsx", () => ({ useWindowWidth: vi.fn() }));
const mockedUseWindowWidth = vi.mocked(useWindowWidth);

const cases = [
    {
        width: 320,
        expected: {
            isMobile2Xs: true,
            isMobileXs: false,
            isMobileSm: false,
            isMobile: true,
            isTablet: false,
            isDesktop: false,
        },
    },
    {
        width: 390,
        expected: {
            isMobile2Xs: false,
            isMobileXs: true,
            isMobileSm: false,
            isMobile: true,
            isTablet: false,
            isDesktop: false,
        },
    },
    {
        width: 600,
        expected: {
            isMobile2Xs: false,
            isMobileXs: false,
            isMobileSm: true,
            isMobile: true,
            isTablet: false,
            isDesktop: false,
        },
    },
    {
        width: 800,
        expected: {
            isMobile2Xs: false,
            isMobileXs: false,
            isMobileSm: false,
            isMobile: false,
            isTablet: true,
            isDesktop: false,
        },
    },
    {
        width: 1200,
        expected: {
            isMobile2Xs: false,
            isMobileXs: false,
            isMobileSm: false,
            isMobile: false,
            isTablet: false,
            isDesktop: true,
        },
    },
];

describe("useDevice Custom Hook", () => {
    // =========================================
    // TESTING BREAKPOINTS
    // =========================================
    it.each(cases)("Returns correct breakpoints for every 'width'", ({ width, expected }) => {
        mockedUseWindowWidth.mockReturnValue(width);
        const { result } = renderHook(() => useDevice());
        expect(result.current).toEqual(expected);
    });
});
