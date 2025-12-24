import mongoose from "mongoose";

const timeSchema = new mongoose.Schema(
  {
    currentTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    goalTime: {
      type: Number,
      required: true,
      min: 0,
    },

    history: [
      {
        addedTime: {
          type: Number,
          required: true,
          min: 0,
        },
        quote: {
          type: String,
          required: true,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Time = mongoose.model("Time", timeSchema);

export default Time;
