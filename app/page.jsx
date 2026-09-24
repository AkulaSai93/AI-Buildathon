import Hero from '@/components/Hero';
import Partners from '@/components/Partners';
import Advantage from '@/components/Advantage';
import BuiltToChallenge from '@/components/BuiltToChallenge';
import HowItWorks from '@/components/HowItWorks';
import MentorsGrid from '@/components/MentorsGrid';
import Mentors from '@/components/Mentors';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import SectionReveals from '@/components/SectionReveals';

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Partners />
        <Advantage />
        <BuiltToChallenge />
        <HowItWorks />
        <MentorsGrid />
        <Mentors />
        <FAQ />
      </main>
      <Footer />
      <SectionReveals />
    </>
  );
}
