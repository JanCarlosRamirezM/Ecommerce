import React from "react";

export const Footer = () => {
  return (
    <>
      <footer className="py-1">
        <p className="text-center mt-1 ">
          © {new Date().getFullYear()} Copyright: Ecommerce
        </p>
      </footer>
    </>
  );
};
