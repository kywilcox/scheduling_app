import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="d-flex justify-content-between align-items-center p-3 bg-primary text-white">
        <div>
          <img src="logo-placeholder.jpg" alt="Logo" className="logo"/>
        </div>
        <div className="user-info">
          <span>Welcome, User</span>
          <button className="btn btn-secondary ml-3">Logout</button>
        </div>
      </header>
      
      <main className="container mt-5">
        <section className="row text-center">
          <div className="col-md-4">
            <img src="image-placeholder.jpg" alt="Placeholder 1" className="img-fluid"/>
          </div>
          <div className="col-md-4">
            <img src="image-placeholder.jpg" alt="Placeholder 2" className="img-fluid"/>
          </div>
          <div className="col-md-4">
            <img src="image-placeholder.jpg" alt="Placeholder 3" className="img-fluid"/>
          </div>
        </section>
        
        <section className="info-section text-center mt-5">
          <h2>Information Section</h2>
          <p>Details about the application, user statistics, and other relevant information can be displayed here.</p>
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

export default LandingPage;
