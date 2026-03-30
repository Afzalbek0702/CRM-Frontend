import { sidebarConfig } from "@/helpers/sidebarConfig";

function flattenConfig(items) {
    const map = {};
    for (const item of items) {
        if (item.path) map[item.path] = item.roles;
        if (item.children) Object.assign(map, flattenConfig(item.children));
    }
    return map;
}

export const routeRoles = flattenConfig(sidebarConfig);