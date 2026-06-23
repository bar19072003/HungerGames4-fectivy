import React from 'react';

/**
 * ProductCard Component
 * Displays individual menu items/products found during global search.
 */
function ProductCard({ id, name, description, price, imageUrl }) {
  return (
    <div className="card h-100 border-0 shadow-sm custom-card overflow-hidden bg-wolt-secondary text-white">
      <div className="d-flex p-3 justify-content-between align-items-center">
        
        {/* Left Side: Product Info */}
        <div className="flex-grow-1 pe-3" style={{ textAlign: 'left', minWidth: 0 }}>
          <h6 className="fw-bold mb-1 text-truncate">{name}</h6>
          <p className="small mb-2 text-white text-truncate" style={{ opacity: 0.8 }}>{description}</p>
          <span className="fw-bold" style={{ color: '#009de0' }}>₪{price}</span>
        </div>

        {/* Right Side: Product Image */}
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={name} 
            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
          />
        )}
        
      </div>
    </div>
  );
}

export default ProductCard;