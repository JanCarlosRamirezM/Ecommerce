import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../actions/productActions";
import { Product } from "./product";
import { MetaData, Loader } from "./layout";
import { useAlert } from "react-alert";
import Pagination from "react-js-pagination";
import { useParams } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

export const Home = () => {
  const { keyword } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();
  const productsCountPerPage = 8;
  const categories = [
    "Electronics",
    "Cameras",
    "Laptops",
    "Accessories",
    "Headphones",
    "Food",
    "Books",
    "Clother/Shoes",
    "Sports",
    "Home",
  ];

  const {
    loading,
    error,
    products,
    productsCount,
    filteredProductCount,
  } = useSelector((state) => state.products);

  const [price, setPrice] = useState([1, 1000]);
  const [category, setCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (error) {
      return alert.error(error);
    }

    dispatch(
      getProducts(
        productsCountPerPage,
        currentPage,
        keyword,
        price,
        category,
        rating
      )
    );
  }, [dispatch, error, alert, currentPage, keyword, price, category, rating]);

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  let count = productsCount;
  if (keyword?.trim() !== "") {
    count = filteredProductCount;
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Buy best products on Ecommerce" />
          <h1 id="products_heading">Latest Products</h1>

          <section id="products" className="container mt-5">
            <div className="row">
              {keyword ? (
                <>
                  <div className="col-6 col-md-3 mt-5 mb-5">
                    <div className="px-5">
                      <Range
                        marks={{
                          1: `$1`,
                          1000: `$1000`,
                        }}
                        min={1}
                        max={1000}
                        defaultValue={[1, 1000]}
                        tipFormatter={(value) => `$${value}`}
                        tipProps={{ placement: "top" }}
                        value={price}
                        onChange={(price) => setPrice(price)}
                      />
                      <hr className="my-5" />
                      <div className="mt-5">
                        <h4 className="mb-3">Categories</h4>
                        <ul className="pl-0">
                          {categories.map((category) => (
                            <li
                              style={{
                                cursor: "pointer",
                                listStyleType: "none",
                              }}
                              key={category}
                              onClick={() => setCategory(category)}
                            >
                              {category}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <hr className="my-5" />
                      <div className="mt-5">
                        <h4 className="mb-3">Ratings</h4>
                        <ul className="pl-0">
                          {[5, 4, 3, 2, 1].map((start) => (
                            <li
                              style={{
                                cursor: "pointer",
                                listStyleType: "none",
                              }}
                              key={start}
                              onClick={() => setRating(start)}
                            >
                              <div className="rating-outer">
                                <div
                                  className="rating-inner"
                                  style={{ width: `${(start * 20)}%` }}
                                ></div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-9">
                    <div className="row">
                      {products &&
                        products.map((product) => (
                          <Product
                            key={product._id}
                            product={product}
                            col={4}
                          />
                        ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {products &&
                    products.map((product) => (
                      <Product key={product._id} product={product} col={3} />
                    ))}
                </>
              )}
            </div>
          </section>

          {productsCountPerPage < count && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={productsCountPerPage}
                totalItemsCount={count || 0}
                prevPageText="Prev"
                nextPageText="Next"
                firstPageText={"First"}
                lastPageText={"Last"}
                linkClass="page-link"
                itemClass="page-item"
                onChange={setCurrentPageNo}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};
