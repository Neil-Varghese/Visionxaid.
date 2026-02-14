import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Testimonials from "@/components/sections/Testimonials";
import Cta from "@/components/sections/Cta";

export default function Landing() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <Features />
      <Testimonials />
      <Cta />
    </main>
  );
}