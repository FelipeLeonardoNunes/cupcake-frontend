import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Image, Table, Button, Segment, Icon, Modal, Form, Dropdown } from 'semantic-ui-react';
import emptyCart from '../images/empty-shoppingcart-removebg.png';
import muffin from '../images/sitting-muffing-removebg.png';
import { v4 as uuidv4 } from 'uuid';

const ShoppingCart = ({ userInfo }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  
  const fetchCartItems = async () => {
    if (!userInfo) return;

    try {
      const response = await axios.get(`https://localhost:44333/api/Cart/GetCartByUserId?userId=${userInfo.id}`);
      setCartItems(response.data.$values);
    } catch (err) {
      console.error('Erro ao buscar itens do carrinho:', err);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [userInfo]);

  useEffect(() => {
    const calculateTotal = () => {
      let cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      if (cartTotal < 300) {
        cartTotal += 15; // Adicionar frete de 15 reais
      }
      setTotal(cartTotal);
    };

    calculateTotal();
  }, [cartItems]);

  const handleRemoveProduct = async (item) => {
    try {
      await axios.delete('https://localhost:44333/api/Cart/RemoveProductCart', { data: item });
      setCartItems(cartItems.filter(cartItem => cartItem.id !== item.id));
      alert('Produto removido do carrinho com sucesso!');
    } catch (err) {
      console.error('Erro ao remover produto do carrinho:', err);
      alert('Erro ao remover produto do carrinho. Por favor, tente novamente.');
    }
  };

  const handleCheckout = async () => {
    const orderDTO = {
      userId: userInfo.id,
      userName: userInfo.name,
      userEmail: userInfo.email,
      orderNumber: Date.now().toString(),
      paymentMethod,
      address: userInfo.address,
      city: userInfo.city,
      region: userInfo.region,
      postalCode: userInfo.postalCode,
      total,
      orderComplete: "PENDENTE"  // Mockando o estado do pedido como PENDENTE inicialmente
    };

    const orderDetailDTOs = cartItems.map(item => ({
      userId: userInfo.id,
      orderId: uuidv4(), // Gerar um GUID válido para orderId
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price
    }));

    try {
      await axios.post('https://localhost:44333/api/Order/CreateOrder', {
        orderDTO,
        orderDetailDTOs
      });
      alert('Pedido realizado com sucesso!');
      setCartItems([]);
      setOpen(false);
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
      alert('Erro ao criar pedido. Por favor, tente novamente.');
    }
  };

  const paymentOptions = [
    { key: 'boleto', value: 'Boleto', text: 'Boleto' },
    { key: 'cartao', value: 'Cartão de Crédito', text: 'Cartão de Crédito' }
  ];

  return (
    <div>
      <div className='ui hidden divider'></div>
      <Container>
        <h1 className='quicksand-font'>Seu Carrinho de Compras</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.6', margin: '0 auto' }} className='quicksand-font'>Verifique seus itens desejados e proceda para o checkout.</p>
        <div className='ui divider'></div>

        {cartItems.length > 0 ? (
          <>
            <div className='ui hidden divider'></div>
            <Segment>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Produto</Table.HeaderCell>
                    <Table.HeaderCell>Quantidade</Table.HeaderCell>
                    <Table.HeaderCell>Preço</Table.HeaderCell>
                    <Table.HeaderCell>Total</Table.HeaderCell>
                    <Table.HeaderCell>Remover</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {cartItems.map(item => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.productName}</Table.Cell>
                      <Table.Cell>{item.quantity}</Table.Cell>
                      <Table.Cell>R${item.price.toFixed(2)}</Table.Cell>
                      <Table.Cell>R${(item.price * item.quantity).toFixed(2)}</Table.Cell>
                      <Table.Cell>
                        <Icon name='trash' color='red' style={{ cursor: 'pointer' }} onClick={() => handleRemoveProduct(item)} />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row>
                    <Table.Cell colSpan='3' textAlign='right'><strong>Total:</strong></Table.Cell>
                    <Table.Cell colSpan='2'><strong>R${total.toFixed(2)}</strong></Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Segment>
          </>
        ) : (
          <>
            <h4 className='quicksand-font'>Seu carrinho está vazio, comece a comprar!</h4>
            <Image centered size='large' src={emptyCart} />
          </>
        )}

        {cartItems.length > 0 && (
          <>
            <Button primary style={{ marginTop: '20px' }} onClick={() => setOpen(true)}>Checkout</Button>
            <Image centered size='small' src={muffin} />
          </>
        )}
      </Container>

      <Modal open={open} onClose={() => setOpen(false)} closeIcon>
        <Modal.Header>Finalizar Compra</Modal.Header>
        <Modal.Content>
          <h3 className='quicksand-font'>Revisão do Pedido</h3>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Produto</Table.HeaderCell>
                <Table.HeaderCell>Quantidade</Table.HeaderCell>
                <Table.HeaderCell>Preço Unitário</Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {cartItems.map(item => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.productName}</Table.Cell>
                  <Table.Cell>{item.quantity}</Table.Cell>
                  <Table.Cell>R${item.price.toFixed(2)}</Table.Cell>
                  <Table.Cell>R${(item.price * item.quantity).toFixed(2)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <Form>
            <Form.Field>
              <label>Forma de Pagamento</label>
              <Dropdown
                placeholder='Selecione a forma de pagamento'
                fluid
                selection
                options={paymentOptions}
                value={paymentMethod}
                onChange={(e, { value }) => setPaymentMethod(value)}
              />
            </Form.Field>
            <Form.Field>
              <label>Endereço de Entrega</label>
              <p>{userInfo.address}, {userInfo.city}, {userInfo.region}, {userInfo.postalCode}</p>
            </Form.Field>
            <Form.Field>
              <label>Total a Pagar</label>
              <p>R${total.toFixed(2)}</p>
            </Form.Field>
            <p style={{ marginTop: '10px', fontStyle: 'italic' }}>Frete padrão: R$ 15,00 (Grátis para compras acima de R$ 300,00).</p>
            <p style={{ fontStyle: 'italic' }}>Estimativa de entrega: 4 dias úteis a partir do envio.</p>
            <Button primary onClick={handleCheckout}>Confirmar Compra</Button>
          </Form>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default ShoppingCart;
