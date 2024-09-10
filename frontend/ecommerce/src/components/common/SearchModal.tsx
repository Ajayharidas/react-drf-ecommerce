import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import useAxiosWithInterceptor from "../axios/AxiosWithInterceptor";
import { Link } from "react-router-dom";
import { useSearchContext } from "../context/SearchContext";

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

export type InputRef = {
  focusInput: () => void;
};

const SearchModal = (props: SearchModalProps, ref: React.Ref<InputRef>) => {
  const axios = useAxiosWithInterceptor();
  const [listVisibility, setListVisibility] = useState(false);
  const [items, setItems] = useState<SearchItems[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchRef = useRef<HTMLInputElement | null>(null);
  const { handleUserSearch } = useSearchContext();

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    console.log(searchQuery);
    if (searchQuery === "") {
      setItems([]);
      setListVisibility(false);
      return;
    }
    try {
      const response = await axios.get<SearchItems[]>(
        `api/search/?query=${searchQuery.trim()}`
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

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 100);
    },
  }));

  const handleVisibility = (id?: number, type?: string, slug?: string) => {
    if (id && type && slug) {
      handleUserSearch({
        id: id,
        type: type,
        slug: slug,
      });
    }
    props.setPopupVisibility(false);
    setListVisibility(false);
    props.setBtnVisibility(true);
    setSearchQuery("");
  };

  console.log(searchRef.current);
  return (
    <>
      <div
        className={`navbar-search-popup ${
          props.popupVisibility ? "visible" : "hidden"
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
              value={searchQuery}
              ref={searchRef}
            />
            <span
              className="input-group-text navbar-search-input-right-text"
              onClick={() => handleVisibility()}
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
                <li key={item.id} className="navbar-search-li">
                  <Link
                    to={`${item.type === "brand" ? "brand" : "category"}/${
                      item.slug
                    }`}
                    onClick={() =>
                      handleVisibility(item.id, item.type, item.slug)
                    }
                  >
                    {item.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="navbar-search-li">--- No items ---</li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default forwardRef(SearchModal);
