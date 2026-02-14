import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import Landing from "@/pages/Landing";
import How from "@/pages/How";
import Teampage from "@/pages/Teampage";
import Music from "@/components/sections/music.jsx";

import Prediction from "@/pages/Prediction";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

export default function App() {
  return (
    
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">

        {/* Fixed Navbar */}
        <Navbar />
        {/* Fixed Music Player */}
        <div className="fixed bottom-6 right-8 z-50">
          <Music />
        </div>

        {/* Page Content */}
        <main className="flex-1 px-4">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/predict" element={<Prediction />} />
            <Route path="/how-it-works" element={<How />} />
            <Route path="/about" element={<Teampage />} />
          </Routes>
        </main>
        {/* Footer */}
        <Footer />

      </div>
    </BrowserRouter>
  );
}
