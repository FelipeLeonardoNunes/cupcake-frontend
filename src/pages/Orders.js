import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Segment, Image } from 'semantic-ui-react';
import happy from '../images/happy-cupcake-removebg.png'
import noOrder from '../images/no-orders-removebg.png'

const Orders = ({ userInfo }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo) return;

      try {
        const response = await axios.get(`https://localhost:44333/api/Order/GetOrdersByUserId?userId=${userInfo.id}`);
        setOrders(response.data.$values);
      } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
      }
    };

    fetchOrders();
  }, [userInfo]);

  return (
    <div style={{marginTop:'30px'}  }>
      <Container style={{ marginTop: '18px' }}>
        <h1 className='quicksand-font'>Seus Pedidos</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.6', margin: '0 auto' }} className='quicksand-font'>
          Acompanhe seus pedidos e o atual status em que se encontram, você pode visualizar pedidos ativos e o seu historico de pedidos.
        </p>
        <div className='ui divider' style={{ marginTop: '20px', marginBottom: '20px' }}></div>
        <div className='ui hidden divider'></div>

        {orders.length > 0 ? (
            <>
          <Segment>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Número do Pedido</Table.HeaderCell>
                  <Table.HeaderCell>Data</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Método de Pagamento</Table.HeaderCell>
                  <Table.HeaderCell>Total</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {orders.map(order => (
                  <Table.Row key={order.id}>
                    <Table.Cell>{order.orderNumber}</Table.Cell>
                    <Table.Cell>{new Date(order.created).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>{order.orderStatus}</Table.Cell>
                    <Table.Cell>{order.paymentMethod}</Table.Cell>
                    <Table.Cell>R${order.total.toFixed(2)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Segment>
          <Image style={{height:"200px", marginTop:"30px"}} centered src={happy} />
          </>
        ) : (
            <>
          <h4 className='quicksand-font'>Você ainda não tem pedidos. Faça uma compra e acompanhe o status aqui!</h4>
          <Image size='large' centered src={noOrder} />
          </>
        )}
      </Container>
    </div>
  );
};

export default Orders;
