import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Breadcrumb } from "antd";
import MenuSidebar from "../components/dashboard-layout/MenuSidebar";

const useBreadcrumbs = () => {
  const location = useLocation();
  const pathSnippets = useMemo(
    () => location.pathname.split("/").filter((i) => i),
    [location.pathname]
  );
  const params = new URLSearchParams(location.search);
  const activePage = params.get("page");

  const breadcrumbItems = useMemo(() => {
    const items = [<Breadcrumb.Item key="home">Digitefa</Breadcrumb.Item>];
    let currentPath = "";
    for (const pathSnippet of pathSnippets) {
      currentPath += `/${pathSnippet}`;
      const menuItem = MenuSidebar.find(
        (item) =>
          item.link === currentPath ||
          (item.children &&
            item.children.some((child) => child.link === currentPath))
      );
      if (menuItem) {
        items.push(
          <Breadcrumb.Item key={menuItem.key}>{menuItem.text}</Breadcrumb.Item>
        );
      }
      const menuItem2 = MenuSidebar.find(
        (item) =>
          item.children &&
          item.children.some((child) => child.link === currentPath)
      );
      if (menuItem2) {
        const subMenu = menuItem2.children.find(
          (item) => item.link === currentPath
        );
        items.push(
          <Breadcrumb.Item key={subMenu.key}>{subMenu.text}</Breadcrumb.Item>
        );
      }
    }
    if (activePage) {
      items.push(
        <Breadcrumb.Item key={activePage}>
          {activePage
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </Breadcrumb.Item>
      );
    }
    return items;
  }, [pathSnippets, MenuSidebar, activePage]);

  return { breadcrumbItems };
};

export default useBreadcrumbs;
