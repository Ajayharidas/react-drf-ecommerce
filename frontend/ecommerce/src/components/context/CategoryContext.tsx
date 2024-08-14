import React, { createContext, ReactNode, useContext, useState } from "react";

interface Category {
  id: number;
  name: string;
}

interface Categories {
  parent_categories: Category[];
  child_categories: Category[];
}

interface CategoryContextType {
  categories: Categories | null;
  setCategories: React.Dispatch<React.SetStateAction<Categories | null>>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

interface CategoryContextProviderProps {
  children: ReactNode;
}

const CategoryContextProvider: React.FC<CategoryContextProviderProps> = ({
  children,
}) => {
  const [categories, setCategories] = useState<Categories | null>(null);

  return (
    <CategoryContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

const useCategoryContext = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error(
      "useCategoryContext must be used within a CategoryContextProvider"
    );
  }
  return context;
};

export { CategoryContextProvider, useCategoryContext };
