import { TopBar } from "@/components/site/TopBar"
import { Hero } from "@/components/site/Hero"
import { ServicesRibbon } from "@/components/site/ServicesRibbon"
import { ServicesGrid } from "@/components/site/ServicesGrid"
import { TrustStrip } from "@/components/site/TrustStrip"
import { LikeSection } from "@/components/site/LikeSection"
import { CtaSection, StickyCtaBar } from "@/components/site/CtaSection"
import { Footer } from "@/components/site/Footer"

/**
 * Sharea — one universal page for every approved location.
 * A. top app bar · B. hero approval · C. services ribbon · D. services grid
 * E. trust strip · F. like + counter · G. CTAs + sticky bar · H. footer
 */
export default function App() {
  return (
    <div className="page-min-h flex min-h-screen flex-col">
      <TopBar />
      <main className="flex-1">
        <Hero />
        <ServicesRibbon />
        <ServicesGrid />
        <TrustStrip />
        <LikeSection />
        <div id="share-row" className="scroll-mt-24">
          <CtaSection />
        </div>
      </main>
      <Footer />
      <StickyCtaBar />
    </div>
  )
}
