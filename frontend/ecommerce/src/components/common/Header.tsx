import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import SearchModal, { InputRef } from "./SearchModal";

const Header: React.FC = () => {
  const [btnVisibility, setBtnVisibility] = useState(true);
  const [popupVisibility, setPopupVisibility] = useState(false);
  const searchRef = useRef<InputRef | null>(null);
  const handlePopup = () => {
    setPopupVisibility(true);
    setBtnVisibility(false);
    searchRef.current?.focusInput();
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" to={"/"}>
                Home
              </Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link" to={"/products"}>
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={"/login"}>
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={"/logout"}>
                Log Out
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Dropdown
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#">
                  Action
                </a>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </div>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={"/register"}>
                Sign Up
              </Link>
            </li>
          </ul>
          <SearchModal
            ref={searchRef}
            popupVisibility={popupVisibility}
            setPopupVisibility={setPopupVisibility}
            setBtnVisibility={setBtnVisibility}
          />
          <div className="ml-auto flex-grow-1">
            <button
              className={`my-2 my-lg-0 btn navbar-search-btn ${
                btnVisibility ? "visible" : "hidden"
              }`}
              onClick={handlePopup}
            >
              <i className="bi bi-search "></i>
              <span className="navbar-search-text">Type to search</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
