import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (book, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === book._id);
      
      if (existingItem) {
        if (existingItem.quantity + quantity > book.stockQuantity) {
          toast.error(`Only ${book.stockQuantity} copies available`);
          return prevItems;
        }
        toast.success('Cart updated successfully');
        return prevItems.map(item =>
          item._id === book._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        if (quantity > book.stockQuantity) {
          toast.error(`Only ${book.stockQuantity} copies available`);
          return prevItems;
        }
        toast.success('Book added to cart');
        return [...prevItems, { ...book, quantity }];
      }
    });
  };

  const removeFromCart = (bookId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== bookId));
    toast.info('Book removed from cart');
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity < 1) {
      removeFromCart(bookId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
  