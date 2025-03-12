import { useMutation } from "@tanstack/react-query";

export const useMutationHooks = (fnCallback) => {
    const mutation = useMutation({
        mutationFn: fnCallback,
    });

  

    return {
        ...mutation,
        isLoading: mutation.isPending ?? mutation.isLoading, // 🔥 Kiểm tra cả 2
    };
};
