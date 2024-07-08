import DeleteIcon from '@mui/icons-material/Delete';
import { Button, IconButton, Typography } from '@mui/material';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import React, { useEffect, useState } from 'react';
import './media.css'; // Import custom CSS for additional styling

const MediaGallery = () => {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
    
        const response = await axios.get('http://localhost:5000/api/media', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        setMedia(response.data);
      } catch (err) {
        console.error('Error fetching media:', err.response ? err.response.data : err.message);
      }
    };
    

    fetchMedia();
  }, []);

  const handleDelete = async (id) => {

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/media/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      setMedia(media.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Error deleting media:', err.response ? err.response.data : err);
    }
  };
  
  ////
  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
  
    const username = localStorage.getItem('userId');
    formData.append('username', username);
  
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
  
      if (!userId) {
        console.error('User not authenticated');
        return;
      }
  
      formData.append('uploader', userId);
  
      const response = await axios.post('http://localhost:5000/api/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      setMedia([...media, response.data]);
    } catch (err) {
      console.error('Error uploading media:', err.response ? err.response.data : err);
    }
  };
  
  

  return (
    <div className="container-fluid gallery-container">
      <input
        accept="image/*"
        id="contained-button-file"
        multiple
        type="file"
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" component="span" className="btn btn-primary mb-3">
          Upload Media
        </Button>
      </label>
      <Typography variant="h5" align="center" gutterBottom>
        Media Gallery
      </Typography>
      <div className="grid-container">
        {media.map((item) => (
          <div key={item._id} className="grid-item position-relative">
            <img
              src={`http://localhost:5000${item.url}`}
              alt={item.description}
              className="img-fluid rounded gallery-image"
            />
            <IconButton
              aria-label="delete"
              className="btn btn-danger position-absolute top-0 end-0 m-2 delete-button"
              onClick={() => handleDelete(item._id)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaGallery;
