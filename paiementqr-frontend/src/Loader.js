import React from 'react';
import './Loader.css'; // style dédié

function Loader() {
  return (
    <div className="loader-overlay">
      <div className="spinner" />
    </div>
  );
}

export default Loader;
