import React from 'react';
import { Container, Row, Col, Table, Image, Button, Form, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Helmet>
          <title>Shopping Cart - BookStore</title>
        </Helmet>
        
        <FaShoppingBag size={80} className="text-muted mb-4" />
        <h2 className="mb-3">Your Cart is Empty</h2>
        <p className="text-muted mb-4">Looks like you haven't added any books to your cart yet.</p>
        <Button as={Link} to="/books" variant="primary" size="lg">
          <FaArrowLeft className="me-2" />
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart ({getCartCount()} items) - BookStore</title>
      </Helmet>

      <Container className="py-4">
        <h1 className="mb-4">Shopping Cart ({getCartCount()} items)</h1>

        <Row>
          <Col lg={8}>
            <Table responsive className="align-middle">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <Image 
                          src={item.coverImage} 
                          alt={item.title}
                          style={{ width: '60px', height: '80px', objectFit: 'cover' }}
                          className="me-3"
                        />
                        <div>
                          <Link to={`/books/${item._id}`} className="text-decoration-none">
                            <h6 className="mb-1">{item.title}</h6>
                          </Link>
                          <small className="text-muted">{item.author}</small>
                        </div>
                      </div>
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td style={{ width: '120px' }}>
                      <Form.Control
                        type="number"
                        min="1"
                        max={item.stockQuantity}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                      />
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <Button 
                        variant="link" 
                        className="text-danger"
                        onClick={() => removeFromCart(item._id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>

          <Col lg={4}>
            <Card>
              <Card.Body>
                <h5 className="mb-3">Order Summary</h5>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal ({getCartCount()} items)</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total</strong>
                  <strong className="text-primary">${getCartTotal().toFixed(2)}</strong>
                </div>

                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-100 mb-2"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>

                <Button 
                  as={Link} 
                  to="/books" 
                  variant="outline-secondary" 
                  className="w-100"
                >
                  Continue Shopping
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CartPage;