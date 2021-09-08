import { getSession } from "next-auth/client";
import { Schedule } from "../../../models/Schedule";
import { dbConnect } from "../../../utils/dbConnect";

/**
 * Get all schedules created by userId.
 * @param {object} req - http request, including the userId.
 * @param {object} res - http response
 * @returns an array of objects of all user's schedules.
 */
const getSchedules = async ({ userId }, res) => {
  try {
    // Get all schedules
    const schedules = await Schedule.find({ userId });
    return res.status(200).json(schedules);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

/**
 * Create schedule.
 * @param {object} req - http request, including body and userId.
 * @param {object} res - http response.
 * @returns an object of the schedule.
 */
const createSchedule = async ({ body, userId }, res) => {
  try {
    const { name } = body;

    const scheduleExists = await Schedule.findOne({ name });

    // Prevent duplicate schedules
    if (scheduleExists) {
      return res.status(200).json({
        success: false,
        message: `A schedule with name "${name}" already exists. Try a different name.`,
      });
    }

    // Create & associate schedule to user
    const schedule = new Schedule(body);
    schedule.userId = userId;
    await schedule.save();

    return res.status(200).json({ success: true, schedule });
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
      return getSchedules(req, res);
    case "POST":
      return createSchedule(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
