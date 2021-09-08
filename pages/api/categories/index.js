import { getSession } from "next-auth/client";
import { Category } from "../../../models/Category";
import { dbConnect } from "../../../utils/dbConnect";

/**
 * Get all categories created by userId.
 * @param {object} req - http request, including the userId.
 * @param {object} res - http response
 * @returns an array of strings of all user's categories.
 */
const getCategories = async ({ userId }, res) => {
  try {
    // Get all categories
    const categories = await Category.find({ userId });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

/**
 * Create category.
 * @param {object} req - http request, including body and userId.
 * @param {object} res - http response.
 * @returns a string of the category name.
 */
const createCategory = async ({ body, userId }, res) => {
  try {
    const { name } = body;

    const categoryExists = await Category.findOne({ name });

    // Prevent duplicate categories
    if (categoryExists) {
      return res
        .status(200)
        .json({ message: `Category "${name}" already exists` });
    }

    // Create default category "all" if not exists
    const defaultExists = await Category.findOne({ name: "all" });

    if (!defaultExists) {
      const defaultCategory = new Category({ name: "all" });
      defaultCategory.userId = userId;
      await defaultCategory.save();
    }

    // Create & associate category to user
    const category = new Category({ name });
    category.userId = userId;
    await category.save();

    return res.status(200).json(category);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

// Main
const handler = async (req, res) => {
  const { userId } = await getSession({ req });
  const { method } = req;

  await dbConnect();
  req.userId = userId;

  switch (method) {
    case "GET":
      return getCategories(req, res);
    case "POST":
      return createCategory(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
