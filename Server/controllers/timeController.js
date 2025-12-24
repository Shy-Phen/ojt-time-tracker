import Time from "../models/Time.js";
import { getRandomQuote } from "../lib/quote.js";
import mongoose from "mongoose";

export const createTime = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    console.log("hit");
    const { goalTime } = req.body;
    const owner = req.user._id;

    if (!goalTime || goalTime <= 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Goal time is required and must be greater than 0",
      });
    }

    const time = await Time.create(
      [
        {
          goalTime,
          currentTime: 0,
          history: [],
          owner,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    console.log(goalTime);

    res.status(201).json({
      success: true,
      message: "Time record created successfully",
      data: time[0],
    });
  } catch (error) {
    await session.abortTransaction();
    console.log("Error in creating time:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const updateTime = async (req, res) => {
  let session = null;

  try {
    // Start MongoDB session for transaction
    session = await mongoose.startSession();
    console.log("Update reach");

    const userId = req.user._id;

    const { adjustment } = req.body;
    console.log(adjustment);

    // Validation: Check if adjustment exists
    if (adjustment === undefined || adjustment === null) {
      return res.status(400).json({
        success: false,
        error: "adjustment is required",
        code: "MISSING_ADJUSTMENT",
      });
    }

    // Validation: Check if adjustment is a valid number
    if (typeof adjustment !== "number" || isNaN(adjustment)) {
      return res.status(400).json({
        success: false,
        error: "adjustment must be a valid number",
        code: "INVALID_NUMBER",
      });
    }

    // Validation: Check if adjustment is zero
    if (adjustment === 0) {
      return res.status(400).json({
        success: false,
        error: "adjustment cannot be zero",
        code: "ZERO_ADJUSTMENT",
      });
    }

    session.startTransaction();

    // Get user's current time record
    const userTime = await Time.findOne({ owner: userId }).session(session);

    if (!userTime) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        error: "User doesn't have a time record",
        code: "TIME_RECORD_NOT_FOUND",
      });
    }

    // 🔥 HERE'S THE CALCULATION FOR NEGATIVE ADJUSTMENTS 🔥
    // Calculate what the new time would be after applying the adjustment
    const currentTime = userTime.currentTime;
    const newCurrentTime = currentTime + adjustment;

    // If adjustment is negative (decrease), check if we have enough time
    if (adjustment < 0) {
      const decreaseAmount = Math.abs(adjustment);

      // Check if trying to decrease more than current time
      if (decreaseAmount > currentTime) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          error: `Cannot decrease time by ${decreaseAmount} hours. Current time is only ${currentTime} hours. Maximum decrease allowed is ${currentTime} hours.`,
          code: "INSUFFICIENT_TIME",
          data: {
            currentTime: currentTime,
            requestedDecrease: decreaseAmount,
            maximumDecrease: currentTime,
            resultingTime: newCurrentTime, // This would be negative
          },
        });
      }

      // Check if decrease would result in exactly 0 or less
      if (newCurrentTime <= 0) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          error: `Decreasing by ${decreaseAmount} hours would result in ${newCurrentTime} hours. Time cannot be zero or negative.`,
          code: "TIME_WOULD_BE_ZERO_OR_NEGATIVE",
          data: {
            currentTime: currentTime,
            requestedDecrease: decreaseAmount,
            resultingTime: newCurrentTime,
          },
        });
      }
    }

    // Get a random quote
    const quote = getRandomQuote();

    const currentDate = new Date();

    // Apply the adjustment (works for both positive and negative)
    const updatedTime = await Time.findOneAndUpdate(
      { _id: userTime._id },
      {
        $inc: { currentTime: adjustment }, // This handles both + and -
        $push: {
          history: {
            addedTime: adjustment,
            quote,
            updatedAt: currentDate,
          },
        },
        $set: { updatedAt: currentDate },
      },
      {
        new: true,
        runValidators: true,
        session: session,
      }
    );

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message:
        adjustment > 0
          ? `Successfully increased time by ${adjustment} hours`
          : `Successfully decreased time by ${Math.abs(adjustment)} hours`,
      data: {
        adjustment,
        quote,
        previousTime: currentTime,
        currentTime: updatedTime.currentTime,
        goalTime: updatedTime.goalTime,
        updatedAt: updatedTime.updatedAt,
        change: adjustment > 0 ? `+${adjustment}` : `${adjustment}`,
      },
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }

    console.error("Update time error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Data validation failed",
        details: error.message,
        code: "VALIDATION_ERROR",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "Duplicate entry detected",
        code: "DUPLICATE_ENTRY",
      });
    }

    if (error.name === "MongoError" || error.name === "MongoServerError") {
      return res.status(503).json({
        success: false,
        error: "Database service unavailable",
        code: "DATABASE_ERROR",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal server error",
      code: "SERVER_ERROR",
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

export const getTime = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userId = req.user._id;
    console.log(userId);

    const userTime = await Time.findOne({
      owner: userId,
    }).session(session);

    if (!userTime) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        error:
          "Time record not found or you don't have permission to access it",
      });
    }

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      data: userTime,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error in fetching time:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  } finally {
    session.endSession();
  }
};

export const viewHistory = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { userId } = await req.auth();
    const { id } = req.params;

    const userTime = await Time.findOne({
      _id: id,
      owner: userId,
    }).session(session);

    if (!userTime) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        error:
          "Time record not found or you don't have permission to access it",
      });
    }

    const history = userTime.history || [];

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      data: {
        history,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error in fetching time history:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  } finally {
    session.endSession();
  }
};

export const deleteTime = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userId = await req.user._id;

    const userTime = await Time.findOne({
      owner: userId,
    }).session(session);

    if (!userTime) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        error:
          "Time record not found or you don't have permission to access it",
      });
    }

    const resetTime = await Time.findOneAndDelete({ owner: userId }).session(
      session
    );

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Time record reset successfully",
      data: {
        currentTime: resetTime.currentTime,
        goalTime: resetTime.goalTime,
        historyCleared: true,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error in deleting/resetting time:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};
