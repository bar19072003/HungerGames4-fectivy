import React, { useState, useEffect } from 'react';
import RestaurantCarousel from '../components/RestaurantCarousel';
import RestaurantCard from '../components/RestaurantCard';
import { useNavigate } from 'react-router-dom';
import CategoriesCarousel from '../components/CategoriesCarousel';

const POPULAR_CATEGORIES = [
    { name: 'Fast Food', icon: '🍔' },
    { name: 'Asian', icon: '🍜' },
    { name: 'Healthy', icon: '🥗' },
    { name: 'Meat', icon: '🍖' },
    { name: 'Desserts', icon: '🍰' }
];

function HomePage() {
  // State to store raw restaurant array from the server
  const [restaurants, setRestaurants] = useState([]);
  
  // Loading state to display fallback text while fetching data
  const [loading, setLoading] = useState(true);

  // 2. CRITICAL FIX: Define the navigate tool hook inside the component function scope
  const navigate = useNavigate(); 

  // Fetching data from the backend once on component mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('userToken');
        
        const response = await fetch('http://localhost:3000/api/restaurants', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        setRestaurants(data);
        setLoading(false);    
      } catch (error) {
        console.error("Failed to fetch restaurants, loading fallback data:", error);
        
        // 3. TEMPORARY FIX FOR TESTING: Inject temporary mock data if server is down
        const fallbackMock = [
          { id: 1, name: "Pizza Papa John's", description: "American Pizza", rating: "7.8", distance: "1.2", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" },
          { id: 2, name: "Burger Station", description: "Premium Burgers", rating: "8.5", distance: "2.4", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" }
        ];
        setRestaurants(fallbackMock);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleCategoryClick = (categoryName) => {
    if (categoryName) {
      // שולח אותך לעמוד החדש, למשל: /category/Asian
      navigate(`/category/${encodeURIComponent(categoryName)}`);
    }
  }

  // Loop through data array and convert each item into a React component
  const restaurantItems = restaurants.map((restaurant, index) => (
    <RestaurantCard key={index} {...restaurant} />
  ));

  const topRatedItems = [...restaurants]
    .sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0))
    .slice(0, 5) 
    .map((restaurant, index) => (
      <RestaurantCard key={`top-${index}`} {...restaurant} />
    ));

  return (
    <>
      <div className="container mt-5 pt-5">
        <CategoriesCarousel 
          categories={POPULAR_CATEGORIES}
          onCategorySelect={handleCategoryClick} 
        />
        {loading ? (
          <div className="text-white text-center mt-5">Loading restaurants...</div>
        ) : (
          <div className="d-flex flex-column gap-5 mt-4">
        {/* Render the carousel container and pass the list items inside it */}
          <RestaurantCarousel title="Dinner near you"
            onSeeAllClick={() => navigate('/see-all/near-you')}>
              {[...restaurants]
                .sort((a, b) => Number(a.distance || 0) - Number(b.distance || 0))
                .slice(0, 8) // או 5, כמה שנוח לך בעיצוב
                .map((restaurant) => (
                  <RestaurantCard key={`near-${restaurant.id}`} {...restaurant} />
                ))
              }
          </RestaurantCarousel>

          {topRatedItems.length > 0 && (
              <RestaurantCarousel 
              title="Top Rated Restaurants ⭐"  
              onSeeAllClick={() => navigate('/see-all/top-rated')}>
                {topRatedItems}
              </RestaurantCarousel>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default HomePage;