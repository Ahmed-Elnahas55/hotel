import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppContext } from "./context/AppContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import BookingHistoryPage from "./pages/BookingHistoryPage";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentFooter from "./components/PaymentFooter";
import LanguageSwitcher from "./components/LanguageSwitcher";

function App() {
  const { user, logout, t } = useAppContext();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["flights", "hotels", "explore"];
      let current = "";
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = section;
          }
        }
      });
      setActiveSection(current);
    };

    // Check for hash on page load or navigation
    const checkHash = () => {
      const hash = window.location.hash.substring(1);
      if (hash && ["flights", "hotels", "explore"].includes(hash)) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          element?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };

    checkHash();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("hashchange", checkHash);

    handleScroll(); // Initial check
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", checkHash);
    };
  }, []);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-actions">
          {user ? (
            <button
              className="auth-button"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              {t("nav.logout")}
            </button>
          ) : (
            <NavLink className="auth-button" to="/login">
              {t("nav.login")}
            </NavLink>
          )}
          <div className="header-pill-group">
            <button className="pill-button">USD</button>
            <LanguageSwitcher />
          </div>
        </div>

        <div className="site-header-center">
          <div
            className="brand-box"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <div className="brand-mark">✈️</div>
            <div className="brand-name">{t("brand.name")}</div>
          </div>
          <nav className="site-links">
            <a
              href="#hotels"
              onClick={(e) => {
                e.preventDefault();
                if (window.location.pathname !== "/") {
                  navigate("/#hotels");
                  setTimeout(() => {
                    const element = document.getElementById("hotels");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                } else {
                  window.location.hash = "hotels";
                  const element = document.getElementById("hotels");
                  element?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={activeSection === "hotels" ? "active" : ""}
            >
              {t("nav.hotels")}
            </a>
            <a
              href="#flights"
              onClick={(e) => {
                e.preventDefault();
                if (window.location.pathname !== "/") {
                  navigate("/#flights");
                  setTimeout(() => {
                    const element = document.getElementById("flights");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                } else {
                  window.location.hash = "flights";
                  const element = document.getElementById("flights");
                  element?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={activeSection === "flights" ? "active" : ""}
            >
              {t("nav.flights")}
            </a>
            <a
              href="#explore"
              onClick={(e) => {
                e.preventDefault();
                if (window.location.pathname !== "/") {
                  navigate("/#explore");
                  setTimeout(() => {
                    const element = document.getElementById("explore");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                } else {
                  window.location.hash = "explore";
                  const element = document.getElementById("explore");
                  element?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={activeSection === "explore" ? "active" : ""}
            >
              {t("nav.explore")}
            </a>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/history" element={<BookingHistoryPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </main>

      <PaymentFooter />
    </div>
  );
}

export default App;
