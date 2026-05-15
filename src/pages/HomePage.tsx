import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hotels, flights } from "../data";
import { useAppContext } from "../context/AppContext";
import HotelCard from "../components/HotelCard";
import FlightCard from "../components/FlightCard";
import type { Hotel, Flight } from "../types";

const HomePage: React.FC = () => {
  const { t, user } = useAppContext();
  const navigate = useNavigate();
  const [hotelDestination, setHotelDestination] = useState("");
  const [hotelCheckIn, setHotelCheckIn] = useState("");
  const [hotelCheckOut, setHotelCheckOut] = useState("");
  const [hotelGuests, setHotelGuests] = useState(2);
  const [flightOrigin, setFlightOrigin] = useState("");
  const [flightDestination, setFlightDestination] = useState("");
  const [flightDepart, setFlightDepart] = useState("");
  const [flightPassengers, setFlightPassengers] = useState(1);

  const filteredHotels = useMemo(() => {
    const destination = hotelDestination.trim().toLowerCase();
    return hotels.filter(
      (hotel) =>
        hotel.city.toLowerCase().includes(destination) ||
        hotel.country.toLowerCase().includes(destination),
    );
  }, [hotelDestination]);

  const filteredFlights = useMemo(() => {
    const origin = flightOrigin.trim().toLowerCase();
    const destination = flightDestination.trim().toLowerCase();
    return flights.filter(
      (flight) =>
        flight.origin.toLowerCase().includes(origin) &&
        flight.destination.toLowerCase().includes(destination),
    );
  }, [flightOrigin, flightDestination]);

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="hero-subtitle">{t("hero.subtitle")}</span>
          <h1>
            {t("hero.titlePrefix")}{" "}
            <span>{t("hero.titleHighlight")}</span>
          </h1>
          <p>{t("hero.description")}</p>
          <div className="hero-search">
            <div className="hero-search-item">
              <label>{t("hotelSearch.destination")}</label>
              <input
                value={hotelDestination}
                onChange={(e) => setHotelDestination(e.target.value)}
                placeholder={t("hero.searchPlaceholder")}
              />
            </div>
            <button className="primary-button hero-search-button">
              {t("hotelSearch.search")}
            </button>
          </div>
        </div>
      </section>

      <section id="hotels" className="section-card section-dark">
        <div className="section-heading-row">
          <div>
            <h2>{t("hero.hotels")}</h2>
            <p>{t("hero.hotelsDesc")}</p>
          </div>
        </div>
        <div className="form-row">
          <div className="input-group">
            <label>{t("hotelSearch.destination")}</label>
            <input
              value={hotelDestination}
              onChange={(e) => setHotelDestination(e.target.value)}
              placeholder="Riyadh, Jeddah, Dammam"
            />
          </div>
          <div className="input-group">
            <label>{t("hotelSearch.checkIn")}</label>
            <input
              type="date"
              value={hotelCheckIn}
              onChange={(e) => setHotelCheckIn(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>{t("hotelSearch.checkOut")}</label>
            <input
              type="date"
              value={hotelCheckOut}
              onChange={(e) => setHotelCheckOut(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>{t("hotelSearch.guests")}</label>
            <input
              type="number"
              min={1}
              value={hotelGuests}
              onChange={(e) => setHotelGuests(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="grid-cards">
          {filteredHotels.length ? (
            filteredHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onBook={(hotelItem) =>
                  navigate(`/booking?type=hotel&id=${hotelItem.id}`)
                }
              />
            ))
          ) : (
            <p>{t("hotelSearch.noResults")}</p>
          )}
        </div>
      </section>

      <section id="flights" className="section-card section-dark">
        <div className="section-heading-row">
          <div>
            <h2>{t("hero.flights")}</h2>
            <p>{t("hero.flightsDesc")}</p>
          </div>
        </div>
        <div className="form-row">
          <div className="input-group">
            <label>{t("flightSearch.origin")}</label>
            <input
              value={flightOrigin}
              onChange={(e) => setFlightOrigin(e.target.value)}
              placeholder="Riyadh, Jeddah"
            />
          </div>
          <div className="input-group">
            <label>{t("flightSearch.destination")}</label>
            <input
              value={flightDestination}
              onChange={(e) => setFlightDestination(e.target.value)}
              placeholder="Dubai, Cairo"
            />
          </div>
          <div className="input-group">
            <label>{t("flightSearch.departDate")}</label>
            <input
              type="date"
              value={flightDepart}
              onChange={(e) => setFlightDepart(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>{t("flightSearch.passengers")}</label>
            <input
              type="number"
              min={1}
              value={flightPassengers}
              onChange={(e) => setFlightPassengers(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="grid-cards">
          {filteredFlights.length ? (
            filteredFlights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                onBook={(flightItem) =>
                  navigate(`/booking?type=flight&id=${flightItem.id}`)
                }
              />
            ))
          ) : (
            <p>{t("flightSearch.noResults")}</p>
          )}
        </div>
      </section>

      <section id="explore" className="section-card section-dark">
        <div className="section-heading-row">
          <div>
            <h2>{t("hero.exploreTitle")}</h2>
            <p>{t("hero.exploreText")}</p>
          </div>
        </div>
        <div className="grid-cards">
          {filteredHotels.slice(0, 3).map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onBook={(hotelItem) =>
                navigate(`/booking?type=hotel&id=${hotelItem.id}`)
              }
            />
          ))}
        </div>
      </section>

      {!user && (
        <section className="section-card section-dark">
          <h2>{t("nav.login")}</h2>
          <p>{t("auth.loginPrompt")}</p>
        </section>
      )}
    </>
  );
};

export default HomePage;
