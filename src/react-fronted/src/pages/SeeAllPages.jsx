import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';

function SeeAllPage() {
  // 1. Hooks & States: 'type' holds the specific dynamic view filter parameter ('near-you' or 'top-rated')
  const { type } = useParams(); 
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. React Router Trigger: Fetches data asynchronously whenever the dynamic sub-category type shifts
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      
      try {
        const token = localStorage.getItem('userToken');
        
        // Maps Frontend parameters cleanly to Backend query configurations
        let backendUrl = 'http://localhost:3000/api/restaurants?limit=10';
        if (type === 'near-you') {
          backendUrl += '&sortBy=distance';
        } else if (type === 'top-rated') {
          backendUrl += '&sortBy=rating';
        }

        const response = await fetch(backendUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        const processedData = data.map(res => ({
          ...res,
          image: res.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
          rating: res.rating || "8.0",
          distance: res.distance || "1.0"
        }));
        
        setRestaurants(processedData); // Expects the backend array to arrive pre-sorted and capped
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch from server, rendering empty grid state:", error);
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