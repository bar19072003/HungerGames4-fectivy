import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';

function SeeAllPage() {
  // 1. Hooks & States: 'type' holds the specific dynamic view filter parameter ('near-you' or 'top-rated')
  const { type } = useParams(); 
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 2. React Router Trigger: Fetches data asynchronously whenever the dynamic sub-category type shifts
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      
      try {
        const savedLocation = localStorage.getItem('userLocation');

        let backendUrl = 'http://localhost:3000/api/restaurants';
        
        if (type === 'near-you') {
          if (savedLocation) {
            const { lat, lng } = JSON.parse(savedLocation);
            backendUrl += `?sort=nearby&lat=${lat}&lng=${lng}`;
          } else {
            backendUrl += `?sort=nearby`; 
          }
        } else if (type === 'top-rated') {
          backendUrl += `?sort=topRated`;
        }

        const response = await fetch(backendUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        setRestaurants(data); // Expects the backend array to arrive pre-sorted and capped
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch from server, rendering empty grid state:", error);
        setRestaurants([]); // Fallback to an empty array if the fetch fails
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [type]); // Forces re-fetch calculation if parameter updates natively

  // 3. UI Grid Layout Definition: Builds 4 columns per row on desktop using standard Bootstrap mixins
  const gridItems = restaurants.map((restaurant, index) => (
    <div className="col-12 col-md-6 col-lg-3" key={`seeall-${index}`}>
      <RestaurantCard {...restaurant} />
    </div>
  ));

  return (
    <div className="container mt-5 pt-5 text-start" style={{ direction: 'ltr' }}>
      
      {/* Dynamic Heading Title based on the active dynamic path segment context */}
      <h2 className="text-white fw-bold mb-4">
        {type === 'near-you' ? 'Closest Restaurants Near You' : 'Top Rated Restaurants ⭐'}
      </h2> 

      {loading ? (
        <div className="text-white text-center py-5" style={{ opacity: 0.6 }}>Loading restaurants...</div>
      ) : (
        <div>
          {restaurants.length > 0 ? (
            <div className="row g-4">{gridItems}</div>
          ) : (
            <p className="text-white-50 small">No restaurants found for this criteria.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SeeAllPage;