import React, { useEffect } from "react";
import useAxiosWithInterceptor from "../axios/AxiosWithInterceptor";

const Products: React.FC = () => {
  const axios = useAxiosWithInterceptor();
  useEffect(() => {
    const fetch_products = async () => {
      await axios
        .get(`api/product/products/`, {})
        .then((response) => console.log(response))
        .catch((error) => console.error(error));
    };
    fetch_products();
  }, []);
  return <></>;
};

export default Products;
