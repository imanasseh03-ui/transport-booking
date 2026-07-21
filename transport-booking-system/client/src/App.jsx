import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Booking from "./pages/Booking";
import RoutesPage from "./pages/RoutesPage";
import Contact from "./pages/Contact";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Register from "./pages/Regiter";
import ForgotPassword from "./pages/ForgotPassord";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/book" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/search-results"
            element={<SearchResults />}
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;