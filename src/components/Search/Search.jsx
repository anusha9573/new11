import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Search.css'; 

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get('http://localhost:5000/api/users/search', {
        params: { username: searchTerm }
      });
      if (response.data.length > 0) {
        setUsers(response.data);
        setError('');
      } else {
        setUsers([]);
        setError('No users found');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users');
    }
  };

  return (
    <div className="container mt-4">
      <form className="form-container d-flex align-items-center mb-4" onSubmit={handleFormSubmit}>
        <div className="search-input-container position-relative flex-grow-1">
          <input
            type="text"
            placeholder="Enter username"
            value={searchTerm}
            onChange={handleInputChange}
            className="input-field"
            style={{ height: '50px', paddingRight: '60px' }}
          />
          <button type="submit" className="search-button">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </form>
      {error && <p className="error-message">{error}</p>}
      <div className="user-cards-container">
        {users.length > 0 ? (
          users.map(user => (
            <div key={user._id} className="user-card">
              <h3 className="username">
                <Link to={`/profile/${user._id}`} className="text-decoration-none">{user.username}</Link>
              </h3>
              <p className="email"><b>Email: </b>{user.email}</p>
              <p className="location"><b>Followers: </b>{user.followers.length || '0'}</p>
              <p className="bio"><b>Following: </b>{user.following.length || '0'}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No results found</p>
        )}
      </div>
    </div>
  );
};

export default Search;
