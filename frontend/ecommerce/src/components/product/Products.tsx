import React, { useEffect, useState } from "react";
import useAxiosWithInterceptor from "../axios/AxiosWithInterceptor";
import { useSearchContext } from "../context/SearchContext";
import SideBar from "../common/SideBar";

const Products: React.FC = () => {
  const axios = useAxiosWithInterceptor();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOffcanvasVisible, setOffcanvasVisible] = useState<boolean>(false);
  const { products, pagination, handleSetup, handleUserSearch } =
    useSearchContext();

  useEffect(() => {
    products.length === 0 ? handleUserSearch(null) : null;
  }, []);


  const handleNextPage = async () => {
    if (pagination?.next) {
      const url = pagination.next;

      try {
        const response = await axios.get(url);
        if (response.status === 200) {
          handleSetup(response);
          setCurrentPage((prevPage) => prevPage + 1);
        }
      } catch (error) {
        console.error("Error fetching next page:", error);
      }
    }
  };

  const handlePreviousPage = async () => {
    if (pagination?.previous && currentPage > 1) {
      const url = pagination.previous;

      try {
        const response = await axios.get(url);
        if (response.status === 200) {
          handleSetup(response);
          setCurrentPage((prevPage) => prevPage - 1);
        }
      } catch (error) {
        console.error("Error fetching previous page:", error);
      }
    }
  };

  const toggleOffcanvas = () => {
    setOffcanvasVisible(!isOffcanvasVisible);
  };

  return (
    <>
      <div className="container-fluid w-100">
        <div className="row">
          <div className="col-md-3 col-12 mt-5">
            <button
              type="button"
              className="d-md-none d-sm-block bg-transparent border-0"
              onClick={toggleOffcanvas}
            >
              <span>
                <i
                  className="bi bi-filter-left"
                  style={{ fontSize: "xx-large" }}
                ></i>
              </span>
            </button>
            <ul></ul>
          </div>
          <SideBar
            isOffcanvasVisible={isOffcanvasVisible}
            toggleOffcanvas={toggleOffcanvas}
          />
          <div className="col-md-9 col-12">
            <div className="row my-5">
              {products && products.length > 0 ? (
                products.map((product) => {
                  console.log(product.productimage);
                  return (
                    <div className="col-6 col-sm-4 col-md-3" key={product.id}>
                      <div className="card h-100 rounded-0 border-0 product-card">
                        <img
                          src={`${product.productimage[0].image}`}
                          className="card-img-top h-75 rounded-0"
                          alt={`${product.productimage[0].image}`}
                        />
                        <div className="card-body py-1 text-uppercase"></div>
                        <div className="card-body">
                          <h5 className="card-title">{product.name}</h5>
                          <p className="card-text">{product.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No products</p>
              )}
            </div>
            <div className="row justify-content-center">
              {pagination ? (
                <div className="pagination-div">
                  <button
                    onClick={handlePreviousPage}
                    disabled={!pagination?.previous}
                  >
                    <i className="bi bi-arrow-left-circle-fill"></i>
                  </button>
                  <span>{currentPage}</span>
                  <button onClick={handleNextPage} disabled={!pagination?.next}>
                    <i className="bi bi-arrow-right-circle-fill"></i>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
