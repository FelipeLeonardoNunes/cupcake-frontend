import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Image, Modal, Button, Input, Icon, Segment } from 'semantic-ui-react';
import '../css/Styles.css';

const Products = ({ isLoggedIn, userInfo }) => {
  const [produtos, setProdutos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get('https://localhost:44333/api/Product/GetAll');
        setProdutos(response.data.$values.filter(produto => produto.status));
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
      }
    };

    fetchProdutos();
  }, []);

  useEffect(() => {
    if (isLoggedIn && userInfo) {
      const fetchFavorites = async () => {
        try {
          const response = await axios.get(`https://localhost:44333/api/Favorite/GetFavoriteByUserId?userId=${userInfo.id}`);
          const favoriteProductIds = response.data.$values.map(fav => fav.productId);
          setFavorites(favoriteProductIds);
        } catch (err) {
          console.error('Erro ao buscar favoritos:', err);
        }
      };

      fetchFavorites();
    }
  }, [isLoggedIn, userInfo]);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const toggleFavorite = async (productId) => {
    if (!isLoggedIn || !userInfo) {
      alert('Você precisa estar logado para favoritar produtos.');
      return;
    }

    const isFavorite = favorites.includes(productId);
    const url = isFavorite
      ? 'https://localhost:44333/api/Favorite/DeleteFavorite'
      : 'https://localhost:44333/api/Favorite/CreateFavorite';

    try {
      const payload = { userId: userInfo.id, productId };
      if (isFavorite) {
        await axios.delete(url, { data: payload });
        setFavorites(favorites.filter(id => id !== productId));
      } else {
        await axios.post(url, payload);
        setFavorites([...favorites, productId]);
      }
    } catch (err) {
      console.error(`Erro ao ${isFavorite ? 'remover' : 'adicionar'} favorito:`, err);
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn || !userInfo) {
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

  return (
    <Container style={{ marginTop: '18px' }}>
      <h1 className='quicksand-font'>Nossos Produtos</h1>
      <p style={{ fontSize: '1.2rem', lineHeight: '1.6', margin: '0 auto' }} className='quicksand-font'>
        Descubra os incríveis sabores que preparamos para você! Clique no Cupcake para encomendar ou saber mais.
      </p>
      <div className='ui divider' style={{ marginTop: '20px', marginBottom: '20px' }}></div>
      <Segment>
        <Card.Group itemsPerRow={3}>
          {produtos.map(produto => (
            <Card key={produto.id} className="product-card" onClick={() => handleCardClick(produto)}>
              <Image src={produto.image} wrapped ui={false} />
              <Card.Content>
                <Card.Header>
                  {produto.name}
                  <Icon
                    name={favorites.includes(produto.id) ? 'heart' : 'heart outline'}
                    color={favorites.includes(produto.id) ? 'red' : 'grey'}
                    onClick={(e) => {
                      e.stopPropagation();
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
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </Segment>

      {selectedProduct && (
        <Modal open={open} onClose={handleClose}>
          <Modal.Header><h1 className='quicksand-font'>Detalhes do produto</h1></Modal.Header>
          <Modal.Content image>
            <Image size='medium' src={selectedProduct.image} wrapped />
            <Modal.Description>
              <h3>Informações -</h3>
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              <p><strong>Preço:</strong> R${selectedProduct.price.toFixed(2)}</p>
              <h4>Quantidade:</h4>
              <Input 
                type='number' 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} 
                min='1' 
              />
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button primary onClick={handleAddToCart}>Adicionar ao carrinho</Button>
          </Modal.Actions>
        </Modal>
      )}
    </Container>
  );
};

export default Products;
