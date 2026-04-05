import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import { Card, CardContent } from "@/components/ui/card";
import { InputGroupAddon, InputGroupInput,InputGroup } from "@/components/ui/input-group";
import { FaSearch } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
export const StudentFilters = ({
	searchTerm,
	setSearchTerm,
	selectedTeacher,
	setSelectedTeacher,
	openTeacher,
	setOpenTeacher,
	archivedGroups,
	resultCount,
}) => (
	<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl">
		<CardContent className="p-4">
			<div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
				<InputGroup className="max-w-md">
					<InputGroupInput
						placeholder="Ism bo'yicha qidirish..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="bg-black/40 border-white/20 text-white border-0 focus:ring-0"
					/>
					<InputGroupAddon className="text-gray-500">
						<FaSearch />
					</InputGroupAddon>
				</InputGroup>
				<div className="flex flex-wrap items-center gap-3">
					<Popover open={openTeacher} onOpenChange={setOpenTeacher}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className="border-white/20 text-gray-300"
							>
								{selectedTeacher ? "O'qituvchi tanlandi" : "O'qituvchi"}
							</Button>
						</PopoverTrigger>
						<PopoverContent
							className="w-50 p-0 bg-[#1f1f1f] border-white/10 text-white"
							align="end"
						>
							<Command>
								<CommandInput
									placeholder="Qidirish..."
									className="text-white"
								/>
								<CommandEmpty className="text-gray-500 py-4">
									Topilmadi.
								</CommandEmpty>
								<CommandGroup>
									<CommandItem
										onSelect={() => {
											setSelectedTeacher("");
											setOpenTeacher(false);
										}}
										className="cursor-pointer hover:bg-amber-400/10"
									>
										<Check
											className={`mr-2 h-4 w-4 ${!selectedTeacher ? "opacity-100 text-amber-400" : "opacity-0"}`}
										/>
										Barchasi
									</CommandItem>
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
					<Badge variant="outline" className="border-white/20 text-gray-400">
						{resultCount} natija
					</Badge>
				</div>
			</div>
		</CardContent>
	</Card>
);
