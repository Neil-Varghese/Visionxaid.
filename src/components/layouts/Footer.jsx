export default function Footer() {
  return (
    <footer
      className="
        relative overflow-hidden
        w-full
        px-6 md:px-16 lg:px-24 xl:px-32
        pt-10

        bg-black/40 backdrop-blur-md
        border-t border-slate-700
        text-sm text-slate-400
      "
    >
      {/* Background watermark */}
      <div className="hidden md:block absolute -bottom-20 -left-10 pointer-events-none select-none">
        <span className="text-[8rem] font-extrabold tracking-widest text-white/5">
          VISIONXAID
        </span>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <h2 className="text-base font-semibold text-white">
            VisionXaid
          </h2>

          <p className="text-sm leading-relaxed mt-3 max-w-sm text-slate-400">
            AI-assisted retinal disease screening for early detection of
            DR, Glaucoma, and AMD from fundus images.
          </p>

          <p className="text-xs mt-2 text-slate-500">
            Academic & screening use only.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col lg:items-center">
          <h2 className="font-semibold mb-3 text-white text-sm">
            Quick Links
          </h2>
          <div className="flex flex-col space-y-2">
            <a className="hover:text-white transition" href="/">Home</a>
            <a className="hover:text-white transition" href="/how-it-works">How it works</a>
            <a className="hover:text-white transition" href="/about">About us</a>
            <a className="hover:text-white transition" href="/prediction">Prediction</a>
          </div>
        </div>

        {/* Resources */}
        <div>
          <h2 className="font-semibold text-white mb-3 text-sm">
            Resources
          </h2>
          <div className="flex flex-col space-y-2">
            <a className="hover:text-white transition" href="/">Documentation</a>
            <a className="hover:text-white transition" href="/">References</a>
            <a className="hover:text-white transition" href="/">Privacy</a>
            <a className="hover:text-white transition" href="/">Terms</a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="
          flex flex-col md:flex-row
          items-center justify-between gap-3
          py-4 mt-10
          border-t border-slate-700
          text-xs text-slate-500
          relative z-10
        "
      >
        <p className="text-center">
          © 2025 VisionXaid
        </p>

        <div className="flex items-center gap-3">
          <a className="hover:text-white transition" href="/">Privacy</a>
          <a className="hover:text-white transition" href="/">Terms</a>
        </div>
      </div>
    </footer>
  );
}
