import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Pagination, Spinner } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import BookCard from '../components/BookCard';

const BooksPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    genre: searchParams.get('genre') || '',
    author: '',
    minPrice: '',
    maxPrice: '',
    sortBy: searchParams.get('sortBy') || 'createdAt:desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0
  });

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [searchParams]);

  const fetchGenres = async () => {
    try {
      const { data } = await axios.get('/api/books/genres');
      setGenres(data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      const { data } = await axios.get(`/api/books?${params.toString()}`);
      setBooks(data.books);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalBooks: data.totalBooks
      });
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      genre: '',
      author: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt:desc'
    });
    setSearchParams({});
  };

  return (
    <>
      <Helmet>
        <title>Browse Books - BookStore</title>
        <meta name="description" content="Browse our extensive collection of books. Find books by genre, author, price, and more." />
      </Helmet>

      <Container className="py-4">
        <h1 className="mb-4">Browse Books</h1>
        
        <Row>
          {/* Filters Sidebar */}
          <Col md={3}>
            <div className="bg-light p-3 rounded">
              <h5 className="mb-3">Filters</h5>
              
              <Form onSubmit={handleSearch}>
                <Form.Group className="mb-3">
                  <Form.Label>Genre</Form.Label>
                  <Form.Select
                    name="genre"
                    value={filters.genre}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Genres</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    name="author"
                    value={filters.author}
                    onChange={handleFilterChange}
                    placeholder="Search by author"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Price Range</Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        placeholder="Min"
                        min="0"
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        placeholder="Max"
                        min="0"
                      />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Sort By</Form.Label>
                  <Form.Select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                  >
                    <option value="createdAt:desc">Newest First</option>
                    <option value="price:asc">Price: Low to High</option>
                    <option value="price:desc">Price: High to Low</option>
                    <option value="title:asc">Title: A to Z</option>
                    <option value="rating:desc">Highest Rated</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button type="submit" variant="primary">
                    Apply Filters
                  </Button>
                  <Button variant="outline-secondary" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              </Form>
            </div>
          </Col>

          {/* Books Grid */}
          <Col md={9}>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-5">
                <h4>No books found</h4>
                <p>Try adjusting your filters or search criteria.</p>
                <Button variant="primary" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <p>Showing {books.length} of {pagination.totalBooks} books</p>
                </div>

                <Row xs={1} sm={2} lg={3} className="g-4">
                  {books.map(book => (
                    <Col key={book._id}>
                      <BookCard book={book} />
                    </Col>
                  ))}
                </Row>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                      <Pagination.Prev
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                      />
                      
                      {[...Array(pagination.totalPages).keys()].map(num => (
                        <Pagination.Item
                          key={num + 1}
                          active={num + 1 === pagination.currentPage}
                          onClick={() => handlePageChange(num + 1)}
                        >
                          {num + 1}
                        </Pagination.Item>
                      ))}
                      
                      <Pagination.Next
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                      />
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BooksPage;