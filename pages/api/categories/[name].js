import { getSession } from "next-auth/client";
import { Category } from "../../../models/Category";
import { Plate } from "../../../models/Plate";
import { dbConnect } from "../../../utils/dbConnect";

/**
 * Get all plates under a category.
 * @param {object} req - http request, including query and userId.
 * @param {object} res - http response.
 * @returns an array of plate objects.
 */
const getCategoryPlates = async ({ query, userId }, res) => {
  try {
    const { name } = query;

    // If default category "all" return all plates
    if (name === "all") {
      const all = await Plate.find({ userId });
      return res.status(200).json(all);
    }

    // Get all the category plates
    const plates = await Plate.find({ userId, category: name });
    return res.status(200).json(plates);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

/**
 * Delete category by name.
 * @param {object} req - http request, including query and userId.
 * @param {object} res - http response.
 * @returns a success message on deletion.
 */
const deleteCategory = async ({ query, userId }, res) => {
  try {
    const { name } = query;

    // Find all plates under category to be deleted
    await Plate.updateMany({ userId, category: name }, { category: "all" });

    // Delete category
    await Category.findOneAndDelete({ name });
    return res.status(200).json({ message: "Succesfully deleted." });
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
      return getCategoryPlates(req, res);
    case "DELETE":
      return deleteCategory(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
