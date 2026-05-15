import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { hotels, flights } from "../data";
import type { Hotel, Flight } from "../types";

const BookingPage: React.FC = () => {
  const { t, addHotelBooking, addFlightBooking, user } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [roomType, setRoomType] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [passengers, setPassengers] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (type === "hotel" && id) {
      const foundHotel = hotels.find((h) => h.id === id);
      if (foundHotel) {
        setHotel(foundHotel);
        setRoomType(foundHotel.rooms[0]?.type ?? "");
      }
    } else if (type === "flight" && id) {
      const foundFlight = flights.find((f) => f.id === id);
      if (foundFlight) {
        setFlight(foundFlight);
      }
    }
  }, [type, id]);

  if (!hotel && !flight) {
    return (
      <div className="section-card section-dark">
        <p>Item not found</p>
      </div>
    );
  }

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
    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const totalPrice = room.pricePerNight * guests * nights;

    const bookingData = {
      hotelId: hotel.id,
      hotelName: hotel.name,
      checkIn,
      checkOut,
      guests,
      roomType: room.type,
      totalPrice,
    };

    // Save booking details for payment page
    localStorage.setItem(
      "pendingBooking",
      JSON.stringify({
        type: "hotel",
        data: bookingData,
      }),
    );

    navigate("/payment");
  };

  const handleFlightSubmit = () => {
    if (!flight || !user) {
      setMessage(t("booking.loginRequired"));
      return;
    }
    const totalPrice = flight.price * passengers;

    const bookingData = {
      flightId: flight.id,
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      departTime: flight.departTime,
      arriveTime: flight.arriveTime,
      passengers,
      totalPrice,
    };

    // Save booking details for payment page
    localStorage.setItem(
      "pendingBooking",
      JSON.stringify({
        type: "flight",
        data: bookingData,
      }),
    );

    navigate("/payment");
  };

  return (
    <div className="booking-page">
      {hotel && (
        <>
          {/* Hotel Header Image */}
          <div className="hotel-header">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="hotel-main-image"
            />
            <div className="hotel-overlay">
              <h1>{hotel.name}</h1>
              <div className="hotel-meta">
                <span className="location">
                  📍 {hotel.city}, {hotel.country}
                </span>
                <span className="rating">
                  ⭐ {hotel.rating} ({hotel.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="booking-container">
            {/* Hotel Details */}
            <div className="hotel-details">
              <section className="section-card section-dark">
                <h2>Overview</h2>
                <p>{hotel.description}</p>

                <h3>Amenities</h3>
                <div className="amenities-grid">
                  {hotel.amenities.map((amenity, index) => (
                    <span key={index} className="amenity-tag">
                      {amenity}
                    </span>
                  ))}
                </div>
              </section>

              <section className="section-card section-dark">
                <h2>Available room options</h2>
                <div className="rooms-list">
                  {hotel.rooms.map((room) => (
                    <div key={room.id} className="room-card">
                      <div className="room-info">
                        <h3>{room.type}</h3>
                        <p>{room.description}</p>
                        <div className="room-details">
                          <span>🏠 Capacity: {room.capacity} guests</span>
                          <span>💰 {room.pricePerNight} SAR / night</span>
                        </div>
                      </div>
                      <button
                        className={`room-select-btn ${roomType === room.type ? "selected" : ""}`}
                        onClick={() => setRoomType(room.type)}
                      >
                        {roomType === room.type ? "Selected" : "Choose"}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Booking Form Sidebar */}
            <div className="booking-sidebar">
              <div className="booking-card section-card section-dark">
                <h3>{t("booking.bookingHeading")}</h3>

                <div className="form-row">
                  <div className="input-group">
                    <label>{t("booking.checkIn")}</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>{t("booking.checkOut")}</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>{t("booking.guests")}</label>
                    <input
                      type="number"
                      min={1}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                    />
                  </div>
                </div>

                {checkIn && checkOut && roomType && (
                  <div className="price-breakdown">
                    <div className="price-row">
                      <span>Selected room: {roomType}</span>
                      <span>
                        {hotel.rooms.find((r) => r.type === roomType)
                          ?.pricePerNight || 0}{" "}
                        SAR ×{" "}
                        {Math.ceil(
                          (new Date(checkOut).getTime() -
                            new Date(checkIn).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        nights
                      </span>
                    </div>
                    <div className="price-row">
                      <span>
                        {t("booking.guests")}: {guests}
                      </span>
                      <span>Free</span>
                    </div>
                    <div className="price-total">
                      <strong>
                        {t("booking.total")}:{" "}
                        {(hotel.rooms.find((r) => r.type === roomType)
                          ?.pricePerNight || 0) *
                          guests *
                          Math.ceil(
                            (new Date(checkOut).getTime() -
                              new Date(checkIn).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )}{" "}
                        SAR
                      </strong>
                    </div>
                  </div>
                )}

                <button
                  className="primary-button booking-btn"
                  onClick={handleHotelSubmit}
                >
                  {t("hotelSearch.bookNow")}
                </button>

                {message && (
                  <p
                    className={`booking-message ${message === t("booking.success") ? "success" : "error"}`}
                  >
                    {message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {flight && (
        <div className="section-card section-dark">
          <div className="booking-details">
            <div className="card" style={{ marginBottom: "20px" }}>
              <img
                src={flight.image}
                alt={`${flight.airline} ${flight.flightNumber}`}
                className="flight-booking-image"
              />
              <div className="card-body">
                <h3>
                  {flight.airline} - {flight.flightNumber}
                </h3>
                <p>
                  {flight.origin} → {flight.destination}
                </p>
                <p>
                  Depart: {flight.departTime} | Arrive: {flight.arriveTime}
                </p>
                <p>
                  Duration: {flight.duration} | Stops: {flight.stops}
                </p>
                <p>Price: {flight.price} SAR per passenger</p>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{t("booking.passengers")}</label>
                <input
                  type="number"
                  min={1}
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="price-summary">
              <p>
                {t("booking.total")}: {flight.price * passengers} SAR
              </p>
            </div>

            <button className="primary-button" onClick={handleFlightSubmit}>
              {t("flightSearch.bookNow")}
            </button>
          </div>
        </div>
      )}

      <div className="booking-actions">
        <button className="primary-button sub" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
};

export default BookingPage;
