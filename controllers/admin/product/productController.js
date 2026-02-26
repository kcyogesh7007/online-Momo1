const Product = require("../../../models/productModel");

exports.createProduct = async (req, res) => {
  const {
    productName,
    productDescription,
    productStatus,
    productStockQty,
    productPrice,
  } = req.body;
  if (
    !productName ||
    !productDescription ||
    !productStatus ||
    !productStockQty ||
    !productPrice
  ) {
    return res.status(400).json({
      message:
        "Please provide productName,productDescription,productStatus,productStockQty,productPrice",
    });
  }
  await Product.create({
    productName,
    productDescription,
    productStatus,
    productStockQty,
    productPrice,
  });
  res.status(201).json({
    message: "Product created successfully",
  });
};
