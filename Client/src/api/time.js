import { axiosInstance } from "../Lib/axios.js";

export const timeApi = {
  createTime: async (data) => {
    const response = await axiosInstance.post("/time", data);
    return response.data;
  },

  getTime: async () => {
    const response = await axiosInstance.get("/time");
    return response.data;
  },

  updateTime: async (data) => {
    const response = await axiosInstance.put("/time", data);
    return response.data;
  },

  getDownloadToExcel: async () => {
    const response = await axiosInstance.get("/time/excelDownload", {
      responseType: "blob", // CRUCIAL: Tell axios to handle binary data
    });
    return response;
  },

  deleteTime: async () => {
    const response = await axiosInstance.delete("/time");
    return response.data;
  },
};
