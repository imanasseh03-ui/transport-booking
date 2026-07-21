import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import RoutesPage from "./pages/RoutesPage";
import Contact from "./pages/Contact";
import SearchResults from "./pages/SearchResults";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/search-results"
          element={<SearchResults />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;