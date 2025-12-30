import Time from "../models/Time.js";
import { getRandomQuote } from "../lib/quote.js";
import mongoose from "mongoose";
import ExcelJS from "exceljs";

export const createTime = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    console.log("hit");
    const { goalTime } = req.body;
    const owner = req.userId;

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

    const userId = req.userId;

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

    console.log("HIjrtrj");
    if (newCurrentTime > userTime.goalTime) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, error: "Error exceeed" });
    }

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
      if (newCurrentTime < 0) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          error: `Decreasing by ${decreaseAmount} hours would result in ${newCurrentTime} hours. Time cannot be zero or negative.`,
        });
      }

      console.log("Hittt");
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
    await session.abortTransaction();
    console.error("Error in updating time:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  } finally {
    session.endSession();
  }
};

export const getTime = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userId = req.userId;
    console.log(userId);

    const userTime = await Time.findOne({
      owner: userId,
    }).session(session);

    await session.commitTransaction();

    // Return null/empty data instead of 404
    if (!userTime) {
      return res.status(200).json({
        success: true,
        data: null, // or you could return a default structure
      });
    }

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

export const deleteTime = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userId = await req.userId;

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

export const downloadToExcel = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userId = req.userId;
    console.log("here", userId);

    const userTime = await Time.findOne({
      owner: userId,
    }).session(session);

    await session.commitTransaction();

    // Check if there's data to export
    if (!userTime || !userTime?.history) {
      return res.status(200).json({
        success: true,
        message: "No data available for export",
        data: null,
      });
    }

    console.log(userTime);
    const dataToDownload = userTime.history;

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Time Tracker App";
    workbook.created = new Date();

    const mainSheet = workbook.addWorksheet("Time History");

    // Define columns based on your data structure
    mainSheet.columns = [
      { header: "Date Updated", key: "date", width: 20 },
      { header: "Time Added", key: "addedTime", width: 15 },
      { header: "Quote", key: "quote", width: 60 },
    ];

    // Format date function
    const formatDate = (date) => {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    // Format time function
    const formatTime = (date) => {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    // Add data rows - mapping your data structure
    dataToDownload.forEach((row, index) => {
      const date = row.updatedAt;
      mainSheet.addRow({
        date: `${formatDate(date)} ${formatTime(date)}`,
        addedTime: row.addedTime,
        quote: row.quote,
      });

      // Optional: Add row number if needed
      // mainSheet.getCell(`A${index + 2}`).value = index + 1;
    });

    // ========== STYLE HEADER ROW ==========
    // Mid Blue Header (#4F81BD)
    const headerRow = mainSheet.getRow(1);
    headerRow.height = 25; // Set header row height

    headerRow.eachCell((cell) => {
      // Font styling
      cell.font = {
        bold: true,
        color: { argb: "FFFFFFFF" }, // White text
        size: 11,
        name: "Calibri",
      };

      // Background color - Mid Blue
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4F81BD" },
      };

      // Alignment
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };

      // Borders
      cell.border = {
        top: { style: "thin", color: { argb: "FF2F5597" } },
        left: { style: "thin", color: { argb: "FF2F5597" } },
        bottom: { style: "thin", color: { argb: "FF2F5597" } },
        right: { style: "thin", color: { argb: "FF2F5597" } },
      };
    });

    // ========== STYLE DATA ROWS ==========
    // Normal formatting for data rows
    for (let i = 2; i <= mainSheet.rowCount; i++) {
      const row = mainSheet.getRow(i);
      row.height = 20; // Set data row height

      row.eachCell((cell, colNumber) => {
        // Basic font
        cell.font = {
          size: 10,
          name: "Calibri",
        };

        // Alignment - center for numbers, left for text
        if (colNumber === 2) {
          // Added Time column
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
          };
          // Format as number
          cell.numFmt = "0";
        } else {
          cell.alignment = {
            vertical: "middle",
            horizontal: "left",
            wrapText: true,
          };
        }

        // Light borders
        cell.border = {
          top: { style: "thin", color: { argb: "FFE0E0E0" } },
          left: { style: "thin", color: { argb: "FFE0E0E0" } },
          bottom: { style: "thin", color: { argb: "FFE0E0E0" } },
          right: { style: "thin", color: { argb: "FFE0E0E0" } },
        };

        // Alternate row coloring (zebra stripes)
        if (i % 2 === 0) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF8F8F8" }, // Very light grey
          };
        } else {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFFFF" }, // White
          };
        }
      });
    }

    // Auto-fit columns for better display
    mainSheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value;
        const cellLength = cellValue ? cellValue.toString().length : 0;
        if (cellLength > maxLength) {
          maxLength = cellLength;
        }
      });

      // Set reasonable column widths
      const headerLength = column.header ? column.header.length : 10;
      const calculatedWidth = Math.max(maxLength + 2, headerLength + 2);
      column.width = Math.min(calculatedWidth, 100); // Cap at 100
    });

    // Optional: Freeze header row (so it stays visible when scrolling)
    mainSheet.views = [{ state: "frozen", xSplit: 0, ySplit: 1 }];

    // Set response headers for Excel file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Create filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `time-history-export-${timestamp}.xlsx`;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Write Excel file to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    await session.abortTransaction();
    console.error("Error in exporting to Excel:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate Excel file",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    session.endSession();
  }
};
