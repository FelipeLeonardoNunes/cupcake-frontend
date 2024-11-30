import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Segment } from 'semantic-ui-react';
import axios from 'axios';

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Função para buscar todas as ordens
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://localhost:44333/api/Order/GetAll');
        setOrders(response.data.$values);
      } catch (error) {
        console.error('Erro ao buscar ordens:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleOpenModal = async (orderId) => {
    setModalOpen(true);
    setSelectedOrder(orderId);
    try {
      const response = await axios.get(`https://localhost:44333/api/Order/GetOrdersDetails?orderId=${orderId}`);
      setOrderDetails(response.data.$values);
    } catch (error) {
      console.error('Erro ao buscar detalhes da ordem:', error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setOrderDetails([]);
    setSelectedOrder(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <Container style={{ marginTop: '18px' }}>
        <h1 className='quicksand-font'>Ordens e Detalhes</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.6', margin: '0 auto' }} className='quicksand-font'>
          Rastreie as ordens ativas e já concluídas, mantenha controle sobre o histórico de ordens e dados.
        </p>
        <div className='ui divider' style={{ marginTop: '20px', marginBottom: '20px' }}></div>
        <div className='ui hidden divider'></div>
        </Container>
        <Segment>
        <Table celled padded>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Pedido Por</Table.HeaderCell>
              <Table.HeaderCell>Pagamento</Table.HeaderCell>
              <Table.HeaderCell>Endereço</Table.HeaderCell>
              <Table.HeaderCell>Cidade</Table.HeaderCell>
              <Table.HeaderCell>Estado</Table.HeaderCell>
              <Table.HeaderCell>Total</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Criado</Table.HeaderCell>
              <Table.HeaderCell>Última Atualização</Table.HeaderCell>
              <Table.HeaderCell>Ações</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {orders.map(order => (
              <Table.Row key={order.id}>
                <Table.Cell>{order.userName}</Table.Cell>
                <Table.Cell>{order.paymentMethod}</Table.Cell>
                <Table.Cell>{order.address}</Table.Cell>
                <Table.Cell>{order.city}</Table.Cell>
                <Table.Cell>{order.region}</Table.Cell>
                <Table.Cell>R$ {order.total}</Table.Cell>
                <Table.Cell>{order.orderStatus}</Table.Cell>
                <Table.Cell>{formatDate(order.created)}</Table.Cell>
                <Table.Cell>{formatDate(order.lastUpdated)}</Table.Cell>
                <Table.Cell textAlign="center">
                  <Button size="mini" onClick={() => handleOpenModal(order.id)}>Detalhes</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        </Segment>

        <Modal open={modalOpen} onClose={handleCloseModal} size="small">
          <Modal.Header>Detalhes do Pedido</Modal.Header>
          <Modal.Content>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Produto</Table.HeaderCell>
                  <Table.HeaderCell>Quantidade</Table.HeaderCell>
                  <Table.HeaderCell>Preço</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {orderDetails.map(detail => (
                  <Table.Row key={detail.id}>
                    <Table.Cell>{detail.productName}</Table.Cell>
                    <Table.Cell>{detail.quantity}</Table.Cell>
                    <Table.Cell>{detail.price}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleCloseModal}>Fechar</Button>
          </Modal.Actions>
        </Modal>
    </div>
  );
};

export default OrderDetails;
