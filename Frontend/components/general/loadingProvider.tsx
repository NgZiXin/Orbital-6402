import { useState, useCallback } from "react";
import LoadingContext from "@/context/LoadingContext";

export default function LoadingProvider({ children }: any) {
    const [loading, setLoading] = useState<boolean>(false);
  
    const showLoading = useCallback(() => setLoading(true), []);
    const hideLoading = useCallback(() => setLoading(false), []);
  
    return (
      <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
        {children}
      </LoadingContext.Provider>
    );
  };