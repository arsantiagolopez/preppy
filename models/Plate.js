import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const PlateSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    protein: {
      type: Number,
      required: false,
    },
    carbs: {
      type: Number,
      required: false,
    },
    fat: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const Plate = models.Plate || model("Plate", PlateSchema);

export { Plate };
