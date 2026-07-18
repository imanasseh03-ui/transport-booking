import "./SearchTrip.css";

function SearchTrip() {
    return (
        <section className="search-trip">
            <h2>Search Your Trip </h2>

            <form className="search-form">
                <input type="text" placeholder="From" />

                <input type="text" placeholder="To" />

                <input type="date" />

                <button type="submit"></button>
            </form>
        </section>
    );
}

export default SearchTrip;