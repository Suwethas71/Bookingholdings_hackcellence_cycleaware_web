import { createContext, useContext, useState, useCallback } from 'react';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [travelMode, setTravelMode] = useState('BUS');
  const [travelClass, setTravelClass] = useState('GOVERNMENT');
  const [travellers, setTravellers] = useState(1);
  const [nights, setNights] = useState(2);
  const [accommodationType, setAccommodationType] = useState('STANDARD');
  const [foodBudget, setFoodBudget] = useState(500);
  const [localTransport, setLocalTransport] = useState(400);
  const [misc, setMisc] = useState(500);

  const addDestination = useCallback((dest) => {
    setSelectedDestinations(prev => {
      if (prev.find(d => d.id === dest.id)) return prev;
      return [...prev, dest];
    });
  }, []);

  const removeDestination = useCallback((id) => {
    setSelectedDestinations(prev => prev.filter(d => d.id !== id));
  }, []);

  const reorderDestinations = useCallback((fromIndex, toIndex) => {
    setSelectedDestinations(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }, []);

  const isSelected = useCallback((id) => {
    return selectedDestinations.some(d => d.id === id);
  }, [selectedDestinations]);

  const totalEntryFees = selectedDestinations.reduce(
    (sum, d) => sum + (d.entryFee || 0), 0
  );

  return (
    <TripContext.Provider value={{
      selectedDestinations,
      addDestination,
      removeDestination,
      reorderDestinations,
      isSelected,
      travelMode,
      setTravelMode,
      travelClass,
      setTravelClass,
      travellers,
      setTravellers,
      nights,
      setNights,
      accommodationType,
      setAccommodationType,
      foodBudget,
      setFoodBudget,
      localTransport,
      setLocalTransport,
      misc,
      setMisc,
      totalEntryFees,
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrip must be used within TripProvider');
  return ctx;
}

