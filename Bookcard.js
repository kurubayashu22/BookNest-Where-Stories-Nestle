import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();

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

  return (
    <Card className="h-100 shadow-sm hover-effect">
      <Link to={`/books/${book._id}`}>
        <Card.Img 
          variant="top" 
          src={book.coverImage} 
          alt={book.title}
          style={{ height: '200px', objectFit: 'cover' }}
        />
      </Link>
      
      <Card.Body className="d-flex flex-column">
        <Link to={`/books/${book._id}`} className="text-decoration-none text-dark">
          <Card.Title className="h6">{book.title}</Card.Title>
        </Link>
        
        <Card.Subtitle className="mb-2 text-muted small">
          by {book.author}
        </Card.Subtitle>
        
        <div className="mb-2">
          {renderRating(book.rating)}
          <span className="ms-1 small text-muted">({book.rating?.toFixed(1) || '0.0'})</span>
        </div>
        
        <Card.Text className="text-primary fw-bold mb-3">
          ${book.price.toFixed(2)}
        </Card.Text>
        
        <Button
          variant="primary"
          size="sm"
          className="mt-auto"
          onClick={() => addToCart(book, 1)}
          disabled={book.stockQuantity === 0}
        >
          {book.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default BookCard;