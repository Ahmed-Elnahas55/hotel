import { useState } from "react";
import { useAppContext } from "../context/AppContext";

const ProfilePage: React.FC = () => {
  const { t, user, updateUser } = useAppContext();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (!user) return;
    await updateUser({ ...user, firstName, lastName, phone });
    setMessage(t("profile.updateSuccess"));
  };

  if (!user) {
    return (
      <section className="section-card">
        <h2>{t("nav.login")}</h2>
        <p>{t("auth.loginPrompt")}</p>
      </section>
    );
  }

  return (
    <section className="section-card">
      <h2>{t("profile.heading")}</h2>
      {message && <div className="alert">{message}</div>}
      <div className="form-row">
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
      </div>
      <button className="primary-button" onClick={handleSave}>
        {t("profile.save")}
      </button>
    </section>
  );
};

export default ProfilePage;
