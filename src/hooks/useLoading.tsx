import { useMemo, useState } from "react";

export const useLoading = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const useLoadingValue = useMemo(() => ({ isLoading, setIsLoading }), [isLoading]);

    return useLoadingValue;
};
