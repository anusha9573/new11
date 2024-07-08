import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Row
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Correct usage of useNavigate

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts/');
        setBlogs(response.data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      }
    };

    fetchBlogs();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBlog = () => {
    navigate('/createblog'); // Navigate to CreateBlog component
  };

  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <h4>Top Blogs</h4>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleCreateBlog}>
            Create Blog
          </Button>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <Form>
            <InputGroup>
              <FormControl
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Button variant="outline-secondary">
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredBlogs.map((blog) => (
          <Col key={blog._id}>
            <Card>
            <img
  className="blog-image"
  src={blog.media && blog.media[0] ? `http://localhost:5000/${blog.media[0].url}` : 'default-image-url.jpg'}
  alt={blog.media && blog.media[0] ? blog.media[0].description || 'Blog media' : 'Default description'}
/>

              
              <CardBody>
                <CardTitle>{blog.title}</CardTitle>
                <CardText>{blog.content}</CardText>
                <CardText>
  <small className="text-muted">Author: {blog.author ? blog.author.username : 'Unknown'}</small>
</CardText>

              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Blog;
