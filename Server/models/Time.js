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
    quote: {
      type: String,
      default: "",
    },
    history: [
      {
        time: { type: Number, required: true },
        updatedAt: { type: Date, default: Date.now },
        quote: { type: String },
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
