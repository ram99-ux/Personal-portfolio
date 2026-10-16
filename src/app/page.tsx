import Image from "next/image";
import { Header } from "@/components/Header/Header";
import { Hero } from "@/components/Hero/Hero";
import { About } from "@/components/About/About";
import { SelectedWork } from "@/components/SelectedWork/SelectedWork";
import { Capabilities } from "@/components/Capabilities/Capabilities";
import { Skills } from "@/components/Skills/Skills";
import { Services } from "@/components/Services/Services";
import { CTA } from "@/components/CTA/CTA";
import { FAQ } from "@/components/FAQ/FAQ";
import { Footer } from "@/components/Footer/Footer";
import { CustomCursor } from "@/components/CustomCursor/CustomCursor";
import { SiteMotion } from "@/components/animations/SiteMotion";
import { ContactProvider } from "@/components/Contact/ContactProvider";
import { profile } from "@/data/site";

export default function Home() {
  return (
    <ContactProvider>
      <div className="background-portrait" aria-hidden="true">
        <Image
          src={profile.portrait}
          alt=""
          fill
          sizes="70vw"
          loading="eager"
        />
      </div>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <SelectedWork />
        <Capabilities />
        <Skills />
        <Services />
        <CTA />
        <FAQ />
      </main>
      <Footer />
      <CustomCursor />
      <SiteMotion />
    </ContactProvider>
  );
}
