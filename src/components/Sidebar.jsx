import { useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAuth } from "../context/authContext";
import { filterSidebarByRole } from "../helpers/filterSidebarByRole";
import { sidebarConfig } from "../helpers/sidebarConfig";
import { useSidebar } from "@/components/ui/sidebar";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
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

// ── Flyout for collapsed mode ──────────────────────────────────────────────
function CollapsedFlyout({ item, tenant, location }) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;
  const isChildActive = item.children.some(
    (child) => location.pathname === `/${tenant}/${child.path}`
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Icon-only trigger button (matches other SidebarMenuButtons visually) */}
      <SidebarMenuButton
        isActive={isChildActive}
        className="rounded-none h-10 px-2.5 py-3 w-full"
      >
        <Icon />
      </SidebarMenuButton>

      {/* Flyout panel */}
      {open && (
        <div className="fixed left-8 top-0 h-screen w-52 z-50 shadow-xl flex flex-col bg-black">
          {/* Header */}
          <div className="h-17.5 flex items-center px-4 border-b border-sidebar-border shrink-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              {item.label}
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-col py-2">
            {item.children.map((child) => {
              const childPath = `/${tenant}/${child.path}`;
              return (
                <NavLink
                  key={child.key}
                  to={childPath}
                  className={({ isActive }) =>
                    `flex items-center h-10 px-4 text-sm transition-colors
                    ${
                      isActive
                        ? "text-primary font-bold bg-sidebar-accent"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`
                  }
                >
                  {child.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Expanded inline collapsible (normal mode) ─────────────────────────────
function ExpandedCollapsible({ item, tenant, location }) {
  const Icon = item.icon;
  const isChildActive = item.children.some(
    (child) => location.pathname === `/${tenant}/${child.path}`
  );

  return (
    <Collapsible className="group/collapsible w-full">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.label}
            isActive={isChildActive}
            className="rounded-none h-10 px-2.5 py-3"
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
                <SidebarMenuSubItem key={child.key}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isSubActive}
                    className="rounded-none h-10 px-2.5 py-3"
                  >
                    <NavLink
                      to={childPath}
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
    </Collapsible>
  );
}

// ── Main sidebar ──────────────────────────────────────────────────────────
export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const { tenant } = useParams();
  const { state } = useSidebar(); // "collapsed" | "expanded"
  const filteredSidebar = filterSidebarByRole(sidebarConfig, user?.role);
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="group-data-[state=collapsed]:w-8">
      <SidebarContent className="pt-17.5 group-data-[state=collapsed]:w-8 overflow-hidden">
        <SidebarGroup>
          <SidebarMenu>
            {filteredSidebar.map((item) => {
              const Icon = item.icon;
              const fullPath = `/${tenant}/${item.path}`;
              const isActive = location.pathname === fullPath;

              // ── Leaf item ──
              if (!item.children) {
                return (
                  <SidebarMenuItem key={item.key} className="p-0 m-0">
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      isActive={isActive}
                      className="rounded-none h-10 px-2.5 py-3"
                    >
                      <NavLink
                        to={fullPath}
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

              // ── Parent item ──
              return (
                <SidebarMenuItem key={item.key} className="p-0 m-0">
                  {isCollapsed ? (
                    <CollapsedFlyout
                      item={item}
                      tenant={tenant}
                      location={location}
                    />
                  ) : (
                    <ExpandedCollapsible
                      item={item}
                      tenant={tenant}
                      location={location}
                    />
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}