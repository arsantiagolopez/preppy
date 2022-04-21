import { getSession } from "next-auth/client";
import { Schedule } from "../../../models/Schedule";
import { dbConnect } from "../../../utils/dbConnect";

/**
 * Get schedule object of ID.
 * @param {object} req - http request, including query.
 * @param {object} res - http response.
 * @returns an schedule object.
 */
const getScheduleById = async ({ query }, res) => {
  try {
    const { id } = query;
    const schedule = await Schedule.findById(id);
    return res.status(200).json(schedule);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

/**
 * Delete schedule by ID.
 * @param {object} req - http request, including query.
 * @param {object} res - http response.
 * @returns a success message on deletion.
 */
const deleteSchedule = async ({ query }, res) => {
  try {
    const { id } = query;
    await Schedule.findByIdAndDelete(id);
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
      return getScheduleById(req, res);
    case "DELETE":
      return deleteSchedule(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
