import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [typedQuery, setTypedQuery] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (typedQuery.trim()) {
      navigate(`/search/${encodeURIComponent(typedQuery)}`);
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-wolt-secondary shadow-sm py-2 fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-white fs-4" to="/">
          Wolt
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarSupportedContent">
          
          <form onSubmit={handleSubmit} className="d-flex mx-lg-auto my-2 my-lg-0 justify-content-center" role="search" style={{ width: '100%', maxWidth: '450px' }}>
            <div className="input-group">
              <input 
                className="form-control border-0 text-white ps-3 placeholder-white-50"
                type="search" 
                placeholder="Search in Wolt..." 
                aria-label="Search"
                style={{ borderRadius: '20px 0 0 20px', backgroundColor: '#292E45'}}
                value={typedQuery}
                onChange={(e) => setTypedQuery(e.target.value)}
              />
              <button 
                className="btn bg-wolt-secondary text-white fw-bold px-4" 
                type="submit"
                style={{ borderRadius: '0 20px 20px 0' }}
              >🔍︎
              </button>
            </div>
          </form>
          
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