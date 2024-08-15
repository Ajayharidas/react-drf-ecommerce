import React, { useState } from "react";
import useAxiosWithInterceptor from "../axios/AxiosWithInterceptor";
import { Link } from "react-router-dom";

interface SearchModalProps {
  popupVisibility: boolean;
  setPopupVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  setBtnVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SearchItems {
  id: number;
  name: string;
  slug: string;
  type: string;
}

const SearchModal: React.FC<SearchModalProps> = ({
  popupVisibility,
  setPopupVisibility,
  setBtnVisibility,
}) => {
  const axios = useAxiosWithInterceptor();
  const [listVisibility, setListVisibility] = useState(false);
  const [items, setItems] = useState<SearchItems[]>([]);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    console.log(query);
    if (query.trim() === "") {
      setItems([]);
      setListVisibility(false);
      return;
    }
    try {
      const response = await axios.get<SearchItems[]>(
        `api/search/?query=${query}`
      );
      if (response.status === 200) {
        console.log(response.data);
        setItems(response.data || []);
        setListVisibility(true);
      }
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      setItems([]);
    }
  };
  return (
    <>
      <div
        className={`navbar-search-popup ${
          popupVisibility ? "visible" : "hidden"
        }`}
      >
        <div className="navbar-search-popup-child">
          <div className="input-group mb-1">
            <span className="input-group-text navbar-search-input-left-text">
              <i className="bi bi-search "></i>
            </span>
            <input
              type="text"
              className="form-control navbar-search-input"
              placeholder="type product or category name"
              aria-label="type product or category name"
              onChange={handleSearch}
            />
            <span
              className="input-group-text navbar-search-input-right-text"
              onClick={() => {
                setPopupVisibility(false);
                setListVisibility(false);
                setBtnVisibility(true);
              }}
            >
              <i className="bi bi-x-circle-fill"></i>
            </span>
          </div>
          <ul
            className={`navbar-search-ul ${
              listVisibility ? "visible" : "hidden"
            }`}
          >
            {items.length > 0 ? (
              items.map((item) => (
                <li
                  key={`${item.type}-${item.id}`}
                  className="navbar-search-li"
                >
                  <Link
                    to={
                      item.type === "category"
                        ? `category/${item.slug}`
                        : `product/${item.slug}`
                    }
                  >
                    {item.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="navbar-search-item">--- No items ---</li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SearchModal;
