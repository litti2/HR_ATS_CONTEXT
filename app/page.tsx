import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import FeatureGrid from '@/components/landing/FeatureGrid';
import CTASection from '@/components/landing/CTASection';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <div className="divider" />
      <HowItWorks />
      <div className="divider" />
      <FeatureGrid />
      <div className="divider" />
      <CTASection />
    </>
  );
}
