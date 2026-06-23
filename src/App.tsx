import { MotionConfig, motion, useScroll } from "framer-motion";
import weddingContent from "./data/weddingContent";
import HeroSection from "./components/sections/HeroSection";
import StorySection from "./components/sections/StorySection";
import MilkaSection from "./components/sections/MilkaSection";
import ProposalSection from "./components/sections/ProposalSection";
import WeddingDetailsSection from "./components/sections/WeddingDetailsSection";
import FooterSection from "./components/sections/FooterSection";

function App() {
  const { scrollYProgress } = useScroll();

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="relative min-h-screen overflow-x-clip bg-[var(--color-ivory)] text-[var(--color-forest)]">
        <a href="#main-content" className="skip-link">
          Saltar al contenido
        </a>
        <motion.div
          style={{ scaleX: scrollYProgress, transformOrigin: "left center" }}
          className="fixed left-0 top-0 z-50 h-[2px] w-full bg-[var(--color-gold)]"
        />
        <div className="paper-grain" aria-hidden />

        <main id="main-content" className="relative z-10" tabIndex={-1}>
          <HeroSection content={weddingContent.hero} />
          <StorySection content={weddingContent.story} />
          <MilkaSection content={weddingContent.milka} />
          <ProposalSection content={weddingContent.proposal} />
          <WeddingDetailsSection event={weddingContent.event} rsvp={weddingContent.rsvp} />
        </main>
        <FooterSection
          couple={weddingContent.couple}
          date={weddingContent.weddingDate}
          content={weddingContent.footer}
        />
      </div>
    </MotionConfig>
  );
}

export default App;
