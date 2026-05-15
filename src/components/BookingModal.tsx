import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import type { Flight, Hotel } from "../types";

interface Props {
  hotel?: Hotel;
  flight?: Flight;
  onClose: () => void;
}

const BookingModal: React.FC<Props> = ({ hotel, flight, onClose }) => {
  const { t, addHotelBooking, addFlightBooking, user } = useAppContext();
  const [roomType, setRoomType] = useState(hotel?.rooms[0]?.type ?? "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [passengers, setPassengers] = useState(1);
  const [message, setMessage] = useState("");

  if (!hotel && !flight) return null;

  const handleHotelSubmit = () => {
    if (!hotel || !user) {
      setMessage(t("booking.loginRequired"));
      return;
    }
    if (!checkIn || !checkOut) {
      setMessage(t("booking.selectDates"));
      return;
    }
    const room =
      hotel.rooms.find((item) => item.type === roomType) ?? hotel.rooms[0];
    const nights = 1;
    const totalPrice = room.pricePerNight * guests * nights;
    addHotelBooking({
      hotelId: hotel.id,
      hotelName: hotel.name,
      checkIn,
      checkOut,
      guests,
      roomType: room.type,
      totalPrice,
    });
    setMessage(t("booking.success"));
  };

  const handleFlightSubmit = () => {
    if (!flight || !user) {
      setMessage(t("booking.loginRequired"));
      return;
    }
    const totalPrice = flight.price * passengers;
    addFlightBooking({
      flightId: flight.id,
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      departTime: flight.departTime,
      arriveTime: flight.arriveTime,
      passengers,
      totalPrice,
    });
    setMessage(t("booking.success"));
  };

  return (
    <div className="section-card" style={{ position: "relative" }}>
      <button
        className="link-button"
        style={{ position: "absolute", top: 16, left: 16 }}
        onClick={onClose}
      >
        ✕
      </button>
      <h2>{hotel ? t("booking.hotelStep") : t("booking.flightStep")}</h2>
      {message && <div className="alert">{message}</div>}
      {hotel && (
        <div>
          <div className="form-row">
            <div className="input-group">
              <label>{t("hotelSearch.roomType")}</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                {hotel.rooms.map((room) => (
                  <option key={room.id} value={room.type}>
                    {room.type}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>{t("hotelSearch.checkIn")}</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>{t("hotelSearch.checkOut")}</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>{t("hotelSearch.guests")}</label>
              <input
                type="number"
                min={1}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              />
            </div>
          </div>
          <button className="primary-button" onClick={handleHotelSubmit}>
            {t("booking.confirm")}
          </button>
        </div>
      )}

      {flight && (
        <div>
          <div className="form-row">
            <div className="input-group">
              <label>{t("flightSearch.passengers")}</label>
              <input
                type="number"
                min={1}
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
              />
            </div>
          </div>
          <button className="primary-button" onClick={handleFlightSubmit}>
            {t("booking.confirm")}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingModal;
