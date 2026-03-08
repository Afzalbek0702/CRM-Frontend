export function filterSidebarByRole(items, role) {
  return items
    .map((item) => {
      const hasParentAccess = item.roles?.includes(role);

      if (!hasParentAccess) return null;

      if (!item.children) {
        return item;
      }

      const filteredChildren = item.children.filter((child) =>
        child.roles?.includes(role)
      );

      if (filteredChildren.length === 0) return null;

      return {
        ...item,
        children: filteredChildren
      };
    })
    .filter(Boolean);
}