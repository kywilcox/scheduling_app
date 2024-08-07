import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axios'; // Import the axios instance
import { Modal, Button, Form } from 'react-bootstrap';
import { CsrfContext } from './Layout'; // Import the CsrfContext

const ManageAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    assignment_name: '',
    location_id: '',
    start_time: '',
    end_time: '',
    days_of_week: [],
    weekend_days: [],
    is_night: false,
    min_slots: '0',
    max_slots: '0',
    is_active: true,
  });
  const [locations, setLocations] = useState([]);  // Define the locations state
  const csrfToken = useContext(CsrfContext); // Consume the csrfToken from the context

  useEffect(() => {
    // Fetch assignments from the backend
    axios.get('http://localhost:8000/api/assignments/', {
      headers: {
        'X-CSRFToken': csrfToken,
      },
      withCredentials: true,
    })
      .then(response => {
        setAssignments(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the assignments!', error);
      });

    // Fetch locations for the dropdown
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

  const toggleAssignmentSection = (assignmentId) => {
    setExpandedAssignment(expandedAssignment === assignmentId ? null : assignmentId);
  };

  const handleInputChange = (assignmentId, field, value) => {
    if (assignmentId) {
      setAssignments(prevAssignments =>
        prevAssignments.map(assignment =>
          assignment.assignment_id === assignmentId ? { ...assignment, [field]: value } : assignment
        )
      );
    } else {
      setNewAssignment({ ...newAssignment, [field]: value });
    }
  };

  const handleSave = async (assignmentId) => {
    const headers = {
      'X-CSRFToken': csrfToken,
    };

    if (assignmentId) {
      const assignment = assignments.find(a => a.assignment_id === assignmentId);
      try {
        const response = await axios.put(`http://localhost:8000/api/assignments/${assignmentId}/`, assignment, { headers });
        console.log('Assignment updated:', response.data);
      } catch (error) {
        console.error('There was an error updating the assignment!', error);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:8000/api/assignments/', newAssignment, { headers });
        setAssignments([...assignments, response.data]);
        setNewAssignment({
          assignment_name: '',
          location_id: '',
          start_time: '',
          end_time: '',
          days_of_week: [],
          weekend_days: [],
          is_night: false,
          min_slots: '0',
          max_slots: '0',
          is_active: true,
        });
        setShowModal(false); // Close the modal after saving
        console.log('Assignment added:', response.data);
      } catch (error) {
        console.error('There was an error adding the assignment!', error);
      }
    }
  };

  return (
    <div>
      <h1>Manage Assignments</h1>
      <ul>
        {assignments.map(assignment => (
          <li key={assignment.assignment_id}>
            <span
              onClick={() => toggleAssignmentSection(assignment.assignment_id)}
              style={{ cursor: 'pointer', color: 'blue' }}
            >
              {assignment.assignment_name}
            </span>
            {expandedAssignment === assignment.assignment_id && (
              <div className="expandable-section">
                <div>
                  <label>Assignment Name:</label>
                  <input
                    type="text"
                    value={assignment.assignment_name}
                    onChange={(e) => handleInputChange(assignment.assignment_id, 'assignment_name', e.target.value)}
                  />
                </div>
                <div>
                  <label>Location:</label>
                  <select
                    value={assignment.location_id}
                    onChange={(e) => handleInputChange(assignment.assignment_id, 'location_id', e.target.value)}
                  >
                    {locations.map(location => (
                      <option key={location.location_id} value={location.location_id}>
                        {location.location_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Start Time:</label>
                  <input
                    type="time"
                    value={assignment.start_time}
                    onChange={(e) => handleInputChange(assignment.assignment_id, 'start_time', e.target.value)}
                  />
                </div>
                <div>
                  <label>End Time:</label>
                  <input
                    type="time"
                    value={assignment.end_time}
                    onChange={(e) => handleInputChange(assignment.assignment_id, 'end_time', e.target.value)}
                  />
                </div>
                <div>
                  <label>Days of the Week:</label>
                  <select
                    multiple
                    value={assignment.days_of_week}
                    onChange={(e) => handleInputChange(assignment.assignment_id, 'days_of_week', Array.from(e.target.selectedOptions, option => option.value))}
                  >
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
                <div>
                  <label>Weekend Days:</label>
                  <select
                    multiple
                    value={assignment.weekend_days}
                    onChange={(e) => handleInputChange(assignment.assignment_id, 'weekend_days', Array.from(e.target.selectedOptions, option => option.value))}
                  >
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                <div>
                  <label>Is Night Assignment:</label>
                  <input
                    type="checkbox"
                    checked={assignment.is_night}
                    onChange={(e) => handleInputChange(assignment.assignment_id, 'is_night', e.target.checked)}
                  />
                </div>
                <div>
                  <label>Min Slots:</label>
                  <input
                    type="number"
                    value={assignment.min_slots}
                    onChange={(e) => handleInputChange(assignment.assignment_id, 'min_slots', e.target.value)}
                  />
                </div>
                <div>
                  <label>Max Slots:</label>
                  <input
                    type="number"
                    value={assignment.max_slots}
                    onChange={(e) => handleInputChange(assignment.assignment_id, 'max_slots', e.target.value)}
                  />
                </div>
                <div>
                  <label>Is Active:</label>
                  <input
                    type="checkbox"
                    checked={assignment.is_active}
                    onChange={(e) => handleInputChange(assignment.assignment_id, 'is_active', e.target.checked)}
                  />
                </div>
                <button onClick={() => handleSave(assignment.assignment_id)}>Save</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add New Assignment
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="assignmentName">
              <Form.Label>Assignment Name</Form.Label>
              <Form.Control
                type="text"
                value={newAssignment.assignment_name}
                onChange={(e) => handleInputChange(null, 'assignment_name', e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="locationId">
              <Form.Label>Location</Form.Label>
              <Form.Control
                as="select"
                value={newAssignment.location_id}
                onChange={(e) => handleInputChange(null, 'location_id', e.target.value)}
              >
                {locations.map(location => (
                  <option key={location.location_id} value={location.location_id}>
                    {location.location_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="startTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={newAssignment.start_time}
                onChange={(e) => handleInputChange(null, 'start_time', e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="endTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={newAssignment.end_time}
                onChange={(e) => handleInputChange(null, 'end_time', e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="daysOfWeek">
              <Form.Label>Days of the Week</Form.Label>
              <Form.Control
                as="select"
                multiple
                value={newAssignment.days_of_week}
                onChange={(e) => handleInputChange(null, 'days_of_week', Array.from(e.target.selectedOptions, option => option.value))}
              >
                <option value="Sunday">Sunday</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="weekendDays">
              <Form.Label>Weekend Days</Form.Label>
              <Form.Control
                as="select"
                multiple
                value={newAssignment.weekend_days}
                onChange={(e) => handleInputChange(null, 'weekend_days', Array.from(e.target.selectedOptions, option => option.value))}
              >
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="isNight">
              <Form.Check
                type="checkbox"
                label="Is Night Assignment"
                checked={newAssignment.is_night}
                onChange={(e) => handleInputChange(null, 'is_night', e.target.checked)}
              />
            </Form.Group>
            <Form.Group controlId="minSlots">
              <Form.Label>Min Slots</Form.Label>
              <Form.Control
                type="number"
                value={newAssignment.min_slots}
                onChange={(e) => handleInputChange(null, 'min_slots', e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="maxSlots">
              <Form.Label>Max Slots</Form.Label>
              <Form.Control
                type="number"
                value={newAssignment.max_slots}
                onChange={(e) => handleInputChange(null, 'max_slots', e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="isActive">
              <Form.Check
                type="checkbox"
                label="Is Active"
                checked={newAssignment.is_active}
                onChange={(e) => handleInputChange(null, 'is_active', e.target.checked)}
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

export default ManageAssignments;
