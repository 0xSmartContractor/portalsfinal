import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Benefits } from '@/components/landing/Benefits';
import { ScheduleDemo } from '@/components/landing/ScheduleDemo';
import { FloorPlanDemo } from '@/components/landing/FloorPlanDemo';
import { CommunicationDemo } from '@/components/landing/CommunicationDemo';
import { Testimonials } from '@/components/landing/Testimonials';
import { Pricing } from '@/components/landing/Pricing';
import { Contact } from '@/components/landing/Contact';
import { CTA } from '@/components/landing/CTA';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Hero />
      <Features />
      <Benefits />
      <ScheduleDemo />
      <CommunicationDemo />
      <FloorPlanDemo />
      <Testimonials />
      <Pricing />
      <Contact />
      <CTA />
    </div>
  );
}