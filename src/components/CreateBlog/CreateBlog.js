import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Button, Container, IconButton, Paper, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './createBlogStyles.css'; // Import the external CSS file

const CreateBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!title || !content || !location) {
      setError('All fields are required');
      return;
    }

    // Validate media file type
    if (mediaFile && !['image/jpeg', 'image/png', 'video/mp4'].includes(mediaFile.type)) {
      setError('Invalid media file type. Only JPEG, PNG images, and MP4 videos are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    
    const username = localStorage.getItem('username'); // Get the username from local storage
    formData.append('username', username);

    try {
      const token = localStorage.getItem('token'); // Get the token from local storage
      const userId = localStorage.getItem('userId'); // Get the userId from local storage

      if (!userId) {
        setError('User not authenticated');
        return;
      }

      formData.append('author', userId); // Append userId as author
      formData.append('location', location);

      // Append media file and its name if it exists
      if (mediaFile) {
        formData.append('media', mediaFile);
        formData.append('mediaName', mediaFile.name);
      }

      const response = await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Assuming Bearer token authentication
        },
      });
      console.log('Blog created:', response.data);
      navigate('/profile/posts'); // Redirect to user's posts page
    } catch (error) {
      console.error('Error creating blog:', error);
      setError('Failed to create blog. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    setMediaFile(e.target.files[0]);
  };

  return (
    <Container maxWidth="sm">
      <Paper className="create-blog-root">
        <Typography variant="h4" className="create-blog-title">
          Create New Blog
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form className="create-blog-form" onSubmit={handleSubmit}>
          <TextField
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Content"
            variant="outlined"
            multiline
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Location"
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            fullWidth
          />
          <input
            accept="image/*, video/*"
            className="create-blog-media-input"
            id="mediaFile"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="mediaFile" className="create-blog-media-label">
            <IconButton component="span">
              <AddPhotoAlternateIcon />
            </IconButton>
            Upload Media (Image or Video)
          </label>
          <Button
            type="submit"
            variant="contained"
            className="create-blog-submit-button"
            fullWidth
          >
            Create Blog
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateBlog;
