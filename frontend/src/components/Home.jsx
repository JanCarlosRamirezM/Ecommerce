import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProducts } from "../actions/productActions";
import { Product } from "./product";
import { MetaData, Loader } from "./layout";
import { useAlert } from "react-alert";

export const Home = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, products, productsCount } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (error) {
      return alert.error(error);
    }
    dispatch(getProducts());
  }, [dispatch, error, alert]);

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
              {products &&
                products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
            </div>
          </section>
        </>
      )}
    </>
  );
};
