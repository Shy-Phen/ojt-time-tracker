import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { timeApi } from "../api/time.js";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateTime = () => {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationFn: (data) => timeApi.createTime(data), // Accept data here
    onSuccess: () => {
      (queryClient.invalidateQueries({ queryKey: ["getTime"] }),
        toast.success("Time goal set successfully!"));
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to set time goal";
      toast.error(errorMessage);
    },
  });
  return result;
};

export const useGetTime = () => {
  const result = useQuery({
    queryKey: ["getTime"],
    queryFn: timeApi.getTime,
    refetchInterval: 5000,
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error fetching time");
    },
    retry: 1,
    staleTime: 100,
  });
  return result;
};

export const useDownloadToExcel = () => {
  return useMutation({
    mutationFn: timeApi.getDownloadToExcel,
    onSuccess: (response) => {
      // Create download from blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `time-history-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Excel file downloaded successfully!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to download Excel file"
      );
    },
  });
};

export const useUpdateTime = () => {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationFn: (data) => timeApi.updateTime(data),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Time goal Updated successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to Update current Time";
      toast.error(errorMessage);
    },
  });
  return result;
};

export const useDeleteTime = () => {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationFn: async () => {
      const response = await timeApi.deleteTime();
      console.log("Delete response:", response); // Debug log
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Time goal deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete error:", error); // Debug log
      toast.error(
        error.response?.data?.message || "Error in deleting time goal"
      );
    },
  });
  return result;
};
