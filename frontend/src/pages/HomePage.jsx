import HeroSection from '../components/HeroSection';
import FeedbackWall from '../components/FeedbackWall';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfaf4]">
      <main className="flex-1">
        <HeroSection />
        <FeedbackWall />
      </main>
      <Footer />
    </div>
  );
}
