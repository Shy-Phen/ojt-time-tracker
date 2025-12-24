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
  getHistory: async () => {
    const response = await axiosInstance.put("/time")
    return response.data
  },

  deleteTime: async () => {
    const response = await axiosInstance.delete("/time");
    return response.data;
  },
};
