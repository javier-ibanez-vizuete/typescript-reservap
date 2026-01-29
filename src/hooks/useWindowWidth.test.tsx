import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "../test/test-utils";
import { useWindowWidth } from "./useWindowWidth";

describe("useWindowWidth Custom Hook", () => {
    // =======================================
    // TESTING WINDOW WIDTH
    // =======================================

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("Updates width when window is resized", () => {
        window.innerWidth = 320;
        const { result } = renderHook(() => useWindowWidth());
        expect(result.current).toBe(320);

        act(() => {
            window.innerWidth = 390;
            window.dispatchEvent(new Event("resize"));
            vi.advanceTimersByTime(150);
        });

        expect(result.current).toBe(390);

        act(() => {
            window.innerWidth = 600;
            window.dispatchEvent(new Event("resize"));
            vi.advanceTimersByTime(150);
        });

        expect(result.current).toBe(600);

        act(() => {
            window.innerWidth = 800;
            window.dispatchEvent(new Event("resize"));
            vi.advanceTimersByTime(150);
        });

        act(() => {
            window.innerWidth = 1200;
            window.dispatchEvent(new Event("resize"));
            vi.advanceTimersByTime(150);
        });
        expect(result.current).toBe(1200);
    });
});
