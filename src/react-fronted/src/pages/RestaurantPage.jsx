import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner, Card, Button } from 'react-bootstrap';
import { getRestaurantById, getRestaurantProducts } from '../services/restaurantService';
import { AuthContext } from '../context/AuthContext';
import './RestaurantPage.css';

const RestaurantPage = () => {
    // 1. Extract the restaurant ID from the URL using React Router
    const { id } = useParams();

    const { currentUser } = useContext(AuthContext);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // 2. Implement an API call to fetch restaurant details and its menu
    useEffect(() => {
        const fetchRestaurantAndMenu = async () => {
            try {
                if (!id) throw new Error("No restaurant ID provided.");
                setLoading(true);
                
                // Fetch Restaurant Data
                const resData = await getRestaurantById(id);
                
                // Fetch Menu
                try {
                    resData.products = await getRestaurantProducts(id);
                } catch (err) {
                    console.error("Error fetching products:", err);
                    resData.products = [];
                }
                
                setRestaurant(resData);
                setError(null);
            } catch (err) {
                console.error("Error fetching restaurant data:", err);
                setError(err.message || "An unexpected error occurred while fetching data.");
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantAndMenu();
    }, [id]);

    // Removed handleProductClick

    if (loading) {
        return (
            <div className="restaurant-loading-container d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status" className="wolt-spinner">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Container className="restaurant-error-container mt-5 text-center">
                <h3 className="text-danger mb-3">Oops! Something went wrong</h3>
                <p className="text-muted">{error}</p>
                <button className="btn wolt-btn-primary mt-3" onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </Container>
        );
    }

    if (!restaurant) return null;

    // 3. Style the Banner area and render the list of dishes
    return (
        <div className="restaurant-page-wrapper">
            {/* Styled Banner Area */}
            <div className="wolt-hero-section">
                <div className="wolt-hero-image" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1920&q=80')` }}>
                    <div className="wolt-hero-gradient"></div>
                    <div className="wolt-hero-content-wrapper">
                        <div className="wolt-hero-text-container">
                            <h1 className="wolt-hero-title">{restaurant.name}</h1>
                            <p className="wolt-hero-subtitle">{restaurant.description}</p>
                        </div>
                        <div className="wolt-hero-logo">
                            <h2 className="wolt-hero-logo-text">{restaurant.name.substring(0, 2).toUpperCase()}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dark Information Bar */}
            <div className="wolt-info-bar">
                <Container fluid="xl" className="wolt-info-container">
                    <div className="wolt-info-content">
                        <div className="wolt-info-stats">
                            {restaurant.estimatedDeliveryTime && (
                                <div className="wolt-time-pill delivery-pill">
                                    <span className="me-2">🛵</span> 
                                    Estimated delivery {restaurant.estimatedDeliveryTime}-{restaurant.estimatedDeliveryTime + 10} min
                                </div>
                            )}
                            <div className="wolt-stat-item">
                                <span className="wolt-rating-icon">😊</span> 9.0
                            </div>
                            <span className="wolt-stat-separator">•</span>
                            <div className="wolt-stat-item">
                                Open until {restaurant.working_hours || "23:00"}
                            </div>
                            <span className="wolt-stat-separator">•</span>
                            <div className="wolt-stat-item">
                                Minimum order $15.00
                            </div>
                            <span className="wolt-stat-separator">•</span>
                            <div className="wolt-stat-item text-cyan ms-3">
                                Restaurant info
                            </div>
                        </div>
                        
                        <div className="wolt-info-actions">
                            {currentUser && currentUser.role === 'restaurant_owner' && currentUser.id === restaurant.ownerId && (
                                <Button variant="primary" className="wolt-add-product-btn fw-bold rounded-pill px-4 ms-3 shadow-sm">
                                    + Add Product
                                </Button>
                            )}
                        </div>
                    </div>
                </Container>
            </div>

            {/* Dark Search & Navigation Bar */}
            <div className="wolt-nav-bar">
                <Container fluid="xl" className="wolt-nav-container">
                    <div className="wolt-nav-content">
                        <div className="wolt-search-wrapper">
                            <span className="wolt-search-icon">🔍</span>
                            <input 
                                type="text" 
                                className="wolt-search-input" 
                                placeholder={`Search in ${restaurant.name}`} 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="wolt-categories">

                            <button 
                                className={`wolt-category-item ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                Show all items
                            </button>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Main Content Area: Render the list of dishes */}
            <div className="wolt-main-content">
                <Container fluid="xl">
                    <div className="restaurant-menu-container pt-4 pb-5">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                            <h2 className="fw-bold mb-0">Menu</h2>
                        </div>

                        {(() => {
                            const query = searchQuery.toLowerCase();
                            const displayedProducts = restaurant.products.filter(p => 
                                p.name.toLowerCase().includes(query) || 
                                (p.description && p.description.toLowerCase().includes(query))
                            );

                            if (displayedProducts.length === 0 || filter === 'recent') {
                                return (
                                    <div className="text-center py-5 my-5">
                                        <h4 className="text-muted fw-normal">
                                            {filter === 'recent' ? "No recently purchased items." : "No products found."}
                                        </h4>
                                    </div>
                                );
                            }

                            return (
                                <Row className="g-4">
                                    {displayedProducts.map(product => (
                                    <Col key={product.id} xs={12} md={6}>
                                        <Card className="wolt-product-card h-100 border-0 shadow-sm">
                                            <Card.Body className="wolt-product-card-body p-0">
                                                <div className="wolt-product-content">
                                                    <div className="wolt-product-text-area">
                                                        <Card.Title className="wolt-product-name">
                                                            {product.name}
                                                        </Card.Title>
                                                        <Card.Text className="wolt-product-desc">
                                                            {product.description}
                                                        </Card.Text>
                                                        <div className="wolt-product-price">
                                                            ${product.price ? parseFloat(product.price).toFixed(2) : '0.00'}
                                                        </div>
                                                    </div>
                                                    <div className="wolt-product-image-container">
                                                        {product.imageUrl ? (
                                                            <img 
                                                                src={product.imageUrl} 
                                                                alt={product.name} 
                                                                className="wolt-product-img" 
                                                            />
                                                        ) : (
                                                            <div className="wolt-product-img-placeholder d-flex justify-content-center align-items-center">
                                                                <span className="placeholder-icon">🍔</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    ))}
                                </Row>
                            );
                        })()}
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default RestaurantPage;