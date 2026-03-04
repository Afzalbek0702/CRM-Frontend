import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    },
    staleTime: Infinity,
  });
};