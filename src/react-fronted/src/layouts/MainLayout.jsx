import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

function MainLayout() {

  return (
    <>
      {/* ה-Navbar שלכם נטען פה פעם אחת בלבד עבור כל האתר */}
      <Navbar />
      
      {/* הצינור שדרכו נכנס התוכן של HomePage או SearchPage */}
      <Outlet />
    </>
  );
}

export default MainLayout;