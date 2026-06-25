import React, { useState, useEffect } from 'react';
import RestaurantCarousel from '../components/RestaurantCarousel';
import RestaurantCard from '../components/RestaurantCard';
import { useNavigate } from 'react-router-dom';
import CategoriesCarousel from '../components/CategoriesCarousel';

// Hardcoded static data for the top categories carousel row
const POPULAR_CATEGORIES = [
    { name: 'Fast Food', icon: '🍔' },
    { name: 'Asian', icon: '🍜' },
    { name: 'Healthy', icon: '🥗' },
    { name: 'Meat', icon: '🍖' },
    { name: 'Desserts', icon: '🍰' }
];

function HomePage() {
  // State to store raw restaurant array fetched from the backend server
  const [restaurants, setRestaurants] = useState([]);
  
  // Loading flag to show text/spinner until backend request resolves
  const [loading, setLoading] = useState(true);

  // React Router hook for programmatic dashboard redirects
  const navigate = useNavigate(); 

  // Side-effect hook to fetch main dashboard feed data once on component mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Retrieve JWT token stored during user login/auth stage
        const token = localStorage.getItem('userToken');
        
        const response = await fetch('http://localhost:3000/api/restaurants', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Pass credentials securely
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        // Ensure data has defaults for frontend rendering if backend doesn't provide them
        const processedData = data.map(res => ({
          ...res,
          image: res.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500", // Default image
          rating: res.rating || "8.0",
          distance: res.distance || "1.0"
        }));

        setRestaurants(processedData);
        setLoading(false);    
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
        setRestaurants([]);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Callback wrapper passing selected category names to the dynamic filtering page
  const handleCategoryClick = (categoryName) => {
    if (categoryName) {
      navigate(`/category/${encodeURIComponent(categoryName)}`);
    }
  };



  // Client-side computation: Sorts items descending by rating and extracts top 5 entries
  const topRatedItems = [...restaurants]
    .sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0))
    .slice(0, 5) 
    .map((restaurant, index) => (
      <RestaurantCard key={`top-${index}`} {...restaurant} />
    ));

  return (
    <>
      {/* Note: Global Navbar removed from here since it is now injected via MainLayout */}
      <div className="container mt-5 pt-5">
        
        {/* Categories navigation track */}
        <CategoriesCarousel 
          categories={POPULAR_CATEGORIES}
          onCategorySelect={handleCategoryClick} 
        />
        
        {loading ? (
          <div className="text-white text-center mt-5">Loading restaurants...</div>
        ) : (
          <div className="d-flex flex-column gap-5 mt-4">
            
            {/* --- NEAR YOU SECTION: Sorted ascending by geolocation distance (Max 8 entries) --- */}
            <RestaurantCarousel 
              title="Dinner near you"
              onSeeAllClick={() => navigate('/see-all/near-you')}
            >
              {[...restaurants]
                .sort((a, b) => Number(a.distance || 0) - Number(b.distance || 0))
                .slice(0, 8) 
                .map((restaurant) => (
                  <RestaurantCard key={`near-${restaurant.id}`} {...restaurant} />
                ))
              }
            </RestaurantCarousel>

            {/* --- TOP RATED SECTION: Rendered dynamically only if populated records exist --- */}
            {topRatedItems.length > 0 && (
              <RestaurantCarousel 
                title="Top Rated Restaurants ⭐"  
                onSeeAllClick={() => navigate('/see-all/top-rated')}
              >
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