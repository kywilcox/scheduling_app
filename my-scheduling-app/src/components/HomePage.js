import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';
import LoginPage from './LoginPage'; // Import the LoginPage component

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="d-flex justify-content-between align-items-center p-3 bg-primary text-white">
        <div>
          <img src="logo-placeholder.jpg" alt="Logo" className="logo"/>
        </div>
        <div className="login-fields">
        <LoginPage /> {/* Render the LoginPage component */}
        </div>
      </header>
      
      <main className="container mt-5">
        <section className="placeholder-container">
          <div className="placeholder">Placeholder 1</div>
          <div className="placeholder">Placeholder 2</div>
          <div className="placeholder">Placeholder 3</div>
        </section>
        
        <section className="call-to-action text-center mt-5">
          <img src="cta-placeholder.jpg" alt="Call to Action" className="img-fluid"/>
        </section>
      </main>

      <footer className="bg-secondary text-white text-center py-3 mt-5">
        <p>&copy; 2024 Scheduling App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
