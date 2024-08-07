import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axios'; // Import the axios instance
import { Modal, Button, Form } from 'react-bootstrap';
import { CsrfContext } from './Layout'; // Import the CsrfContext

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [expandedLocation, setExpandedLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newLocation, setNewLocation] = useState({
    location_name: '',
    location_abbreviation: '',
    location_address: '',
    location_address2: '',
    city: '',
    state: '',
    zip_code: ''
  });
  const csrfToken = useContext(CsrfContext); // Consume the csrfToken from the context

  useEffect(() => {
    // Fetch locations from the backend
    axios.get('http://localhost:8000/api/locations/', {
      headers: {
        'X-CSRFToken': csrfToken,
      },
      withCredentials: true,
    })
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the locations!', error);
      });
  }, [csrfToken]);

  const toggleLocationSection = (locationId) => {
    setExpandedLocation(expandedLocation === locationId ? null : locationId);
  };

  const handleInputChange = (locationId, field, value) => {
    if (locationId) {
      setLocations(prevLocations =>
        prevLocations.map(location =>
          location.location_id === locationId ? { ...location, [field]: value } : location
        )
      );
    } else {
      setNewLocation({ ...newLocation, [field]: value });
    }
  };

  const handleSave = async (locationId) => {
    const headers = {
      'X-CSRFToken': csrfToken,
    };

    if (locationId) {
      const location = locations.find(l => l.location_id === locationId);
      try {
        const response = await axios.put(`http://localhost:8000/api/locations/${locationId}/`, location, { headers });
        console.log('Location updated:', response.data);
      } catch (error) {
        console.error('There was an error updating the location!', error);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:8000/api/locations/', newLocation, { headers });
        setLocations([...locations, response.data]);
        setNewLocation({
          location_name: '',
          location_abbreviation: '',
          location_address: '',
          location_address2: '',
          city: '',
          state: '',
          zip_code: ''
        });
        setShowModal(false); // Close the modal after saving
        console.log('Location added:', response.data);
      } catch (error) {
        console.error('There was an error adding the location!', error);
      }
    }
  };

  return (
    <div>
      <h1>Locations</h1>
      <ul>
        {locations.map(location => (
          <li key={location.location_id}>
            <span
              onClick={() => toggleLocationSection(location.location_id)}
              style={{ cursor: 'pointer', color: 'blue' }}
            >
              {location.location_name}
            </span>
            {expandedLocation === location.location_id && (
              <div className="expandable-section">
                <div>
                  <label>Location Name:</label>
                  <input
                    type="text"
                    value={location.location_name}
                    onChange={(e) => handleInputChange(location.location_id, 'location_name', e.target.value)}
                  />
                </div>
                <div>
                  <label>Location Abbreviation:</label>
                  <input
                    type="text"
                    value={location.location_abbreviation}
                    onChange={(e) => handleInputChange(location.location_id, 'location_abbreviation', e.target.value)}
                  />
                </div>
                <div>
                  <label>Location Address:</label>
                  <input
                    type="text"
                    value={location.location_address}
                    onChange={(e) => handleInputChange(location.location_id, 'location_address', e.target.value)}
                  />
                </div>
                <div>
                  <label>Location Address2:</label>
                  <input
                    type="text"
                    value={location.location_address2}
                    onChange={(e) => handleInputChange(location.location_id, 'location_address2', e.target.value)}
                  />
                </div>
                <div>
                  <label>City:</label>
                  <input
                    type="text"
                    value={location.city}
                    onChange={(e) => handleInputChange(location.location_id, 'city', e.target.value)}
                  />
                </div>
                <div>
                  <label>State:</label>
                  <input
                    type="text"
                    value={location.state}
                    onChange={(e) => handleInputChange(location.location_id, 'state', e.target.value)}
                  />
                </div>
                <div>
                  <label>Zip Code:</label>
                  <input
                    type="text"
                    value={location.zip_code}
                    onChange={(e) => handleInputChange(location.location_id, 'zip_code', e.target.value)}
                  />
                </div>
                <button onClick={() => handleSave(location.location_id)}>Save</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add New Location
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="locationName">
              <Form.Label>Location Name</Form.Label>
              <Form.Control
                type="text"
                value={newLocation.location_name}
                onChange={(e) => handleInputChange(null, 'location_name', e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="locationAbbreviation">
              <Form.Label>Location Abbreviation</Form.Label>
              <Form.Control
                type="text"
                value={newLocation.location_abbreviation}
                onChange={(e) => handleInputChange(null, 'location_abbreviation', e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="locationAddress">
              <Form.Label>Location Address</Form.Label>
              <Form.Control
                type="text"
                value={newLocation.location_address}
                onChange={(e) => handleInputChange(null, 'location_address', e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="locationAddress2">
              <Form.Label>Location Address2</Form.Label>
              <Form.Control
                type="text"
                value={newLocation.location_address2}
                onChange={(e) => handleInputChange(null, 'location_address2', e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={newLocation.city}
                onChange={(e) => handleInputChange(null, 'city', e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="state">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                value={newLocation.state}
                onChange={(e) => handleInputChange(null, 'state', e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="zipCode">
              <Form.Label>Zip Code</Form.Label>
              <Form.Control
                type="text"
                value={newLocation.zip_code}
                onChange={(e) => handleInputChange(null, 'zip_code', e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={() => handleSave(null)}>
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Locations;
