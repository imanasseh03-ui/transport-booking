import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import SearchTrip from "../components/Searchtrip/SearchTrip";
import Features from "../components/Features/Features";
import Footer from "../components/Footer/Footer";
import PopularRoutes from "../components/PopularRoutes/PopularRoutes";

function Home() {
    return (
        <>
        <Navbar />
        <Hero />
        <SearchTrip />
        <Features />
        <PopularRoutes />
        <Footer />
        </>
    );

}

export default Home;