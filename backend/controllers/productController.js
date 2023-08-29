exports.getProducts = async (req, res, next) => {
  return res.json({
    success: true,
    message: "this is products",
  });
};
