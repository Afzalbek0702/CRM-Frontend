import { NavLink, useLocation, useParams } from "react-router-dom";
import { ChevronDown, ChevronRight, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/authContext";
import { filterSidebarByRole } from "../helpers/filterSidebarByRole";
import { sidebarConfig } from "../helpers/sidebarConfig";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
	SidebarMenuSubButton,
   SidebarTrigger,
} from "@/components/ui/sidebar";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function AppSidebar() {
	const { user } = useAuth();
	const location = useLocation();
	const { tenant } = useParams();
	const filteredSidebar = filterSidebarByRole(sidebarConfig, user?.role);

	return (
		<Sidebar collapsible="icon">


			<SidebarContent className={"mt-17.5"}>
				<SidebarGroup>
					<SidebarMenu>
						{filteredSidebar.map((item) => {
							const Icon = item.icon;
							const fullPath = `/${tenant}/${item.path}`;
							const isActive = location.pathname === fullPath;
							if (!item.children) {
								return (
									<SidebarMenuItem key={item.path} className="p-0 m-0">
										<SidebarMenuButton
											asChild
											tooltip={item.label}
											isActive={isActive}
											className={"rounded-none h-10 px-2.5 py-3 hover:bg-card"}
										>
											<NavLink
												to={`/${tenant}/${item.path}`}
												className={({ isActive }) =>
													isActive ? "font-medium" : ""
												}
											>
												<Icon />
												<span>{item.label}</span>
											</NavLink>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							}
							const isChildActive = item.children.some(
								(child) => location.pathname === `/${tenant}/${child.path}`,
							);
							return (
								<Collapsible key={item.label} className="group/collapsible">
									<SidebarMenuItem className="p-0 m-0">
										<CollapsibleTrigger asChild>
											<SidebarMenuButton
												tooltip={item.label}
												isActive={isChildActive}
												className={
													"rounded-none h-10 px-2.5 py-3 hover:bg-card"
												}
											>
												<Icon />
												<span>{item.label}</span>
												<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90 hover:bg-card" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.children.map((child) => {
													const childPath = `/${tenant}/${child.path}`;
													const isSubActive = location.pathname === childPath;
													return (
														<SidebarMenuSubItem key={child.path}>
															<SidebarMenuSubButton
																asChild
																isActive={isSubActive}
																className={
																	"rounded-none h-10 px-2.5 py-3 hover:bg-card"
																}
															>
																<NavLink
																	to={`/${tenant}/${child.path}`}
																	className={({ isActive }) =>
																		isActive ? "text-primary font-bold" : ""
																	}
																>
																	<span>{child.label}</span>
																</NavLink>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													);
												})}
											</SidebarMenuSub>
										</CollapsibleContent>
									</SidebarMenuItem>
								</Collapsible>
							);
						})}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
