import { useState } from "react";
import LoadingContext from "@/context/LoadingContext";

export default function LoadingProvider({ children }: any) {
    const [loading, setLoading] = useState<boolean>(false);
  
    const showLoading = () => setLoading(true);
    const hideLoading = () => setLoading(false);
  
    return (
      <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
        {children}
      </LoadingContext.Provider>
    );
  };