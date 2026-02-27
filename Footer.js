import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-5 py-4">
      <Container>
        <Row>
          <Col md={4}>
            <h5>BookStore</h5>
            <p>Your one-stop destination for all your reading needs. Discover thousands of books across all genres.</p>
          </Col>
          
          <Col md={2}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light text-decoration-none">Home</Link></li>
              <li><Link to="/books" className="text-light text-decoration-none">Books</Link></li>
              <li><Link to="/about" className="text-light text-decoration-none">About Us</Link></li>
              <li><Link to="/contact" className="text-light text-decoration-none">Contact</Link></li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h5>Categories</h5>
            <ul className="list-unstyled">
              <li><Link to="/books?genre=Fiction" className="text-light text-decoration-none">Fiction</Link></li>
              <li><Link to="/books?genre=Non-Fiction" className="text-light text-decoration-none">Non-Fiction</Link></li>
              <li><Link to="/books?genre=Mystery" className="text-light text-decoration-none">Mystery</Link></li>
              <li><Link to="/books?genre=Science%20Fiction" className="text-light text-decoration-none">Science Fiction</Link></li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h5>Contact Info</h5>
            <address>
              123 Book Street<br />
              Reading City, RC 12345<br />
              <a href="mailto:info@bookstore.com" className="text-light">info@bookstore.com</a><br />
              <a href="tel:+1234567890" className="text-light">+1 (234) 567-890</a>
            </address>
          </Col>
        </Row>
        
        <Row className="mt-3">
          <Col className="text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} BookStore. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;