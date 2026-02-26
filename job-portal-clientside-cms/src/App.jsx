import { useNavigate } from "react-router-dom";
import RoutesIndex from "./routes/RoutesIndex";
import { ConfigProvider, Spin } from "antd";
import { useEffect, useState } from "react";
import Api from "./services/Api";

function App() {
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        if (sessionStorage.getItem("token")) {
          try {
            const token = JSON.parse(sessionStorage.getItem("token"));
            const response = await Api.get("/auth/user", {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            });
            const { data } = response;
            const expiration = new Date();
            expiration.setDate(expiration.getDate() + 1);
            let userData = {};
            switch (data.user.role) {
              case "superadmin":
                userData = {
                  id: data.user.admin_id,
                  name: data.user.full_name,
                  email: data.user.email,
                  password: data.user.password,
                  role: data.user.role,
                  expiresAt: expiration.getTime(),
                };
                break;
              case "university":
                userData = {
                  id: data.user.university_id,
                  name: data.user.full_name,
                  email: data.user.email,
                  phone_number: data.user.phone_number,
                  password: data.user.password,
                  role: data.user.role,
                  status: data.user.status,
                  expiresAt: expiration.getTime(),
                };
                break;
              case "company":
                userData = {
                  id: data.user.company_id,
                  name: data.user.full_name,
                  email: data.user.email,
                  phone_number: data.user.phone_number,
                  password: data.user.password,
                  role: data.user.role,
                  status: data.user.status,
                  expiresAt: expiration.getTime(),
                };
                break;
              default:
                throw new Error(`Unknown role: ${data.user.role}`);
            }
            if (response.status === "success") {
              sessionStorage.setItem("userData", JSON.stringify(userData));
            }
          } catch (error) {
            if (error.response && error.response.status === 401) {
              sessionStorage.removeItem("token");
              sessionStorage.removeItem("userData");
              navigateTo("/login?sessionExpired");
            }
          }
        } else if (localStorage.getItem("token")) {
          try {
            const token = localStorage.getItem("token");
            const response = await Api.get("/auth/user", {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            });
            if (response.status === "success") {
              const { data } = response;
              const expiration = new Date();
              expiration.setDate(expiration.getDate() + 1);
              const tokenData = {
                value: data.token,
                expiresAt: expiration.getTime(),
              };
              let userData = {};
              switch (data.user.role) {
                case "superadmin":
                  userData = {
                    id: data.user.admin_id,
                    name: data.user.full_name,
                    email: data.user.email,
                    role: data.user.role,
                    expiresAt: expiration.getTime(),
                  };
                  break;
                case "university":
                  userData = {
                    id: data.user.university_id,
                    name: data.user.full_name,
                    email: data.user.email,
                    role: data.user.role,
                    status: data.user.status,
                    expiresAt: expiration.getTime(),
                  };
                  break;
                case "company":
                  userData = {
                    id: data.user.company_id,
                    name: data.user.full_name,
                    email: data.user.email,
                    role: data.user.role,
                    status: data.user.status,
                    expiresAt: expiration.getTime(),
                  };
                  break;
                default:
                  throw new Error(`Unknown role: ${data.user.role}`);
              }
              sessionStorage.setItem("token", JSON.stringify(tokenData));
              sessionStorage.setItem("userData", JSON.stringify(userData));
              //navigateTo("/dashboard");
            }
          } catch (error) {
            if (error.response && error.response.status === 401) {
              localStorage.removeItem("token");
              navigateTo("/login?sessionExpired");
            }
          }
        }
      } catch (error) {
        // Silent
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [navigateTo]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Poppins, sans-serif",
          colorPrimary: "#dc362e",
        },
        components: {
          Menu: {
            itemHeight: 60,
            colorBgTextActive: "#dc362e",
            colorIconHover: "#dc362e",
            itemHoverColor: "#dc362e",
            itemSelectedColor: "#dc362e",
            itemBg: "#ffffff",
            subMenuItemBg: "#ffffff",
          },
          Table: {
            cellPaddingBlock: 20,
            rowHoverBg: "#F4F7FE",
            rowSelectedBg: "#F4F7FE",
            headerBg: "#F9F9F9",
            headerBorderRadius: 10,
          },
          Dropdown: {
            controlItemBgActiveHover: "#F4F7FE",
            controlItemBgHover: "#F4F7FE",
            borderRadiusLG: 10,
            controlPaddingHorizontal: 10,
          },
          Segmented: {
            itemSelectedBg: "#fff",
            colorText: "#000",
            borderRadius: 4,
            borderRadiusSM: 4,
            colorBgTextHover: "#fff",
            trackBg: "#E9E9E9",
          },
          Switch: {
            colorPrimary: "#15BF64",
            colorPrimaryHover: "#15BF64",
          },
        },
      }}
    >
      <RoutesIndex />
    </ConfigProvider>
  );
}

export default App;
