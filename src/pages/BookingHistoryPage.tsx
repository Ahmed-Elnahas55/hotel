import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { HotelBooking, FlightBooking } from "../types";

type EditingBooking =
  | { type: "hotel"; id: string; data: HotelBooking }
  | { type: "flight"; id: string; data: FlightBooking };

const BookingHistoryPage: React.FC = () => {
  const {
    t,
    hotelBookings,
    flightBookings,
    user,
    removeHotelBooking,
    removeFlightBooking,
    updateHotelBooking,
    updateFlightBooking,
  } = useAppContext();
  const navigate = useNavigate();
  const [editingBooking, setEditingBooking] = useState<EditingBooking | null>(null);

  if (!user) {
    return (
      <section className="section-card">
        <h2>{t("nav.login")}</h2>
        <p>{t("bookingHistory.loginPrompt")}</p>
      </section>
    );
  }

  return (
    <section className="section-card">
      <h2>{t("bookingHistory.heading")}</h2>
      <button className="primary-button" onClick={() => navigate("/")}>
        {t("bookingHistory.addNew")}
      </button>
      <div className="booking-list">
        {hotelBookings.length === 0 && flightBookings.length === 0 && (
          <p>{t("bookingHistory.none")}</p>
        )}
        {hotelBookings.length > 0 && (
          <div>
            <h3>{t("bookingHistory.hotel")}</h3>
            {hotelBookings.map((booking) => {
              return (
                <div key={booking.id} className="booking-item">
                  <strong>{booking.hotelName}</strong>
                  <p>
                    {booking.checkIn} - {booking.checkOut}
                  </p>
                  <p>
                    {t("booking.guests")}: {booking.guests}
                  </p>
                  <p>
                    {t("booking.total")}: {booking.totalPrice} SAR
                  </p>
                  <p>{booking.roomType}</p>
                  <div className="booking-actions">
                    <button
                      className="primary-button"
                      onClick={() =>
                        setEditingBooking({
                          type: "hotel",
                          id: booking.id,
                          data: booking,
                        })
                      }
                    >
                      {t("bookingHistory.edit")}
                    </button>
                    <button
                      className="secondary-button"
                      onClick={() => removeHotelBooking(booking.id)}
                    >
                      {t("bookingHistory.cancel")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {flightBookings.length > 0 && (
          <div>
            <h3>{t("bookingHistory.flight")}</h3>
            {flightBookings.map((booking) => {
              return (
                <div key={booking.id} className="booking-item">
                  <strong>{booking.flightNumber}</strong>
                  <p>
                    {booking.origin} → {booking.destination}
                  </p>
                  <p>
                    {t("booking.passengers")}: {booking.passengers}
                  </p>
                  <p>
                    {t("booking.total")}: {booking.totalPrice} SAR
                  </p>
                  <div className="booking-actions">
                    <button
                      className="primary-button"
                      onClick={() =>
                        setEditingBooking({
                          type: "flight",
                          id: booking.id,
                          data: booking,
                        })
                      }
                    >
                      {t("bookingHistory.edit")}
                    </button>
                    <button
                      className="secondary-button"
                      onClick={() => removeFlightBooking(booking.id)}
                    >
                      {t("bookingHistory.cancel")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {editingBooking && (
        <div className="edit-booking-modal">
          <div className="modal-content">
            <h3>{t("bookingHistory.edit")}</h3>
            {editingBooking.type === "hotel" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const updated = {
                    checkIn: formData.get("checkIn") as string,
                    checkOut: formData.get("checkOut") as string,
                    guests: parseInt(formData.get("guests") as string),
                  };
                  updateHotelBooking(editingBooking.id, updated);
                  setEditingBooking(null);
                }}
              >
                <label>{t("hotelSearch.checkIn")}</label>
                <input
                  name="checkIn"
                  type="date"
                  defaultValue={editingBooking.data.checkIn}
                  required
                />
                <label>{t("hotelSearch.checkOut")}</label>
                <input
                  name="checkOut"
                  type="date"
                  defaultValue={editingBooking.data.checkOut}
                  required
                />
                <label>{t("hotelSearch.guests")}</label>
                <input
                  name="guests"
                  type="number"
                  defaultValue={editingBooking.data.guests}
                  required
                />
                <div className="modal-actions">
                  <button type="submit" className="primary-button">
                    {t("bookingHistory.save")}
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setEditingBooking(null)}
                  >
                    {t("bookingHistory.cancel")}
                  </button>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => {
                      removeHotelBooking(editingBooking.id);
                      setEditingBooking(null);
                    }}
                  >
                    {t("bookingHistory.cancelBooking")}
                  </button>
                </div>
              </form>
            )}
            {editingBooking.type === "flight" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const updated = {
                    departTime: formData.get("departTime") as string,
                    passengers: parseInt(formData.get("passengers") as string),
                  };
                  updateFlightBooking(editingBooking.id, updated);
                  setEditingBooking(null);
                }}
              >
                <label>{t("flightSearch.departDate")}</label>
                <input
                  name="departTime"
                  type="date"
                  defaultValue={editingBooking.data.departTime.split("T")[0]}
                  required
                />
                <label>{t("booking.passengers")}</label>
                <input
                  name="passengers"
                  type="number"
                  defaultValue={editingBooking.data.passengers}
                  required
                />
                <div className="modal-actions">
                  <button type="submit" className="primary-button">
                    {t("bookingHistory.save")}
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setEditingBooking(null)}
                  >
                    {t("bookingHistory.cancel")}
                  </button>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => {
                      removeFlightBooking(editingBooking.id);
                      setEditingBooking(null);
                    }}
                  >
                    {t("bookingHistory.cancelBooking")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default BookingHistoryPage;
