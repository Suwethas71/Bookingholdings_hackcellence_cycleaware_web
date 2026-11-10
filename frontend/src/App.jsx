import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import Navbar from './components/Navbar';
import CycleAwareModal from './components/CycleAwareModal';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import BudgetPage from './pages/BudgetPage';
import ItineraryDashboard from './pages/ItineraryDashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <div className="min-h-screen bg-[#fdfaf4] text-gray-900 flex flex-col font-sans">
            <Navbar />
            <CycleAwareModal />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/itinerary" element={<ItineraryDashboard />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </div>
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
