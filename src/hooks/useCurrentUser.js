import { useQuery, useQueryClient } from "@tanstack/react-query";
import {authService} from '../services/auth/authService'
export const useCurrentUser = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["auth"],
    queryFn: () => authService.me(),
    initialData: () => queryClient.getQueryData(["auth"]) ?? null,
    staleTime: Infinity,
  });

  return {
    user: data?.user ?? null,
    tenant: data?.tenant ?? null,
  };
};