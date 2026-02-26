import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import menuSidebar from "../components/dashboard-layout/MenuSidebar";

const useMenuSidebar = () => {
  const location = useLocation();
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const [activeMenuSidebar, setActiveMenuSidebar] = useState(null);

  useEffect(() => {
    const activeItem = menuSidebar.find((item) => {
      if (item.children) {
        const subMenuItem = item.children.find(
          (subItem) =>
            subItem.link === location.pathname &&
            subItem.role.includes(userData.role)
        );
        if (subMenuItem) {
          setActiveMenuSidebar(subMenuItem);
          return true;
        }
      }
      return (
        item.link === location.pathname && item.role.includes(userData.role)
      );
    });
    if (!activeItem.children) {
      setActiveMenuSidebar(activeItem);
    }
  }, [location.pathname, userData]);

  return { activeMenuSidebar, menuSidebar, setActiveMenuSidebar };
};

export default useMenuSidebar;
