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
  // State to hold the fetched restaurant data from the backend
  const [nearYouRestaurants, setNearYouRestaurants] = useState([]);
  const [topRatedRestaurants, setTopRatedRestaurants] = useState([]);
  
  // Loading flag to show text/spinner until backend request resolves
  const [loading, setLoading] = useState(true);

  // React Router hook for programmatic dashboard redirects
  const navigate = useNavigate(); 

  // Side-effect hook to fetch main dashboard feed data once on component mount
  useEffect(() => {
    const fetchNearYou = async () => {
      try {
        const savedLocation = localStorage.getItem('userLocation');
        let urlNear = '';
        // If the user has a saved location, we fetch nearby restaurants using their coordinates. Otherwise, we fetch all restaurants without sorting.
        if (savedLocation) {
          const { lat, lng } = JSON.parse(savedLocation);
          urlNear = `http://localhost:3000/api/restaurants?sort=nearby&lat=${lat}&lng=${lng}`;
        } else {
          urlNear = `http://localhost:3000/api/restaurants`;
        }
        
        const resNear = await fetch(urlNear, { 
          method: 'GET', 
          headers: { 'Content-Type': 'application/json' } 
        });

        const dataNear = await resNear.json();
        
        setNearYouRestaurants(dataNear);
      } catch (error) {
        console.error("Failed to fetch near you restaurants, using fallback:", error);
        const fallbackMock = [
          { id: 1, name: "Pizza Papa John's", description: "American Pizza", rating: "7.8", distance: "1.2", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" }
        ];
        setNearYouRestaurants(fallbackMock);
      }
    };
    const fetchTopRated = async () => {
      try {
        const savedLocation = localStorage.getItem('userLocation');
        let urlTopRated = `http://localhost:3000/api/restaurants?sort=topRated`;
        
        if (savedLocation) {
          const { lat, lng } = JSON.parse(savedLocation);
          urlTopRated += `&lat=${lat}&lng=${lng}`;
        }

        const resTopRated = await fetch(urlTopRated, { method: 'GET' });
        const dataTopRated = await resTopRated.json();
        setTopRatedRestaurants(dataTopRated);
      } catch (error) {
        console.error(error);
      }
    };

    // Initialize the homepage by fetching both "near you" and "top rated" restaurant data, and manage the loading state accordingly.
    const initHomePage = async () => {
      
      setLoading(true);
      await Promise.all([fetchNearYou(), fetchTopRated()]);
      setLoading(false);
    };
    
    initHomePage();

    // Event listener to handle location changes and refetch nearby restaurants when the user's location is updated.
    const handleLocationChange = async () => {
      await fetchNearYou();
    };

    window.addEventListener('locationChanged', handleLocationChange);
  
    return () => {
      window.removeEventListener('locationChanged', handleLocationChange);
    };
  }, []);

  // Callback wrapper passing selected category names to the dynamic filtering page
  const handleCategoryClick = (categoryName) => {
    if (categoryName) {
      navigate(`/category/${encodeURIComponent(categoryName)}`);
    }
  };

  return (
    <>
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
            {nearYouRestaurants.length > 0 && (
              <RestaurantCarousel 
                title="Dinner near you"
                onSeeAllClick={() => navigate('/see-all/near-you')}
              >
                {nearYouRestaurants.map((restaurant) => (
                <RestaurantCard key={`near-${restaurant.id}`} {...restaurant} />
              ))}
            </RestaurantCarousel>
            )}
            {/* --- TOP RATED SECTION: Rendered dynamically only if populated records exist --- */}
            {topRatedRestaurants.length > 0 && (
              <RestaurantCarousel 
                title="Top Rated Restaurants ⭐"  
                onSeeAllClick={() => navigate('/see-all/top-rated')}
              >
                {topRatedRestaurants.map((restaurant) => (
                  <RestaurantCard key={`top-${restaurant.id}`} {...restaurant} />
                ))}
              </RestaurantCarousel>
            )}
            
          </div>
        )}
      </div>
    </>
  );
}

export default HomePage;