import "./SearchCard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchCard() {
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: "",
    passengers: "1",
  });

  const handleChange = (e) => {
    setSearchData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !searchData.from ||
      !searchData.to ||
      !searchData.date
    ) {
      alert("Please complete all required fields.");
      return;
    }

    navigate("/search-results", {
      state: searchData,
    });
  };

  return (
    <div className="search-card">
      <h2>Search Your Trip</h2>

      <form onSubmit={handleSubmit}>
        <select
          name="from"
          value={searchData.from}
          onChange={handleChange}
        >
          <option value="">Select Departure</option>
          <option value="Abuja">Abuja</option>
          <option value="Jos">Jos</option>
        </select>

        <select
          name="to"
          value={searchData.to}
          onChange={handleChange}
        >
          <option value="">Select Destination</option>
          <option value="Jos">Jos</option>
          <option value="Abuja">Abuja</option>
        </select>

        <input
          type="date"
          name="date"
          value={searchData.date}
          onChange={handleChange}
        />

        <select
          name="passengers"
          value={searchData.passengers}
          onChange={handleChange}
        >
          <option value="1">1 Passenger</option>
          <option value="2">2 Passengers</option>
          <option value="3">3 Passengers</option>
          <option value="4">4 Passengers</option>
        </select>

        <button type="submit">
          Search Trips
        </button>
      </form>
    </div>
  );
}

export default SearchCard;