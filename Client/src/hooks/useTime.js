import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { timeApi } from "../api/time.js";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateTime = () => {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationFn: (data) => timeApi.createTime(data), // Accept data here

    onSuccess: () => {
      queryClient.invalidateQueries(),
        toast.success("Time goal set successfully!");
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
    staleTime: 60000,
  });
  return result;
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
    mutationFn: timeApi.deleteTime,
    onSettled: () => {
      // This runs whether the mutation succeeds OR fails
      queryClient.invalidateQueries({ queryKey: ["getTime"] });
    },
    onSuccess: () => {
      toast.success("Time goal deleted successfully!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Error in deleting time goal"
      );
    },
  });
  return result;
};
