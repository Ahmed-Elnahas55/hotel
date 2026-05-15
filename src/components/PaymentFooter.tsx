import { useAppContext } from "../context/AppContext";

const PaymentFooter: React.FC = () => {
  const { t } = useAppContext();

  return (
    <footer className="footer">
      <div className="footer-quote">
        <p className="footer-quote-text">{t("footer.quote")}</p>
        <p className="footer-quote-subtext">{t("footer.tagline")}</p>
      </div>
      <div className="store-links">
        <a
          className="store-badge google-play"
          href="#"
          aria-label="Google Play"
        >
          <span>▶</span>
          <div>
            <small>GET IT ON</small>
            <strong>Google Play</strong>
          </div>
        </a>
        <a className="store-badge app-store" href="#" aria-label="App Store">
          <span></span>
          <div>
            <small>Download on the</small>
            <strong>App Store</strong>
          </div>
        </a>
      </div>
      <div className="footer-links">
        <a href="#about">{t("footer.about")}</a>
        <a href="#support">{t("footer.support")}</a>
        <a href="#privacy">{t("footer.privacy")}</a>
        <a href="#contact">{t("footer.contact")}</a>
      </div>
    </footer>
  );
};

export default PaymentFooter;
