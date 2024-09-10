import { createContext, useContext, useState, ReactNode, FC } from "react";
import useAxiosWithInterceptor from "../axios/AxiosWithInterceptor";
import { AxiosResponse } from "axios";

export type SearchType = {
  id?: number;
  type?: string;
  slug?: string;
};

interface SearchContextType {
  handleUserSearch: (data: SearchType | null) => void;
  handleSetup: (response: AxiosResponse<ProductResponse>) => void;
  products: Product[] | [];
  pagination: PaginationObject | null;
}

interface Image {
  id: number | null;
  image: string | null;
}
interface Size {
  id: number | null;
  size: { id: number; name: string } | null;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  brand: number;
  price: number;
  slug: string;
  productimage: Image[];
  productsize: Size[];
}

interface PaginationObject {
  next: string | null;
  previous: string | null;
  count: number | null;
}

interface ProductResponse {
  results: Product[];
  next: string | null;
  previous: string | null;
  count: number;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchContextProviderProps {
  children: ReactNode;
}

const SearchContextProvider: FC<SearchContextProviderProps> = ({
  children,
}) => {
  const axios = useAxiosWithInterceptor();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationObject | null>(null);

  const extractPath = (url: string | null) => {
    if (!url) return null;
    const urlObj = new URL(url);
    return urlObj.pathname + urlObj.search;
  };

  const handleSetup = (response: AxiosResponse<ProductResponse>) => {
    setProducts(response.data?.results);
    setPagination({
      next: extractPath(response.data?.next),
      previous: extractPath(response.data?.previous),
      count: response.data.count,
    });
  };

  const fetchProducts = async () => {
    try {
      const storedItem = JSON.parse(localStorage.getItem("search") || "{}");
      console.log(storedItem);
      if (storedItem) {
        const response = await axios.get(
          `api/product/${storedItem?.type}/${storedItem?.id}/`
        );
        if (response.status === 200) {
          handleSetup(response);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleUserSearch = async (data: SearchType | null) => {
    if (!data?.type || !data?.id) {
      console.log("data empty");
      fetchProducts();
    } else {
      localStorage.setItem("search", JSON.stringify(data));
      fetchProducts();
    }
  };

  return (
    <SearchContext.Provider
      value={{ handleUserSearch, handleSetup, products, pagination }}
    >
      {children}
    </SearchContext.Provider>
  );
};

const useSearchContext = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error(
      "useSearchContext must be used within a SearchContextProvider"
    );
  }
  return context;
};

export { SearchContextProvider, useSearchContext };
