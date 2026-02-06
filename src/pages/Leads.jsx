import { useLeads } from "../hooks/useLeads";

export default function Leads() {
	const { leads, createLead, convertLeadToGroup } = useLeads();
	console.log(leads);
	function CREATE() {
		createLead({
			full_name: "John Doe",
			phone: "1234567890",
			source: "Internet", // O'quvchi qayerdan kelganini ko'rsatish uchun
			interested_course: "Web Development", // O'quvchi qaysi kursga qiziqishini ko'rsatish uchun
			comment: "Interested in full-time course",
		});
	}
	function ADDTOGROUP() {
      convertLeadToGroup({ id: 1, group_id: 2 });
      // id bu student ID si group_id guruhniki. Xuddi shu holatda jo'natasiz!
	}
	return (
		<div className="leads-header">
			{leads.map((l) => (
				<div key={l.id}>
					{l.full_name} - {l.phone}
				</div>
			))}
		</div>
	);
}
