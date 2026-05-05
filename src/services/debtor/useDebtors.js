import { useQuery } from "@tanstack/react-query";
import { debtorService } from "./debtorService";

export const useDebtor = () => {
	const {
		data: debtors = [],
		isLoading: debtorsLoading,
		error: debtorsError,
	} = useQuery({
		queryKey: ["debtors"],
		queryFn: () => debtorService.debtors(),
	});
	return {
		debtors,
		debtorsError,
		debtorsLoading,
	};
};
