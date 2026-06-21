import React from 'react';
import CarouselWrapper from './CarouselWrapper';
import './CategoriesCarousel.css';

export default function CategoriesCarousel({ categories, onCategorySelect }) {
  return (
    <div className="categories-carousel-container">
      
      {/* ה-Wrapper מנהל את הלוגיקה ומספק את הפונקציות */}
      <CarouselWrapper dependency={categories}>
        {({ carouselRef, canScrollLeft, canScrollRight, scroll }) => (
          <>
            {/* שורת הכותרת - החצים יושבים פה בדיוק לצד הכותרת */}
            <div className="categories-header-row">
              <h2>Browse by category</h2>
              
              <div className="carousel-arrows-container">
                <button 
                  className={`wolt-arrow-btn ${!canScrollLeft ? 'wolt-btn-disabled' : ''}`} 
                  onClick={() => canScrollLeft && scroll('left')} 
                  disabled={!canScrollLeft}
                >
                  <svg fill="currentColor" width="16" height="16" viewBox="0 0 24 24" style={{ transform: 'rotate(180deg)' }}>
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </button>

                <button 
                  className={`wolt-arrow-btn ${!canScrollRight ? 'wolt-btn-disabled' : ''}`} 
                  onClick={() => canScrollRight && scroll('right')} 
                  disabled={!canScrollRight}
                >
                  <svg fill="currentColor" width="16" height="16" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* מסלול הגלילה */}
            <div 
              ref={carouselRef} 
              className="carousel-scroller-track"
              style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', scrollBehavior: 'smooth' }}
            >
              {categories.map((cat, index) => (
                <div 
                  key={index}
                  className="category-card-wrapper"
                  onClick={() => onCategorySelect(cat.name)}
                >
                  {/* הריבוע הצבעוני - מציג עכשיו את ה-icon במקום ה-image */}
                  <div className={`category-square-box box-color-${index % 5}`}>
                    <span className="category-box-icon">{cat.icon}</span>
                  </div>
                  {/* הכיתוב מתחת לריבוע */}
                  <span className="category-card-name">{cat.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CarouselWrapper>

    </div>
  );
}