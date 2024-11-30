import React, { useState, useEffect } from 'react';
import { Container, Card, Icon, Modal, Button, Form, Input, Table } from 'semantic-ui-react';
import axios from 'axios';

const ManageProducts = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    information: '',
    price: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://localhost:44333/api/Product/GetAll');
      setProducts(response.data.$values);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => {
    setModalOpen(false);
    setFormData({
      name: '',
      description: '',
      image: '',
      information: '',
      price: 0
    });
  };

  const handleEditOpen = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      image: product.image,
      information: product.information,
      price: product.price
    });
    setEditModalOpen(true);
  };

  const handleEditClose = () => setEditModalOpen(false);

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('https://localhost:44333/api/Product/CreateProduct', formData);
      alert('Produto criado com sucesso!');
      handleClose();
      fetchProducts(); // Atualiza a lista de produtos após criação
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      alert('Erro ao criar produto. Tente novamente.');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://localhost:44333/api/Product/UpdateProduct?id=${selectedProduct.id}`, formData);
      alert('Produto atualizado com sucesso!');
      handleEditClose();
      fetchProducts(); // Atualiza a lista de produtos após atualização
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto. Tente novamente.');
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      if (product.status) {
        await axios.put(`https://localhost:44333/api/Product/DisableProduct?id=${product.id}`);
      } else {
        await axios.put(`https://localhost:44333/api/Product/ActivateProduct?id=${product.id}`);
      }
      fetchProducts(); // Atualiza a lista de produtos após alteração de status
    } catch (error) {
      console.error('Erro ao alterar status do produto:', error);
      alert('Erro ao alterar status do produto. Tente novamente.');
    }
  };

  return (
    <div>
      <Container style={{ marginTop: '18px' }}>
        <h1 className='quicksand-font'>Gerenciamento de Produtos</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.6', margin: '0 auto' }} className='quicksand-font'>
          Adicione, retire e Edite as informações dos produtos da Loja, organize e atualize o catálogo.
        </p>
        <div className='ui divider' style={{ marginTop: '20px', marginBottom: '20px' }}></div>
        <div className='ui hidden divider'></div>
        
        <Card.Group itemsPerRow={2} centered>
          <Card onClick={handleOpen}>
            <Card.Content>
              <Icon name='add' size='large' />
              <div className='ui divider'></div>
              <Card.Header>Criação de Novos Produtos</Card.Header>
              <Card.Description>
                Clique para adicionar um novo produto ao catálogo.
              </Card.Description>
            </Card.Content>
          </Card>
        </Card.Group>

        <Table celled padded>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Nome</Table.HeaderCell>
              <Table.HeaderCell>Descrição</Table.HeaderCell>
              <Table.HeaderCell>Preço</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Ações</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {products.map(product => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>{product.description}</Table.Cell>
                <Table.Cell>R$ {product.price}</Table.Cell>
                <Table.Cell>
                  <Button 
                    toggle 
                    active={product.status} 
                    onClick={() => handleToggleStatus(product)}
                  >
                    {product.status ? 'Ativo' : 'Desativado'}
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <Button size="mini" onClick={() => handleEditOpen(product)}>Editar</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Container>

      <Modal open={modalOpen} onClose={handleClose} size='small'>
        <Modal.Header>Criação de Novo Produto</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <label>Nome</label>
              <Input placeholder='Nome' name='name' value={formData.name} onChange={handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Descrição</label>
              <Input placeholder='Descrição' name='description' value={formData.description} onChange={handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Imagem</label>
              <Input placeholder='URL da Imagem' name='image' value={formData.image} onChange={handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Informações</label>
              <Input placeholder='Informações' name='information' value={formData.information} onChange={handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Preço</label>
              <Input placeholder='Preço' name='price' type='number' value={formData.price} onChange={handleChange} />
            </Form.Field>
            <Button type='submit' primary>Criar Produto</Button>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleClose}>Fechar</Button>
        </Modal.Actions>
      </Modal>

      <Modal open={editModalOpen} onClose={handleEditClose} size='small'>
        <Modal.Header>Editar Produto</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleUpdate}>
            <Form.Field>
              <label>Nome</label>
              <Input placeholder='Nome' name='name' value={formData.name} onChange={handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Descrição</label>
              <Input placeholder='Descrição' name='description' value={formData.description} onChange={handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Imagem</label>
              <Input placeholder='URL da Imagem' name='image' value={formData.image} onChange={handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Informações</label>
              <Input placeholder='Informações' name='information' value={formData.information} onChange={handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Preço</label>
              <Input placeholder='Preço' name='price' type='number' value={formData.price} onChange={handleChange} />
            </Form.Field>
            <Button type='submit' primary>Atualizar Produto</Button>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleEditClose}>Fechar</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default ManageProducts;
