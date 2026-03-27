import RoutesIndex from "./routes/RoutesIndex";
import { ConfigProvider, Spin, App as AntdApp } from "antd";
import useScrollToTop from "./hooks/useScrollToTop";
import Api from "./services/Api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserProvider } from "./UserContext";

function App() {
  useScrollToTop();
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        if (localStorage.getItem("token")) {
          try {
            const token = JSON.parse(localStorage.getItem("token"));
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
            const userData = {
              id: data.user.admin_id,
              name: data.user.full_name,
              email: data.user.email,
              role: data.user.role,
              lmsUserId: data.user.lmsUserId,
              expiresAt: expiration.getTime(),
            };
            if (response.status === "success") {
              localStorage.setItem("userData", JSON.stringify(userData));
            }
          } catch (error) {
            console.log(error)
            if (error && error.status === 401) {
              localStorage.removeItem("token");
              localStorage.removeItem("userData");
              // navigateTo("/login?sessionExpired");
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

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.status === "submitted") {
      navigateTo("/request-profile");
    } else if (userData?.status === "not_submitted") {
      if (userData?.role === "company") {
        navigateTo("/fill-profile-company");
      } else if (userData?.role === "university") {
        navigateTo("/fill-profile-university");
      }
    }
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
    <UserProvider>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Poppins, sans-serif",
            colorPrimary: "#06A73B",
          },
          components: {
            Dropdown: {
              controlItemBgActiveHover: "#E8F9F0",
              controlItemBgHover: "#E8F9F0",
              borderRadiusLG: 10,
              controlPaddingHorizontal: 10,
            },
          },
        }}
      >
        <AntdApp>
          <RoutesIndex />
        </AntdApp>
      </ConfigProvider>
    </UserProvider>
  );
}

export default App;
