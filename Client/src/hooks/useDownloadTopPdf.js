// hooks/useExportToPDF.js
import jsPDF from "jspdf";

export const useDownloadToPdf = () => {
  const exportToPDF = async (timeData) => {
    try {
      if (!timeData?.data) {
        return { success: false, error: "No data available" };
      }

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Set white background
      pdf.setFillColor(255, 255, 255); // White
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      const today = new Date();
      // Convert to string to avoid jsPDF errors
      const currentTime = String(timeData.data.currentTime || "00");
      const goalTime = String(timeData.data.goalTime || "00");
      const latestQuote =
        timeData.data.history?.length > 0
          ? timeData.data.history[timeData.data.history.length - 1]?.quote ||
            "Set your goal time now"
          : "Set your goal time now";

      // Header - Date
      pdf.setTextColor(0, 0, 0); // Black
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const dateText = `As of ${today.toDateString()}:`;
      const dateWidth = pdf.getTextWidth(dateText);
      pdf.text(dateText, (pageWidth - dateWidth) / 2, 40);

      // Current Time
      pdf.setTextColor(0, 0, 0); // Black
      pdf.setFontSize(72);
      pdf.setFont("helvetica", "bold");
      pdf.text(currentTime, pageWidth / 2 - 45, 80);

      // Slash
      pdf.setTextColor(0, 0, 0); // Black
      pdf.setFontSize(90);
      pdf.setFont("helvetica", "normal");
      pdf.text("/", pageWidth / 2 - 5, 80);

      // Goal Time
      pdf.setTextColor(0, 0, 0); // Black
      pdf.setFontSize(72);
      pdf.setFont("helvetica", "bold");
      pdf.text(goalTime, pageWidth / 2 + 15, 80);

      // "hrs" text
      pdf.setTextColor(0, 0, 0); // Black
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text("HRS", pageWidth / 2 + 58, 78);

      // Divider line
      pdf.setDrawColor(0, 0, 0); // Black
      pdf.setLineWidth(0.5);
      pdf.line(pageWidth / 2 - 30, 95, pageWidth / 2 + 30, 95);

      // Quote section
      if (timeData.data.history?.length > 0) {
        pdf.setTextColor(0, 0, 0); // Black
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        const quoteLabel = "Quote of the update:";
        const quoteLabelWidth = pdf.getTextWidth(quoteLabel);
        pdf.text(quoteLabel, (pageWidth - quoteLabelWidth) / 2, 110);

        // The quote itself (wrapped text)
        pdf.setTextColor(0, 0, 0); // Black
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "italic");
        const maxWidth = 180;
        const lines = pdf.splitTextToSize(`"${latestQuote}"`, maxWidth);
        const lineHeight = 7;
        const startY = 120;

        lines.forEach((line, index) => {
          const lineWidth = pdf.getTextWidth(line);
          pdf.text(
            line,
            (pageWidth - lineWidth) / 2,
            startY + index * lineHeight
          );
        });
      } else {
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "italic");
        const noDataText = "Set your goal time now";
        const noDataWidth = pdf.getTextWidth(noDataText);
        pdf.text(noDataText, (pageWidth - noDataWidth) / 2, 120);
      }

      // Download
      const filename = `TimeIt${today.toISOString().split("T")[0]}.pdf`;
      pdf.save(filename);

      return { success: true };
    } catch (error) {
      console.error("PDF Export Error:", error);
      return { success: false, error: error.message };
    }
  };

  return { exportToPDF };
};
