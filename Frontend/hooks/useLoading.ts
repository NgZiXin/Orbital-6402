import { useContext } from "react";
import LoadingContext from "@/context/LoadingContext";

// Custom context hook
export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
      throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};