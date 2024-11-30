import React, { useState } from 'react';
import { Menu, Container, Button, Icon, Modal, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import '../css/Styles.css'; // Certifique-se de que o caminho está correto
import Footer from './Footer';
import LoginForm from '../components/LoginForm';
import logo from '../images/Logo-removebg.png'; // Importando a logo

function Header({ isLoggedIn, handleLogout, onLogin, userInfo, children }) {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleLoginModalOpen = () => setLoginModalOpen(true);
  const handleLoginModalClose = () => setLoginModalOpen(false);

  return (
    <>
      <div className="menu-header">
        <Menu size="large" borderless>
          <Container>
            <Menu.Item as={Link} to="/" header className="lobster-font" style={{ fontSize: "2.2rem", display: 'flex', alignItems: 'center' }}>
              <Image src={logo} alt="Cupcake Dream Logo" size='tiny'/>
              Cupcake Dream
            </Menu.Item>

            <Menu.Item className='quicksand-font' as={Link} to="/Produtos">Catálogo</Menu.Item>
            <Menu.Item className='quicksand-font' as={Link} to="/Favoritos">Favoritos</Menu.Item>
            <Menu.Item className='quicksand-font' as={Link} to="/Perfil">Perfil</Menu.Item>
            <Menu.Item className='quicksand-font' as={Link} to="/Carrinho">Carrinho</Menu.Item>
            <Menu.Item className='quicksand-font' as={Link} to="/Pedidos">Pedidos</Menu.Item>

            <Menu.Menu position="right">
              {isLoggedIn ? (
                <>
                  {userInfo.role === 'Admin' && (
                    <Menu.Item as={Link} to="/Admin">
                      Admin
                    </Menu.Item>
                  )}
                  <Menu.Item>
                    Olá, {userInfo.name}
                  </Menu.Item>
                  <Menu.Item>
                    <Button onClick={handleLogout}>
                      <Icon name="log out" /> Sair
                    </Button>
                  </Menu.Item>
                </>
              ) : (
                <Menu.Item>
                  <Button onClick={handleLoginModalOpen}>
                    <Icon name="sign in" /> Entrar
                  </Button>
                </Menu.Item>
              )}
            </Menu.Menu>
          </Container>
        </Menu>
      </div>
      
      <Modal open={loginModalOpen} onClose={handleLoginModalClose}>
        <Modal.Header>Login</Modal.Header>
        <Modal.Content>
          <LoginForm onLogin={onLogin} closeModal={handleLoginModalClose} />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleLoginModalClose}>Cancelar</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default Header;
