import { useArchive } from "../hooks/useArchive";

export default function Archive() {
	const { archivedGroups, useAllArchivedStudents, } = useArchive();
   // const { data: students } = useAllArchivedStudents(); 
   // const { data: payments } = useArchive().useAllArchivedStudents();
   // qaysi qulay bo'lsa shuni ishlating!
   return (
		<div>
			Archive
			{archivedGroups.map((group) => (
            <div key={group.id}>{group.name}</div>
         ))}
         
		</div>
	);
}
