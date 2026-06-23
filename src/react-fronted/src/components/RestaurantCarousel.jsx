  import React, { useRef, useState, useEffect } from 'react';
  import './RestaurantCarousel.css';

  // Component receives a title and generic "children" (the array of cards from parent)
  function RestaurantCarousel({ title, children, onSeeAllClick }) {
    // Reference hook to target and control the raw scrollable <div> element
    const carouselRef = useRef(null);
    
    // State triggers to handle button enabling/disabling styles
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Calculates the container scroll positions to toggle arrow states
    const updateArrowStates = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        
        // If scrollLeft > 2 pixels, it means we have scrolled right, so left arrow can turn on
        setCanScrollLeft(scrollLeft > 2);
        
        // If (current scroll position + screen width) is less than the total width, right arrow stays on
        setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);
      }
    };

    // Handles smooth horizontal paging a nimation (scrolls 4 cards at a time via clientWidth)
    const scroll = (direction) => {
      if (carouselRef.current) {
        const scrollAmount = carouselRef.current.clientWidth; 
        if (direction === 'left') {
          carouselRef.current.scrollLeft -= scrollAmount;
        } else {
          carouselRef.current.scrollLeft += scrollAmount;
        }
      }
    };

    // Listens to scroll and screen resize actions to re-evaluate the arrow states
    useEffect(() => {
      const carousel = carouselRef.current;
      if (carousel) {
        carousel.addEventListener('scroll', updateArrowStates);
        updateArrowStates(); // Run initial check on mount
        window.addEventListener('resize', updateArrowStates);
      }
      return () => {
        if (carousel) carousel.removeEventListener('scroll', updateArrowStates);
        window.removeEventListener('resize', updateArrowStates);
      };
    }, [children]); // Re-runs layout calculations whenever the cards inside load or change

    return (
      <div style={{ direction: 'ltr', textAlign: 'left' }} className="mb-5">
        
        {/* --- HEADER CONTROLS (Title, See All & Wolt Arrows) --- */}
        <div className="d-flex justify-content-between align-items-center mb-4 w-100">
          <h1 className="fw-bold fs-3 m-0 text-white">{title}</h1>
          
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-link text-decoration-none fw-semibold p-0" style={{ color: '#009de0', fontSize: '15px' }} onClick = {onSeeAllClick}>
              See all
            </button>

            <div className="d-flex gap-2 position-relative" style={{ minHeight: '40px', minWidth: '90px' }}>
              {/* Left Button */}
              <button 
                className={`wolt-btn-container ${!canScrollLeft ? 'wolt-btn-disabled' : ''}`} 
                onClick={() => canScrollLeft && scroll('left')} 
                disabled={!canScrollLeft}
              >
                <div className="cbc_IconButton_iconContainer_f04">
                  <svg fill="currentColor" role="presentation" width="16" height="16" viewBox="0 0 24 24" style={{ scale: '1.15', transform: 'rotate(180deg)' }}>
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
              </button>

              {/* Right Button */}
              <button 
                className={`wolt-btn-container ${!canScrollRight ? 'wolt-btn-disabled' : ''}`} 
                onClick={() => canScrollRight && scroll('right')} 
                disabled={!canScrollRight}
              >
                <div className="cbc_IconButton_iconContainer_f04">
                  <svg fill="currentColor" role="presentation" width="16" height="16" viewBox="0 0 24 24" style={{ scale: '1.15' }}>
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* --- CAROUSEL TRACK TRACK --- */}
        <div 
          ref={carouselRef}
          className="d-flex flex-nowrap custom-carousel" 
          style={{ gap: '1rem', scrollBehavior: 'smooth', overflowX: 'auto', overflowY: 'visible', padding: '16px' }} >
          {/* Renders the dynamic array of components passed from the parent view */}
          {children} 
        </div>

      </div>
    );
  }

  export default RestaurantCarousel;