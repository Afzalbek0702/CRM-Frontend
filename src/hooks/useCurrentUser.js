import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["auth"],
    queryFn: () => queryClient.getQueryData(["auth"]) ?? null,
    initialData: () => queryClient.getQueryData(["auth"]) ?? null,
    staleTime: Infinity,
  });

  return {
    user: data?.user ?? null,
    tenant: data?.tenant ?? null,
  };
};