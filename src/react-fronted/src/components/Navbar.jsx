import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  // State to toggle mobile menu collapse/expand behavior
  const [isOpen, setIsOpen] = useState(false);
  
  // Local state holding the live input value from the search bar
  const [typedQuery, setTypedQuery] = useState('');
  
  // React Router hook for programmatic navigation
  const navigate = useNavigate();

  // Intercepts form submission to handle routing independently
  const handleSubmit = (e) => {
    e.preventDefault();
    if (typedQuery.trim()) {
      // Safely encodes the query string and forwards the user to the SearchPage route
      navigate(`/search/${encodeURIComponent(typedQuery)}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-wolt-secondary shadow-sm py-2 fixed-top">
      <div className="container-fluid">
        
        {/* Main logo/brand link directing back to the application root home page */}
        <Link className="navbar-brand fw-bold text-white fs-4" to="/">
          Wolt
        </Link>
        
        {/* Mobile Hamburger Trigger: Toggles the 'isOpen' state on small viewports */}
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible area container based on screen size and 'isOpen' state */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarSupportedContent">
          
          {/* --- SEARCH FORM BAR --- */}
          <form onSubmit={handleSubmit} className="d-flex mx-lg-auto my-2 my-lg-0 justify-content-center" role="search" style={{ width: '100%', maxWidth: '450px' }}>
            <div className="input-group">
              <input 
                className="form-control border-0 text-white ps-3 placeholder-white-50"
                type="search" 
                placeholder="Search in Wolt..." 
                aria-label="Search"
                style={{ borderRadius: '20px 0 0 20px', backgroundColor: '#292E45'}}
                value={typedQuery}
                onChange={(e) => setTypedQuery(e.target.value)} // Updates query state on every stroke
              />
              <button 
                className="btn bg-wolt-secondary text-white fw-bold px-4" 
                type="submit"
                style={{ borderRadius: '0 20px 20px 0' }}
              >🔍︎
              </button>
            </div>
          </form>
          
          {/* --- ACTION BUTTONS (Change to <Link to="/login"> to hook into the unified partner app) --- */}
          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            <button className="btn bg-wolt-secondary text-white fw-semibold px-3 border-0" style={{ borderRadius: '20px' }}>
              Log in
            </button>
            <button className="btn btn-outline-light fw-semibold px-3" style={{ borderRadius: '20px', backgroundColor: '#293166' }}>
              Sign up
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;