import { getSession } from "next-auth/client";
import axios from "../../../axios";
import { dbConnect } from "../../../utils/dbConnect";

const API_BASE_URL = process.env.SPOONTACULAR_BASE_URL;
const API_KEY = process.env.SPOONTACULAR_API_KEY;

/**
 * Get random recipes by a custom search term.
 * @param {object} req - http request.
 * @param {object} res - http response.
 * @returns an array of objects of recipes.
 */
const getRecipesBySearch = async (req, res) => {
  try {
    const { query } = req.query;

    // Max daily quota: 150 recipes
    // Endpoint: Recipe Complex Search

    const params = {
      apiKey: API_KEY,
      number: 51,
      minCalories: 0,
      minProtein: 0,
      minCarbs: 0,
      minFat: 0,
      random: true,
      query,
    };

    const { status, data } = await axios.get(
      API_BASE_URL + "/recipes/complexSearch",
      { params }
    );

    // Handle daily quota exceeded
    if (status === 402) {
      return res.status(200).json({
        success: false,
        error:
          "The Spoontacular API has exceeded it's daily limit. Come back tomorrow and search smartly :) ",
      });
    }

    if (status === 200) {
      const { results } = data;

      // Get & convert necessary data
      const plates = results.map(
        ({ id, title, image, nutrition: { nutrients } }) => {
          let calories, protein, carbs, fat;

          nutrients.map(({ name, amount }) => {
            switch (name) {
              case "Calories":
                calories = Math.round(amount);
                break;
              case "Protein":
                protein = Math.round(amount);
                break;
              case "Carbohydrates":
                carbs = Math.round(amount);
                break;
              case "Fat":
                fat = Math.round(amount);
                break;
            }
          });

          // Generate link
          const url = "https://spoontacular.com/recipes";
          const slug = title.split(" ").join("-").toLowerCase();
          const link = `${url}/${slug}-${id}`;

          return {
            id,
            link,
            category: "marketplace",
            name: title,
            picture: image,
            calories,
            protein,
            carbs,
            fat,
          };
        }
      );

      return res.status(200).json({ success: true, plates });
    }
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

  // Only allow authenticated users
  if (!userId) {
    return res.status(405).end({
      success: false,
      error: "You must be authenticated to make this request.",
    });
  }

  switch (method) {
    case "GET":
      return getRecipesBySearch(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
