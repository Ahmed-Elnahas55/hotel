import { useAppContext } from "../context/AppContext";
import type { Flight } from "../types";

interface Props {
  flight: Flight;
  onBook: (flight: Flight) => void;
}

const FlightCard: React.FC<Props> = ({ flight, onBook }) => {
  const { t } = useAppContext();

  return (
    <article className="card">
      <img
        src={flight.image}
        alt={`${flight.airline} ${flight.flightNumber}`}
      />
      <div className="flight-banner">
        <div>
          <h3>{flight.airline}</h3>
          <p>{flight.flightNumber}</p>
        </div>
        <div>
          <p className="route-text">
            {flight.origin} → {flight.destination}
          </p>
          <p className="flight-time">
            {flight.departTime} - {flight.arriveTime}
          </p>
        </div>
      </div>
      <div className="card-body">
        <div className="tag-list">
          <span className="tag">{flight.duration}</span>
          <span className="tag">
            {flight.stops === 0
              ? t("flightSearch.oneWay")
              : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
          </span>
          <span className="tag">{flight.price} SAR</span>
        </div>
        <p>
          {t("flightCard.from")} {flight.origin} {t("flightCard.to")}{" "}
          {flight.destination} {t("flightCard.with")} {flight.airline}
        </p>
        <div className="card-footer">
          <span className="price">{flight.price} SAR</span>
          <button className="primary-button" onClick={() => onBook(flight)}>
            {t("flightSearch.bookNow")}
          </button>
        </div>
      </div>
    </article>
  );
};

export default FlightCard;
