import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const ScheduleSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plates: [
      {
        type: Schema.Types.ObjectId,
        ref: "Plate",
        required: true,
      },
    ],
    name: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      required: true,
    },
    schedule: [
      [
        {
          type: String,
          required: true,
        },
      ],
    ],
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const Schedule = models.Schedule || model("Schedule", ScheduleSchema);

export { Schedule };
