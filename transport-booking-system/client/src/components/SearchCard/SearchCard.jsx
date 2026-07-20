import "./SearchCard.css";

function SearchCard() {
  return (
    <div className="search-card">
      <h2>Search Your Trip</h2>

      <input type="text" placeholder="From" />

      <input type="text" placeholder="To" />

      <input type="date" />

      <select>
        <option>1 Passenger</option>
        <option>2 Passengers</option>
        <option>3 Passengers</option>
        <option>4 Passengers</option>
      </select>

      <button>Search Trips</button>
    </div>
  );
}

export default SearchCard;