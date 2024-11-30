import React from 'react';
import { Container, Card, Icon, Grid } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{marginTop:'4rem'}}>
      <Container style={{ marginTop: '18px' }}>
        <h1 className='quicksand-font'>Dashboard de Administrador</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.6', margin: '0 auto' }} className='quicksand-font'>
          Aqui Você administrador navega através de funções unicas, adiciona e remove produtos, monitora ordens e presta suporte a usuários.
        </p>
        <div className='ui divider' style={{ marginTop: '20px', marginBottom: '20px' }}></div>
        <div className='ui hidden divider'style={{marginBottom:'2rem'}}></div>
        
        <Grid centered>
          <Grid.Row>
            <Card.Group itemsPerRow={3} centered style={{marginBottom:'9rem'}}>
              <Card onClick={() => navigate('/Ordens')}>
                <Card.Content>
                  <Icon name='clipboard list' size='large' />
                  <div className='ui divider'></div>
                  <Card.Header>Verificar Ordens</Card.Header>
                  <Card.Description>
                    Veja e gerencie todas as ordens de compras feitas pelos usuários.
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card onClick={() => navigate('/Catalogo')}>
                <Card.Content>
                  <Icon name='box' size='large' />
                  <div className='ui divider'></div>
                  <Card.Header>Gerenciar Produtos</Card.Header>
                  <Card.Description>
                    Adicione, edite ou remova produtos disponíveis na loja.
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card onClick={() => navigate('/Gerenciamento')}>
                <Card.Content>
                  <Icon name='users' size='large' />
                  <div className='ui divider'></div>
                  <Card.Header>Gerenciar Usuários</Card.Header>
                  <Card.Description>
                    Veja e edite informações dos usuários e gerencie suas permissões.
                  </Card.Description>
                </Card.Content>
              </Card>
            </Card.Group>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
