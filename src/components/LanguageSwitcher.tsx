import { useAppContext } from "../context/AppContext";

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useAppContext();
  const nextLang = language === "ar" ? "en" : "ar";

  return (
    <button
      type="button"
      className="lang-switcher"
      onClick={() => setLanguage(nextLang)}
    >
      {language === "ar" ? t("language.english") : t("language.arabic")}
    </button>
  );
};

export default LanguageSwitcher;
