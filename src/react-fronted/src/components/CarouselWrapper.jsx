import React, { useRef, useState, useEffect } from 'react';

export default function CarouselWrapper({ children, dependency }) {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrowStates = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);
    }
  };

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.75;
      if (direction === 'left') {
        carouselRef.current.scrollLeft -= scrollAmount;
      } else {
        carouselRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', updateArrowStates);
      updateArrowStates();
      window.addEventListener('resize', updateArrowStates);
    }
    return () => {
      if (carousel) carousel.removeEventListener('scroll', updateArrowStates);
      window.removeEventListener('resize', updateArrowStates);
    };
  }, [dependency]);

  // מפעילים את הפונקציה שקיבלנו ב-children ומעבירים לה את כל מה שצריך
  return children({
    carouselRef,
    canScrollLeft,
    canScrollRight,
    scroll
  });
}