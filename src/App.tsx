import { MotionConfig, motion, useScroll } from "framer-motion";
import weddingContent from "./data/weddingContent";
import HeroSection from "./components/sections/HeroSection";
import StorySection from "./components/sections/StorySection";
import JourneySection from "./components/sections/JourneySection";
import MilkaSection from "./components/sections/MilkaSection";
import ProposalSection from "./components/sections/ProposalSection";
import GallerySection from "./components/sections/GallerySection";
import WeddingDetailsSection from "./components/sections/WeddingDetailsSection";

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
      <div className="relative min-h-screen overflow-x-hidden bg-[var(--color-ivory)] text-[var(--color-forest)]">
        <motion.div
          style={{ scaleX: scrollYProgress, transformOrigin: "left center" }}
          className="fixed left-0 top-0 z-50 h-[2px] w-full bg-[var(--color-gold)]"
        />
        <div className="paper-grain" aria-hidden />

        <main className="relative z-10">
          <HeroSection content={weddingContent.hero} />
          <StorySection content={weddingContent.story} />
          <JourneySection content={weddingContent.journey} />
          <MilkaSection content={weddingContent.milka} />
          <ProposalSection content={weddingContent.proposal} />
          <GallerySection content={weddingContent.gallery} />
          <WeddingDetailsSection event={weddingContent.event} rsvp={weddingContent.rsvp} />
        </main>
      </div>
    </MotionConfig>
  );
}

export default App;
