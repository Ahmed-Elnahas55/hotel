import { useAppContext } from "../context/AppContext";
import type { Hotel } from "../types";

interface Props {
  hotel: Hotel;
  onBook: (hotel: Hotel) => void;
}

const HotelCard: React.FC<Props> = ({ hotel, onBook }) => {
  const { t } = useAppContext();

  return (
    <article className="card">
      <img src={hotel.image} alt={hotel.name} />
      <div className="card-body">
        <div className="card-top">
          <h3>{hotel.name}</h3>
          <span className="tag">
            {hotel.pricePerNight} {t("hotelCard.currency")}
          </span>
        </div>
        <p>
          {hotel.city}, {hotel.country}
        </p>
        <div className="tag-list">
          <span className="tag">⭐ {hotel.rating}</span>
          <span className="tag">
            {hotel.reviewCount} {t("hotelCard.reviews")}
          </span>
        </div>
        <p>{hotel.description}</p>
        <div className="card-footer">
          <span className="price">
            {hotel.pricePerNight} {t("hotelCard.perNight")}
          </span>
          <button className="primary-button" onClick={() => onBook(hotel)}>
            {t("hotelSearch.bookNow")}
          </button>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;
