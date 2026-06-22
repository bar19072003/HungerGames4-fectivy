import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './ProductModal.css';

/**
 * ProductModal Component
 * Renders a Wolt-style product detail and ordering modal with RTL support,
 * custom quantity selector, and total price calculation.
 * 
 * @param {Object} props
 * @param {boolean} props.show - Controls visibility of the modal
 * @param {function} props.onHide - Callback function triggered when modal is closed
 * @param {Object} props.product - The product data to display
 */
const ProductModal = ({ show, onHide, product }) => {
    const [quantity, setQuantity] = useState(1);

    // Reset quantity to 1 when modal is opened for a new product
    useEffect(() => {
        if (show) {
            setQuantity(1);
        }
    }, [show, product]);

    if (!product) return null;

    const handleIncrement = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const totalPrice = product.price * quantity;

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            dialogClassName="wolt-product-modal-dialog"
            contentClassName="wolt-product-modal-content"
            backdropClassName="wolt-product-modal-backdrop"
        >
            {/* Top Image Section with Floating Close Button */}
            <div className="wolt-modal-image-container">
                <img 
                    src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=cover'} 
                    alt={product.name} 
                    className="wolt-modal-image"
                />
                <button 
                    type="button" 
                    className="wolt-modal-close-btn" 
                    onClick={onHide}
                    aria-label="Close"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            {/* Modal Body / Product Details */}
            <div className="wolt-modal-body" dir="rtl">
                <h2 className="wolt-modal-title">{product.name}</h2>
                
                <div className="wolt-modal-meta-row">
                    {product.isPopular && (
                        <span className="wolt-modal-popular-badge">פופולרי</span>
                    )}
                    <span className="wolt-modal-price-display">
                        {product.price.toFixed(2)} ₪
                    </span>
                </div>

                <p className="wolt-modal-description">{product.description}</p>

                {/* 
                  * PLACEHOLDER: Option Groups & Add-ons Section 
                  * This is where user modifications and extras (e.g. toppings, size choices)
                  * will be integrated in the future.
                  */}
            </div>

            {/* Modal Footer / Action Bar */}
            <div className="wolt-modal-footer" dir="rtl">
                
                {/* Wide Cyan Add to Order Button */}
                <Button 
                    className="wolt-modal-submit-btn"
                    onClick={() => {
                        console.log(`Added ${quantity} of ${product.name} to order. Total: ₪${totalPrice.toFixed(2)}`);
                        onHide();
                    }}
                >
                    <span className="btn-text">להוסיף להזמנה</span>
                    <span className="btn-price">{totalPrice.toFixed(2)} ₪</span>
                </Button>

                {/* Custom Quantity Selector Pill */}
                <div className="wolt-modal-quantity-selector">
                    <button 
                        type="button" 
                        className="quantity-btn" 
                        onClick={handleIncrement}
                    >
                        +
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button 
                        type="button" 
                        className={`quantity-btn ${quantity === 1 ? 'disabled' : ''}`} 
                        onClick={handleDecrement}
                        disabled={quantity === 1}
                    >
                        -
                    </button>
                </div>

            </div>
        </Modal>
    );
};

ProductModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    product: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        description: PropTypes.string,
        image: PropTypes.string,
        isPopular: PropTypes.bool
    })
};

export default ProductModal;
