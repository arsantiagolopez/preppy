import { getSession } from "next-auth/client";
import { Plate } from "../../../models/Plate";
import { dbConnect } from "../../../utils/dbConnect";

/**
 * Get plate object of ID.
 * @param {object} req - http request, including query.
 * @param {object} res - http response.
 * @returns an plate object.
 */
const getPlateById = async ({ query }, res) => {
  try {
    const { id } = query;
    const plate = await Plate.findById(id);
    return res.status(200).json(plate);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

/**
 * Update plate by ID.
 * @param {object} req - http request, including body and query.
 * @param {object} res - http response.
 * @returns an updated plate object.
 */
const updatePlate = async ({ body, query }, res) => {
  try {
    const { id } = query;
    const plate = await Plate.findByIdAndUpdate(id, body);
    return res.status(200).json(plate);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

/**
 * Delete plate by ID.
 * @param {object} req - http request, including query.
 * @param {object} res - http response.
 * @returns a success message on deletion.
 */
const deletePlate = async ({ query }, res) => {
  try {
    const { id } = query;
    await Plate.findByIdAndDelete(id);
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
      return getPlateById(req, res);
    case "PUT":
      return updatePlate(req, res);
    case "DELETE":
      return deletePlate(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
