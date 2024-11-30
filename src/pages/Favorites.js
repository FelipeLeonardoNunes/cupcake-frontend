import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Image, Button, Modal, Input, Icon } from 'semantic-ui-react';
import FavoritesNoBg from '../images/Favorites-no-bg.png';
import '../css/Styles.css'; // Certifique-se de que o caminho está correto

const Favorites = ({ userInfo }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchFavoritos = async () => {
      if (!userInfo) return;

      try {
        const response = await axios.get(`https://localhost:44333/api/Favorite/GetFavoriteByUserId?userId=${userInfo.id}`);
        setFavoritos(response.data.$values);
      } catch (err) {
        console.error('Erro ao buscar favoritos:', err);
      }
    };

    fetchFavoritos();
  }, [userInfo]);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get('https://localhost:44333/api/Product/GetAll');
        const allProducts = response.data.$values;
        const favoriteProducts = allProducts.filter(product => 
          favoritos.some(favorite => favorite.productId === product.id && product.status)
        );
        setProdutos(favoriteProducts);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
      }
    };

    if (favoritos.length > 0) {
      fetchProdutos();
    }
  }, [favoritos]);

  const handleAddToCartClick = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (!userInfo) {
      alert('Você precisa estar logado para adicionar produtos ao carrinho.');
      return;
    }

    if (quantity < 1) {
      alert('Por favor, insira uma quantidade válida.');
      return;
    }

    const payload = {
      userId: userInfo.id,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      price: selectedProduct.price,
      quantity: quantity
    };

    try {
      await axios.post('https://localhost:44333/api/Cart/AddProductCart', payload);
      alert('Produto adicionado ao carrinho com sucesso!');
      handleClose();
    } catch (err) {
      console.error('Erro ao adicionar produto ao carrinho:', err);
      alert('Erro ao adicionar produto ao carrinho. Por favor, tente novamente.');
    }
  };

  const toggleFavorite = async (productId) => {
    if (!userInfo) {
      alert('Você precisa estar logado para favoritar produtos.');
      return;
    }

    const isFavorite = favoritos.some(favorite => favorite.productId === productId);
    const url = isFavorite
      ? 'https://localhost:44333/api/Favorite/DeleteFavorite'
      : 'https://localhost:44333/api/Favorite/CreateFavorite';

    try {
      const payload = { userId: userInfo.id, productId };
      if (isFavorite) {
        await axios.delete(url, { data: payload });
        setFavoritos(favoritos.filter(favorite => favorite.productId !== productId));
      } else {
        await axios.post(url, payload);
        setFavoritos([...favoritos, { productId }]);
      }
    } catch (err) {
      console.error(`Erro ao ${isFavorite ? 'remover' : 'adicionar'} favorito:`, err);
    }
  };

  return (
    <Container style={{ marginTop: '18px' }}>
      <h1 className='quicksand-font'>Favoritos</h1>
      <p style={{ fontSize: '1.2rem', lineHeight: '1.6', margin: '0 auto' }} className='quicksand-font'>
        Seus favoritos aparecem aqui e permitem a navegação e compra de produtos escolhidos mais rapidamente!
      </p>
      <div className='ui divider' style={{ marginTop: '20px', marginBottom: '20px' }}></div>
      <div className='ui hidden divider'></div>

      {produtos.length > 0 ? (
        <Card.Group itemsPerRow={3}>
          {produtos.map(produto => (
            <Card key={produto.id} className="product-card">
              <Image src={produto.image} wrapped ui={false} />
              <Card.Content>
                <Card.Header>
                  {produto.name}
                  <Icon
                    name={favoritos.some(favorite => favorite.productId === produto.id) ? 'heart' : 'heart outline'}
                    color={favoritos.some(favorite => favorite.productId === produto.id) ? 'red' : 'grey'}
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que o clique no ícone abra o modal
                      toggleFavorite(produto.id);
                    }}
                    style={{ marginLeft: '10px', cursor: 'pointer' }}
                  />
                </Card.Header>
                <Card.Meta>
                  <span className='price'>R${produto.price.toFixed(2)}</span>
                </Card.Meta>
                <Card.Description>{produto.description}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <a>Mais informações: {produto.information}</a>
                <Button primary onClick={() => handleAddToCartClick(produto)} style={{ marginTop: '10px' }}>Adicionar ao Carrinho</Button>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      ) : (
        <Image centered size='large' src={FavoritesNoBg} />
      )}

      {selectedProduct && (
        <Modal open={open} onClose={handleClose}>
          <Modal.Header><h1 className='quicksand-font'>Adicionar ao Carrinho</h1></Modal.Header>
          <Modal.Content>
            <h3>{selectedProduct.name}</h3>
            <p><strong>Preço:</strong> R${selectedProduct.price.toFixed(2)}</p>
            <h4>Quantidade:</h4>
            <Input 
              type='number' 
              value={quantity} 
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} 
              min='1' 
            />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button primary onClick={handleAddToCart}>OK</Button>
          </Modal.Actions>
        </Modal>
      )}
    </Container>
  );
};

export default Favorites;
