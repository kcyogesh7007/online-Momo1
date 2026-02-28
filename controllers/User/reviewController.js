const Product = require("../../models/productModel");
const Review = require("../../models/reviewModel");

//create review
exports.createReview = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.id;
  const { rating, message } = req.body;
  if (!productId || !rating || !message) {
    return res.status(400).json({
      message: "Please provide rating,message and productId",
    });
  }
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      message: "No product found with that id",
    });
  }
  await Review.create({
    userId,
    rating,
    message,
    productId,
  });
  res.status(201).json({
    message: "Review created successfully",
  });
};

//getMyReview
exports.getMyReview = async (req, res) => {
  const userId = req.user._id;
  const review = await Review.find({ userId });
  if (review.length == 0) {
    return res.status(404).json({
      message: "You havenot given review to any products yet",
    });
  }
  res.status(200).json({
    message: "Review fetched successfully",
    data: review,
  });
};

//delete review
exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  const idOfUser = req.user._id;
  if (!id) {
    return res.status(400).json({
      message: "Please provide id",
    });
  }
  const review = await Review.findById(id);
  if (!review) {
    return res.status(404).json({
      message: "No Review found with that id",
    });
  }
  const ownerIdOfReview = review.userId;
  if (ownerIdOfReview.toString() !== idOfUser.toString()) {
    return res.status(403).json({
      message: "You dont have permission for this",
    });
  }

  await Review.findByIdAndDelete(id);
  res.status(200).json({
    message: "Review deleted successfully",
  });
};
