import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import Features from "./components/landing/Features";
import HowItWorks from "./components/landing/HowItWorks";
import Benefits from "./components/landing/Benefits";
import FAQ from "./components/landing/FAQ";
import FinalCTA from "./components/landing/FinalCTA";
import Footer from "./components/landing/Footer";

export default function ApplyAIHomepage() {
  return (
    <main
      style={{
        position: "relative",
        background: "#F8F6F1",
        color: "#1D1912",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap');     
        * {
          box-sizing: border-box;
        }

        .hover-lift {
          transition:
            transform 0.35s cubic-bezier(0.16,1,0.3,1),
            box-shadow 0.35s cubic-bezier(0.16,1,0.3,1),
            border-color 0.35s ease;
        }

        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -20px rgba(29,25,18,0.16);
        }

        .btn-primary {
          transition:
            transform 0.25s cubic-bezier(0.16,1,0.3,1),
            box-shadow 0.25s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 16px 32px -12px rgba(255,90,31,0.55);
        }

        .btn-primary:active {
          transform: translateY(0) scale(0.98);
        }

        .btn-ghost {
          transition:
            background 0.25s ease,
            border-color 0.25s ease,
            transform 0.25s ease;
        }

        .btn-ghost:hover {
          background: #FBF8F0;
          border-color: #E1D5B4 !important;
          transform: translateY(-1px);
        }

        .progress-fill {
          transition: width 0.3s ease-out;
        }

        .role-word {
          display: inline-block;
          animation: roleIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes roleIn {
          from {
            opacity: 0;
            transform: translateY(10px);
            filter: blur(4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        .chip-pop {
          animation: chipPop 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes chipPop {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(4px);
          }

          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .blob {
          position: absolute;
          border-radius: 999px;
          filter: blur(70px);
          opacity: 0.55;
          animation: floaty 14s ease-in-out infinite;
        }

        @keyframes floaty {
          0%, 100% {
            transform: translate(0,0) scale(1);
          }

          50% {
            transform: translate(20px,-24px) scale(1.06);
          }
        }

        .fade-up {
          animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .blob,
          .marquee-track,
          .role-word,
          .chip-pop,
          .fade-up {
            animation: none !important;
          }

          .hover-lift,
          .btn-primary,
          .btn-ghost {
            transition: none !important;
          }
        }

        a:focus-visible,
        button:focus-visible {
          outline: 2px solid #FF5A1F;
          outline-offset: 2px;
          border-radius: 6px;
        }
      `}</style>


      <Navbar />

      <Hero />

      <Features />

      <HowItWorks />

      <Benefits />

      <FAQ />

      <FinalCTA />

      <Footer />
    </main>
  );
}