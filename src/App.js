import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './layout/Header';
import LandingPage from './components/LandingPage';
import Products from './pages/Products';
import Favorites from './pages/Favorites';
import ShoppingCart from './pages/ShoppingCart';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Dashboard from './Admin/Dashboard';
import OrderDetails from './Admin/OrderDetails';
import Footer from './layout/Footer'; // Adicione a importação do Footer
import './css/Styles.css';
import ManageProducts from './Admin/ManageProducts';
import ManageUsers from './Admin/ManageUsers';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  const handleLogin = (status, user) => {
    setIsLoggedIn(status);
    setUserInfo(user);
  };

  return (
    <Router>
      <div id="root">
        <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} onLogin={handleLogin} userInfo={userInfo} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage onLogin={handleLogin} isLoggedIn={isLoggedIn} />} />
            <Route path="/Produtos" element={<Products isLoggedIn={isLoggedIn} userInfo={userInfo} />} />
            <Route path="/Favoritos" element={isLoggedIn ? <Favorites userInfo={userInfo} /> : <Navigate to="/" />} />
            <Route path="/Carrinho" element={isLoggedIn ? <ShoppingCart userInfo={userInfo} /> : <Navigate to="/" />} />
            <Route path="/Perfil" element={isLoggedIn ? <Profile userInfo={userInfo} /> : <Navigate to="/" />} />
            <Route path="/Pedidos" element={isLoggedIn ? <Orders userInfo={userInfo} /> : <Navigate to="/" />} />
            <Route path="/Admin" element={isLoggedIn ? <Dashboard userInfo={userInfo} /> : <Navigate to="/" />} />
            <Route path="/Ordens" element={isLoggedIn ? <OrderDetails userInfo={userInfo} /> : <Navigate to="/" />} />
            <Route path="/Catalogo" element={isLoggedIn ? <ManageProducts userInfo={userInfo} /> : <Navigate to="/" />} />
            <Route path="/Gerenciamento" element={isLoggedIn ? <ManageUsers userInfo={userInfo} /> : <Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
