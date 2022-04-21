import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const CategorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const Category = models.Category || model("Category", CategorySchema);

export { Category };
