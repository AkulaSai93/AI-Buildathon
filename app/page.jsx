import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TesseractScroll from '@/components/TesseractScroll';
import Partners from '@/components/Partners';
import Advantage from '@/components/Advantage';
import MentorsGrid from '@/components/MentorsGrid';
import Mentors from '@/components/Mentors';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import SectionReveals from '@/components/SectionReveals';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TesseractScroll />
        <Partners />
        <Advantage />
        <MentorsGrid />
        <Mentors />
        <FAQ />
      </main>
      <Footer />
      <SectionReveals />
    </>
  );
}
