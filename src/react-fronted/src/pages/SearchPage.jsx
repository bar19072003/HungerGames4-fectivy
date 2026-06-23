import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import ProductCard from '../components/ProductCard';

function SearchPage() {
  // 1. Hooks & States: Extract query param from URL and initialize compartmentalized object data
  const { query } = useParams();
  const [searchResults, setSearchResults] = useState({ restaurants: [], products: [] });
  const [loading, setLoading] = useState(true);

  // 2. React Router Trigger: Runs every time the user updates the search input string in the Navbar
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('userToken');
        
        // Dynamic endpoint syntax packing the encoded text value directly inside the path param
        const response = await fetch(`http://localhost:3000/api/search/${encodeURIComponent(query)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        setSearchResults(data); // Expects JSON payload object layout: { restaurants: [...], products: [...] }
        setLoading(false);
      } catch (error) {
        console.error("Search API offline, rendering local mock results:", error);
        
        // OFFLINE DEV BUFFER: Sample data mapping matching queries dynamically to simulate database results
        const fakeResponseData = {
          restaurants: [
            { id: "res-uuid-fastfood-01", name: `Best Pizza containing "${query}"`, description: "Italian Pizza", rating: "9.0", distance: "0.5", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" },
            { id: "res-uuid-fastfood-02", name: `Burger Spot matching "${query}"`, description: "Burgers & Fries", rating: "8.1", distance: "2.9", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" }
          ],
          products: [
            { id: 101, name: `Delicious "${query}" Dish`, description: "Made with premium ingredients", price: 48, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500" },
            { id: 102, name: `Combo deal for ${query}`, description: "Includes a side and soft drink", price: 65, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500" }
          ]
        };

        setSearchResults(fakeResponseData);
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]); // CRITICAL: Forces full UI re-fetch cycle whenever dynamic keyword changes

  // 3. UI Component Mapping: Renders 4 columns per row on large desktop displays (col-lg-3)
  const restaurantGridItems = searchResults.restaurants.map((restaurant, index) => (
    <div className="col-12 col-md-6 col-lg-3" key={`res-${index}`}>
      <RestaurantCard {...restaurant} />
    </div>
  ));

  // 4. UI Component Mapping: Renders 2 columns per row for specialized product cards (col-md-6)
  const productGridItems = searchResults.products.map((product, index) => (
    <div className="col-12 col-md-6" key={`prod-${index}`}>
      <ProductCard {...product} />
    </div>
  ));

  return (
    <div className="container mt-5 pt-5 text-start" style={{ direction: 'ltr' }}>
      <h2 className="text-white fw-bold mb-4">Search results for: "{query}"</h2>

      {loading ? (
        <div className="text-white text-center py-5">Searching Wolt...</div>
      ) : (
        <div>
          {/* --- RESTAURANTS RESULTS DISPLAY --- */}
          <h3 className="text-white fw-bold fs-4 mb-3 mt-4">Restaurants</h3>
          {searchResults.restaurants.length > 0 ? (
            <div className="row g-4">{restaurantGridItems}</div>
          ) : (
            <p className="text-white-50 small">No restaurants found matching your search.</p>
          )}

          {/* Section Divider Line */}
          <hr className="border-secondary my-5" style={{ opacity: 0.2 }} />

          {/* --- DISHES & PRODUCTS RESULTS DISPLAY --- */}
          <h3 className="text-white fw-bold fs-4 mb-3">Dishes & Products</h3>
          {searchResults.products.length > 0 ? (
            <div className="row g-3">{productGridItems}</div>
          ) : (
            <p className="text-white-50 small">No dishes found matching your search.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPage;