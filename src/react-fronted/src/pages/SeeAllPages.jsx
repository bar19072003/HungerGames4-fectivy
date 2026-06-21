import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';

function SeeAllPage() {
  const { type } = useParams(); // 'near-you' או 'top-rated'
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      
      try {
        const token = localStorage.getItem('userToken');
        const response = await fetch('http://localhost:3000/api/restaurants', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        let data = await response.json();
        
        let processedData = [...data];

        // מבצעים את המיון והסינון בצורה בטוחה
        if (type === 'near-you') {
          processedData.sort((a, b) => Number(a.distance || 0) - Number(b.distance || 0));
          processedData = processedData.slice(0, 10);
        } else if (type === 'top-rated') {
          processedData.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
          processedData = processedData.slice(0, 10);
        }

        setRestaurants(processedData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch from server, loading fallback data:", error);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [type]);

  const gridItems = restaurants.map((restaurant, index) => (
    <div className="col-12 col-md-6 col-lg-3" key={`seeall-${index}`}>
      <RestaurantCard {...restaurant} />
    </div>
  ));

  return (
    <div className="container mt-5 pt-5 text-start" style={{ direction: 'ltr' }}>
      <button className="btn btn-outline-light btn-sm mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>
      
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