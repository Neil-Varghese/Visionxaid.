import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center pt-2 md:pt-4 pointer-events-none">
      <nav
        className="
          fixed top-6 left-1/2 -translate-x-1/2 z-50
          inline-flex items-center gap-4
          border border-slate-700
          bg-black/40 backdrop-blur-md
          px-3 py-1.5 rounded-full
          text-white text-sm
          pointer-events-auto
        "
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          
        

          <span className="font-brand font-extrabold text-[15px] tracking-tight">
            VisionXaid
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 ml-6">
          {[
            { name: "Home", path: "/" },
            { name: "How It Works", path: "/how-it-works" },
            { name: "About Us", path: "/about" },
          ].map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `relative overflow-hidden h-6 transition ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Predict Button */}
        <NavLink
          to="/predict"
          className="
            bg-white text-black
            px-5 py-2 rounded-full
            text-sm font-medium
            shadow-[0px_0px_24px_4px] shadow-white/40
            hover:shadow-[0px_0px_28px_8px] hover:shadow-white/50
            hover:bg-slate-100
            transition duration-300
          "
        >
          Predict
        </NavLink>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-400"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="
              absolute top-20 left-1/2 -translate-x-1/2
              w-[90%] max-w-sm
              bg-black/90 backdrop-blur-md
              border border-slate-700
              rounded-2xl
              flex flex-col items-center gap-4
              py-6
              md:hidden
              z-40
            "
          >
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className="hover:text-indigo-400 transition"
            >
              Home
            </NavLink>

            <NavLink
              to="/how-it-works"
              onClick={() => setMenuOpen(false)}
              className="hover:text-indigo-400 transition"
            >
              How It Works
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="hover:text-indigo-400 transition"
            >
              About Us
            </NavLink>

            <NavLink
              to="/predict"
              onClick={() => setMenuOpen(false)}
              className="
                mt-2
                bg-white text-black
                px-6 py-2
                rounded-full
                text-sm font-medium
                shadow-[0px_0px_24px_4px] shadow-white/40
                hover:shadow-[0px_0px_28px_8px] hover:shadow-white/50
                transition duration-300
              "
            >
              Predict
            </NavLink>
          </div>
        )}
      </nav>
    </div>
  );
}
