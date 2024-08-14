import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useCategoryContext } from "../context/CategoryContext";
import useAxiosWithInterceptor from "../axios/AxiosWithInterceptor";
import { Link } from "react-router-dom";

interface Category {
  id: number;
  name: string;
}

interface Categories {
  parent_categories: Category[];
  child_categories: Category[];
}

const Home: React.FC = () => {
  const axios = useAxiosWithInterceptor();
  const { isAuthenticated, user, verifyToken } = useUserContext();
  const { categories, setCategories } = useCategoryContext();
  const [loading, setLoading] = useState(true);

  const fetchInitialData = async () => {
    try {
      const response = await axios.get<Categories>("api/home/");
      setCategories({
        parent_categories: response.data.parent_categories,
        child_categories: response.data.child_categories,
      });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
    fetchInitialData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  console.log(categories);

  return (
    <>
      {isAuthenticated ? (
        <p>{`Welcome ${user?.first_name} ${user?.last_name}`}</p>
      ) : (
        <p>Welcome anonymous user</p>
      )}
      {categories && categories.parent_categories.length > 0 ? (
        categories.parent_categories.map((category) => (
          <Link key={category.id} to={`/`}>
            {category.name}
          </Link>
        ))
      ) : (
        <p>No categories available</p>
      )}
      {categories && categories.child_categories.length > 0 ? (
        categories.child_categories.map((category) => {
          <Link key={category.id} to={"/"}>
            {category.name}
          </Link>;
        })
      ) : (
        <p>No sub categories</p>
      )}
    </>
  );
};

export default Home;
