import { getSession } from "next-auth/client";
import { Plate } from "../../../models/Plate";
import { dbConnect } from "../../../utils/dbConnect";

/**
 * Get all plates object created by userId.
 * @param {object} req - http request, including the userId.
 * @param {object} res - http response.
 * @returns an array of objects of all user's plates.
 */
const getPlates = async ({ userId }, res) => {
  try {
    const plates = await Plate.find({ userId });
    return res.status(200).json(plates);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

/**
 * Create plate with passed down params.
 * @param {object} req - http request, including body and userId.
 * @param {object} res - http response.
 * @returns an object of the newly created plate.
 */
const createPlate = async ({ body, userId }, res) => {
  try {
    let { name, category } = body;

    const duplicateName = await Plate.findOne({ name });

    // Prevent duplicates
    if (duplicateName) {
      // If category is "marketplace", alter name and bypass check
      if (category === "marketplace") {
        name = name + " (1)";
      } else {
        return res.status(200).json({
          success: false,
          message: "Plate with that name already exists. Try a different one!",
        });
      }
    }

    const plate = new Plate({ name, ...body });

    plate.userId = userId;
    await plate.save();

    return res.status(200).json({ success: true, plate });
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
      return getPlates(req, res);
    case "POST":
      return createPlate(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
