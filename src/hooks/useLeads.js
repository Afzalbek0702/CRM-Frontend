import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leadsService } from "../services/leads-service.js";

const LEADS_QUERY_KEY = "leads";

export const useLeads = () => {
   const queryClient = useQueryClient();
   const {
      data: leads = [],
      isLoading, 
      error,
      refetch: fetchAll,
   } = useQuery({
      queryKey: [LEADS_QUERY_KEY],
      queryFn: () => leadsService.getLeads().then((res) => res.data),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
   });
   const createLeadMutation = useMutation({
      mutationFn: (data) => leadsService.createLead(data).then((res) => res.data),
      onSuccess: () => {
         toast.success("Lead muffafaqqiyatli yaratildi");
         queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      },
      onError: (error) => {
         toast.error("Lead yaratishda xatolik yuz berdi");
         console.log(error.response?.data);
      },
   });   
   const deleteLeadMutation = useMutation({
      mutationFn: (id) => leadsService.deleteLead(id).then((res) => res.data),
      onSuccess: () => {
         toast.success("Lead muffafaqqiyatli o'chirildi");
         queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      }
      ,
      onError: (error) => {
         toast.error("Leadni o'chirishda xatolik yuz berdi");
         console.log(error.response?.data);
      },
   });
   const convertLeadToGroupMutation = useMutation({
      mutationFn: ({ id, group_id }) =>
         leadsService.convertLeadToGroup(id, group_id).then((res) => res.data),           
      onSuccess: () => {
         toast.success("Lead muffafaqqiyatli guruhga qo'shildi");
         queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      }
      ,
      onError: (error) => {
         toast.error("Leadni guruhga qo'shishda xatolik yuz berdi");
         console.log(error.response?.data);
      },
   });
   return {
      leads,
      isLoading,
      error,
      fetchAll,
      createLead: createLeadMutation.mutate,
      deleteLead: deleteLeadMutation.mutate,
      convertLeadToGroup: convertLeadToGroupMutation.mutate,
   };
}