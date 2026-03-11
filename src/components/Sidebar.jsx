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
			<SidebarHeader className="h-16 flex items-center px-4 border-b">
				<div className="flex items-center gap-2 font-bold">
					<div className="bg-primary text-primary-foreground p-1 rounded">
						<LayoutDashboard size={20} />
					</div>
					<span className="group-data-[collapsible=icon]:hidden text-xl">
						CRM
					</span>
				</div>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{filteredSidebar.map((item) => {
							const Icon = item.icon;
							const fullPath = `/${tenant}/${item.path}`;
							// Asosiy menyu active ekanligini tekshirish
							const isActive = location.pathname === fullPath;
							if (!item.children) {
								return (
									<SidebarMenuItem key={item.path}>
										<SidebarMenuButton
											asChild
											tooltip={item.label}
											isActive={isActive}
										>
											<NavLink
												to={`/${tenant}/${item.path}`}
												className={({ isActive }) =>
													isActive
														? "bg-primary/10 text-primary font-medium"
														: ""
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
									<SidebarMenuItem>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton
												tooltip={item.label}
												isActive={isChildActive}
											>
												<Icon />
												<span>{item.label}</span>
												<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
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
