import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import type { HotelBooking, FlightBooking } from "../types";

interface PendingHotelBooking {
  type: "hotel";
  data: Omit<HotelBooking, "id" | "status">;
}

interface PendingFlightBooking {
  type: "flight";
  data: Omit<FlightBooking, "id" | "status">;
}

type PendingBooking = PendingHotelBooking | PendingFlightBooking;

const PaymentPage: React.FC = () => {
  const { t, addHotelBooking, addFlightBooking, user } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Booking details from URL params
  const [bookingDetails, setBookingDetails] = useState<PendingBooking | null>(null);

  useEffect(() => {
    // Get booking details from localStorage or URL params
    const savedBooking = localStorage.getItem("pendingBooking");
    if (savedBooking) {
      setBookingDetails(JSON.parse(savedBooking));
    }
  }, []);

  const handlePayment = async () => {
    if (!user) {
      setMessage(t("payment.loginRequired"));
      return;
    }

    if (paymentMethod !== "paypal") {
      if (!cardNumber || !expiryDate || !cvv || !cardName) {
        setMessage(t("payment.fillRequired"));
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      if (bookingDetails) {
        if (bookingDetails.type === "hotel") {
          addHotelBooking(bookingDetails.data);
        } else if (bookingDetails.type === "flight") {
          addFlightBooking(bookingDetails.data);
        }
      }

      setMessage(t("payment.success"));
      localStorage.removeItem("pendingBooking");

      setTimeout(() => {
        navigate("/history");
      }, 2000);
    }, 3000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>{t("payment.title")}</h1>
          <p>{t("payment.subtitle")}</p>
        </div>

        {/* Booking Summary and Payment Methods Side by Side */}
        {bookingDetails && (
          <div className="payment-main-content">
            {/* Booking Summary */}
            <div className="booking-summary section-card section-dark">
              <h2>{t("payment.summaryTitle")}</h2>
              {bookingDetails.type === "hotel" && (
                <div className="summary-details">
                  <p>
                    <strong>{t("payment.hotel")}:</strong>{" "}
                    {bookingDetails.data.hotelName}
                  </p>
                  <p>
                    <strong>{t("payment.roomType")}:</strong>{" "}
                    {bookingDetails.data.roomType}
                  </p>
                  <p>
                    <strong>{t("payment.dates")}:</strong>{" "}
                    {bookingDetails.data.checkIn} -{" "}
                    {bookingDetails.data.checkOut}
                  </p>
                  <p>
                    <strong>{t("payment.guests")}:</strong>{" "}
                    {bookingDetails.data.guests}
                  </p>
                  <p>
                    <strong>{t("payment.total")}:</strong>{" "}
                    {bookingDetails.data.totalPrice} SAR
                  </p>
                </div>
              )}
              {bookingDetails.type === "flight" && (
                <div className="summary-details">
                  <p>
                    <strong>{t("payment.flight")}:</strong>{" "}
                    {bookingDetails.data.flightNumber}
                  </p>
                  <p>
                    <strong>{t("payment.route")}:</strong>{" "}
                    {bookingDetails.data.origin} →{" "}
                    {bookingDetails.data.destination}
                  </p>
                  <p>
                    <strong>{t("payment.date")}:</strong>{" "}
                    {bookingDetails.data.departTime}
                  </p>
                  <p>
                    <strong>{t("payment.passengers")}:</strong>{" "}
                    {bookingDetails.data.passengers}
                  </p>
                  <p>
                    <strong>{t("payment.total")}:</strong>{" "}
                    {bookingDetails.data.totalPrice} SAR
                  </p>
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="payment-methods section-card section-dark">
              <h2>{t("payment.chooseMethod")}</h2>
              <div className="payment-options">
                <label
                  className={`payment-option ${paymentMethod === "visa" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    value="visa"
                    checked={paymentMethod === "visa"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <div className="card-icon visa">💳</div>
                    <span>Visa</span>
                  </div>
                </label>

                <label
                  className={`payment-option ${paymentMethod === "mastercard" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    value="mastercard"
                    checked={paymentMethod === "mastercard"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <div className="card-icon mastercard">💳</div>
                    <span>MasterCard</span>
                  </div>
                </label>

                <label
                  className={`payment-option ${paymentMethod === "paypal" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <div className="card-icon paypal">🅿️</div>
                    <span>PayPal</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Payment Form */}
        <div className="payment-form section-card section-dark">
          {paymentMethod === "paypal" ? (
            <div className="paypal-section">
              <h3>{t("payment.paypalHeading")}</h3>
              <div className="form-row">
                <div className="input-group">
                  <label>{t("payment.email")}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("payment.emailPlaceholder")}
                  />
                </div>
              </div>
              <div className="paypal-notice">
                <p>{t("payment.paypalNotice")}</p>
              </div>
            </div>
          ) : (
            <div className="card-section">
              <h3>{t("payment.cardDetails")}</h3>
              <div className="form-row">
                <div className="input-group">
                  <label>{t("payment.cardName")}</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder={t("payment.cardNamePlaceholder")}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>{t("payment.cardNumber")}</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(formatCardNumber(e.target.value))
                    }
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>{t("payment.expiry")}</label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) =>
                      setExpiryDate(formatExpiryDate(e.target.value))
                    }
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div className="input-group">
                  <label>{t("payment.cvv")}</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="payment-actions">
            <button
              className="primary-button payment-btn"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? t("payment.processing") : t("payment.payNow")}
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate(-1)}
              disabled={isProcessing}
            >
              {t("payment.back")}
            </button>
          </div>

          {message && (
            <div
              className={`payment-message ${
                message === t("payment.success") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
