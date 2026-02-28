const Product = require("../../../models/productModel");
const fs = require("fs");

exports.createProduct = async (req, res) => {
  const file = req.file;
  let filePath;
  if (!file) {
    filePath =
      "https://imgs.search.brave.com/YDNobPVPyGup1S8F-0Gshf_iS1R-2TsVLAAV9FXsqlk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2FuaXR5LmlvL2lt/YWdlcy82eGllZGJk/cy9wcm9kdWN0aW9u/L2VlNDBiNGE3YWUw/NTVlZjQxYTcxZmRl/MGU4MjBjMzZkNmM4/ZTZlZTItMzYweDQ5/OS5qcGc_dz0zNjAm/YXV0bz1mb3JtYXQ";
  } else {
    filePath = req.file.filename;
  }

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
    productImage: process.env.BACKEND_URL + filePath,
  });
  res.status(201).json({
    message: "Product created successfully",
  });
};

exports.updateProduct = async (req, res) => {
  const {
    productName,
    productDescription,
    productStatus,
    productStockQty,
    productPrice,
  } = req.body;
  const { id } = req.params;
  if (
    !productName ||
    !productDescription ||
    !productStatus ||
    !productStockQty ||
    !productPrice ||
    !id
  ) {
    return res.status(400).json({
      message:
        "Please provide productName,productDescription,productStatus,productStockQty,productPrice and id",
    });
  }
  const oldData = await Product.findById(id);
  const oldImage = oldData.productImage;
  const lengthToCut = process.env.BACKEND_URL.length;
  const finalPathAfterCut = oldImage.slice(lengthToCut);
  if (req.file && req.file.filename) {
    fs.unlink("./uploads/" + finalPathAfterCut, (err) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log("File deleted successfully");
      }
    });
  }
  const updatedData = await Product.findByIdAndUpdate(
    id,
    {
      productName,
      productDescription,
      productStatus,
      productStockQty,
      productPrice,
      productImage:
        req.file && req.file.filename
          ? process.env.BACKEND_URL + req.file.filename
          : oldImage,
    },
    {
      new: true,
    },
  );
  res.status(200).json({
    message: "Product update successfully",
    data: updatedData,
  });
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Please provide id",
    });
  }
  const oldData = await Product.findById(id);
  const oldImage = oldData.productImage;
  const lengthToCut = process.env.BACKEND_URL.length;
  const finalPathAfterCut = oldImage.slice(lengthToCut);

  fs.unlink("./uploads/" + finalPathAfterCut, (err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("File deleted successfully");
    }
  });
  res.status(200).json({
    message: "Product deleted successfully",
  });
};
