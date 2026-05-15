import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const LoginPage: React.FC = () => {
  const { t, login, register } = useAppContext();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (isRegister) {
      const success = await register({
        email,
        password,
        firstName,
        lastName,
        phone,
      });
      setMessage(
        success ? t("auth.registerSuccess") : t("auth.registerFailed"),
      );
      if (success) navigate("/profile");
      return;
    }
    const success = await login(email, password);
    if (success) {
      setMessage("");
      navigate("/");
    } else {
      setMessage(t("auth.loginFailed"));
    }
  };

  return (
    <section className="section-card">
      <h2>{isRegister ? t("auth.register") : t("auth.login")}</h2>
      {message && <div className="alert">{message}</div>}
      <div className="form-row">
        {isRegister && (
          <>
            <div className="input-group">
              <label>{t("auth.firstName")}</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>{t("auth.lastName")}</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>{t("auth.phone")}</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </>
        )}
        <div className="input-group">
          <label>{t("auth.email")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>{t("auth.password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <button className="primary-button" onClick={handleSubmit}>
        {isRegister ? t("auth.register") : t("auth.login")}
      </button>
      <button
        className="link-button"
        style={{ marginTop: 12 }}
        onClick={() => setIsRegister((prev) => !prev)}
      >
        {isRegister ? t("auth.switchToLogin") : t("auth.switchToRegister")}
      </button>
    </section>
  );
};

export default LoginPage;
