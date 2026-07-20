import "./Hero.css";
import SearchCard from "../SearchCard/SearchCard";

function Hero() {
    return (
        <section className="hero">
  <div className="hero-left">
    <h1>Travel Across Nigeria in Comfort</h1>

    <p>
      Travel Made Simple...
      <br />
      Enjoy Peace and Comfort.
    </p>

    <div className="hero-buttons">
      <button>Book Now</button>
      <button className="secondary-btn">View Routes</button>
    </div>
  </div>

  <div className="hero-right">
    <SearchCard />
  </div>
</section>
    );
}

export default Hero;