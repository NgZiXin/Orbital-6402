import { createContext} from 'react';

type LoadingContextType = {
    loading: boolean;
    showLoading: () => void;
    hideLoading: () => void;
  }
const LoadingContext = createContext<LoadingContextType| undefined>(undefined);
export default LoadingContext;
