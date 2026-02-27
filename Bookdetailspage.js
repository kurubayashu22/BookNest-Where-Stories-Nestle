import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Button, Form, Badge, Card } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const { data } = await axios.get(`/api/books/${id}`);
      setBook(data);
    } catch (error) {
      console.error('Error fetching book details:', error);
      toast.error('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(book, quantity);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }

    try {
      await axios.post(`/api/books/${id}/reviews`, review, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Review added successfully');
      setReview({ rating: 5, comment: '' });
      fetchBookDetails(); // Refresh book details
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add review');
    }
  };

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-warning" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-warning" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-warning" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container className="py-5 text-center">
        <h2>Book not found</h2>
        <Link to="/books">Browse Books</Link>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{book.title} by {book.author} - BookStore</title>
        <meta name="description" content={book.description.substring(0, 160)} />
      </Helmet>

      <Container className="py-4">
        <Row>
          <Col md={4}>
            <Image 
              src={book.coverImage} 
              alt={book.title} 
              fluid 
              className="rounded shadow"
            />
          </Col>
          
          <Col md={8}>
            <h1>{book.title}</h1>
            <h5 className="text-muted mb-3">by {book.author}</h5>
            
            <div className="mb-3">
              {renderRating(book.rating)}
              <span className="ms-2">({book.reviews?.length || 0} reviews)</span>
            </div>

            <div className="mb-3">
              <Badge bg="info" className="me-2">{book.genre}</Badge>
              <Badge bg="secondary">{book.language}</Badge>
            </div>

            <p className="mb-3">
              <strong>Publisher:</strong> {book.publisher}<br />
              <strong>Published:</strong> {book.publicationYear}<br />
              <strong>Pages:</strong> {book.pages}<br />
              <strong>ISBN:</strong> {book.isbn}
            </p>

            <div className="mb-3">
              <h4 className="text-primary">${book.price.toFixed(2)}</h4>
              <p className={book.stockQuantity > 0 ? 'text-success' : 'text-danger'}>
                {book.stockQuantity > 0 ? `${book.stockQuantity} copies available` : 'Out of Stock'}
              </p>
            </div>

            {book.stockQuantity > 0 && (
              <div className="d-flex gap-3 mb-4">
                <Form.Control
                  type="number"
                  min="1"
                  max={book.stockQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  style={{ width: '80px' }}
                />
                <Button variant="primary" onClick={handleAddToCart}>
                  <FaShoppingCart className="me-2" />
                  Add to Cart
                </Button>
                <Button variant="outline-danger">
                  <FaHeart />
                </Button>
              </div>
            )}

            <div className="mb-4">
              <h5>Description</h5>
              <p>{book.description}</p>
            </div>
          </Col>
        </Row>

        {/* Reviews Section */}
        <Row className="mt-5">
          <Col md={8}>
            <h3 className="mb-4">Customer Reviews</h3>

            {/* Write Review */}
            {user && (
              <Card className="mb-4">
                <Card.Body>
                  <h5>Write a Review</h5>
                  <Form onSubmit={handleSubmitReview}>
                    <Form.Group className="mb-3">
                      <Form.Label>Rating</Form.Label>
                      <Form.Select
                        value={review.rating}
                        onChange={(e) => setReview({...review, rating: parseInt(e.target.value)})}
                      >
                        {[5,4,3,2,1].map(num => (
                          <option key={num} value={num}>{num} Stars</option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={review.comment}
                        onChange={(e) => setReview({...review, comment: e.target.value})}
                        required
                      />
                    </Form.Group>

                    <Button type="submit" variant="primary">
                      Submit Review
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            )}

            {/* Display Reviews */}
            {book.reviews && book.reviews.length > 0 ? (
              book.reviews.map((review, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        {renderRating(review.rating)}
                        <span className="ms-2 fw-bold">{review.user?.name || 'Anonymous'}</span>
                      </div>
                      <small className="text-muted">
                        {new Date(review.date).toLocaleDateString()}
                      </small>
                    </div>
                    <p className="mt-2 mb-0">{review.comment}</p>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>No reviews yet. Be the first to review this book!</p>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BookDetailsPage;