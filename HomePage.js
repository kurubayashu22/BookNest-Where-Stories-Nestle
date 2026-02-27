import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Carousel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import BookCard from '../components/BookCard';

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, newRes, genresRes] = await Promise.all([
          axios.get('/api/books/featured'),
          axios.get('/api/books?sortBy=createdAt:desc&limit=8'),
          axios.get('/api/books/genres')
        ]);
        
        setFeaturedBooks(featuredRes.data);
        setNewReleases(newRes.data.books);
        setGenres(genresRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Discover Your Next Favorite Book',
      subtitle: 'Thousands of books across all genres waiting for you'
    },
    {
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Read Anywhere, Anytime',
      subtitle: 'Your personal library at your fingertips'
    }
  ];

  return (
    <>
      <Helmet>
        <title>BookStore - Your Online Book Store</title>
        <meta name="description" content="Discover thousands of books across all genres at BookStore. Find your next favorite read today!" />
      </Helmet>

      {/* Hero Carousel */}
      <Carousel fade className="mb-5">
        {heroSlides.map((slide, index) => (
          <Carousel.Item key={index}>
            <div
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '500px'
              }}
            >
              <Container className="h-100 d-flex align-items-center justify-content-center text-center text-white">
                <div>
                  <h1 className="display-3 fw-bold mb-4">{slide.title}</h1>
                  <p className="lead mb-4">{slide.subtitle}</p>
                  <Button as={Link} to="/books" variant="primary" size="lg">
                    Browse Books <FaArrowRight className="ms-2" />
                  </Button>
                </div>
              </Container>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <Container>
        {/* Featured Books */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Featured Books</h2>
            <Link to="/books?featured=true" className="text-decoration-none">
              View All <FaArrowRight />
            </Link>
          </div>
          
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {featuredBooks.map(book => (
                <Col key={book._id}>
                  <BookCard book={book} />
                </Col>
              ))}
            </Row>
          )}
        </section>

        {/* Categories */}
        <section className="mb-5">
          <h2 className="mb-4">Browse by Category</h2>
          <Row xs={2} sm={3} md={4} lg={6} className="g-3">
            {genres.slice(0, 12).map(genre => (
              <Col key={genre}>
                <Link 
                  to={`/books?genre=${encodeURIComponent(genre)}`}
                  className="text-decoration-none"
                >
                  <div className="category-card p-3 text-center bg-light rounded hover-effect">
                    <h6 className="mb-0">{genre}</h6>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </section>

        {/* New Releases */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>New Releases</h2>
            <Link to="/books?sortBy=createdAt:desc" className="text-decoration-none">
              View All <FaArrowRight />
            </Link>
          </div>
          
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {newReleases.map(book => (
                <Col key={book._id}>
                  <BookCard book={book} />
                </Col>
              ))}
            </Row>
          )}
        </section>

        {/* Newsletter */}
        <section className="bg-light p-5 rounded mb-5">
          <Row className="align-items-center">
            <Col md={6}>
              <h3>Subscribe to Our Newsletter</h3>
              <p className="mb-md-0">Get the latest book releases and exclusive offers directly in your inbox.</p>
            </Col>
            <Col md={6}>
              <div className="d-flex gap-2">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Enter your email"
                />
                <Button variant="primary">Subscribe</Button>
              </div>
            </Col>
          </Row>
        </section>
      </Container>

      <style jsx>{`
        .hover-effect {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-effect:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .category-card {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .category-card:hover {
          background-color: #007bff !important;
          color: white;
        }
      `}</style>
    </>
  );
};

export default HomePage;