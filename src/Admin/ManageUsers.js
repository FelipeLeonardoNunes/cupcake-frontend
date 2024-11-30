import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Input, Grid } from 'semantic-ui-react';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    cpf: '',
    postalCode: '',
    role: '',
    password: '',
    status: true
  });
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://localhost:44333/api/User/GetAll');
      setUsers(response.data.$values || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleEditOpen = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      region: user.region,
      cpf: user.cpf,
      postalCode: user.postalCode,
      role: user.role,
      password: '',
      status: user.status // Mantendo o status original
    });
    setPasswordConfirmation('');
    setEditModalOpen(true);
  };

  const handleEditClose = () => setEditModalOpen(false);

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      setFormData((prevDetails) => ({ ...prevDetails, password: value }));
    } else {
      setPasswordConfirmation(value);
    }
  };

  const handleUpdate = async () => {
    const updatedData = { ...formData };

    if (updatedData.password && updatedData.password !== passwordConfirmation) {
      alert('As senhas não correspondem. Por favor, tente novamente.');
      return;
    }

    // Certifique-se de que o campo de senha esteja presente, caso contrário, o envie vazio
    if (!updatedData.password) {
      updatedData.password = ''; // Deixa o campo de senha vazio se não foi alterado
    }

    const requiredFields = ['name', 'phone', 'address', 'city', 'region', 'cpf', 'postalCode'];
    for (const field of requiredFields) {
      if (!updatedData[field]) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
    }

    try {
      await axios.put(`https://localhost:44333/api/User/UpdateUser?id=${selectedUser.id}`, updatedData);
      alert('Informações atualizadas com sucesso!');
      setEditModalOpen(false);
      fetchUsers(); // Atualiza a lista de usuários após a edição
    } catch (err) {
      console.error('Erro ao atualizar informações do usuário:', err);
      alert('Erro ao atualizar informações. Por favor, tente novamente.');
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const newStatus = !user.status;
      const endpoint = newStatus
        ? `https://localhost:44333/api/User/ActivateUser?id=${user.id}`
        : `https://localhost:44333/api/User/DisableUser?id=${user.id}`;

      await axios.put(endpoint);
      fetchUsers(); // Atualiza a lista de usuários após alteração de status
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
    }
  };

  return (
    <div>
      <Container style={{ marginTop: '18px' }}>
        <h1 className='quicksand-font'>Gerenciamento de Usuários</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.6', margin: '0 auto' }} className='quicksand-font'>
          Manage Usuários
        </p>
        <div className='ui divider' style={{ marginTop: '20px', marginBottom: '20px' }}></div>
        <Table celled padded>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Nome</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Ações</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map(user => (
              <Table.Row key={user.id}>
                <Table.Cell>{user.id}</Table.Cell>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.role}</Table.Cell>
                <Table.Cell>
                  <Button
                    toggle
                    active={user.status}
                    onClick={() => handleToggleStatus(user)}
                  >
                    {user.status ? 'ATIVO' : 'DESATIVADO'}
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <Button size="mini" onClick={() => handleEditOpen(user)}>Editar</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Container>

      <Modal open={editModalOpen} onClose={handleEditClose} size='small'>
        <Modal.Header>Editar Usuário</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleUpdate}>
            <Grid columns={2} doubling>
              {[
                { label: 'Nome', name: 'name' },
                { label: 'Email', name: 'email' },
                { label: 'Telefone', name: 'phone' },
                { label: 'Endereço', name: 'address' },
                { label: 'Cidade', name: 'city' },
                { label: 'Região', name: 'region' },
                { label: 'CPF', name: 'cpf' },
                { label: 'CEP', name: 'postalCode' },
                { label: 'Role', name: 'role' }
              ].map(({ label, name }) => (
                <Grid.Column key={name}>
                  <Form.Field>
                    <label>{label}</label>
                    <Input placeholder={label} name={name} value={formData[name]} onChange={handleChange} />
                  </Form.Field>
                </Grid.Column>
              ))}
              <Grid.Column>
                <Form.Field>
                  <label>Nova Senha</label>
                  <Input
                    placeholder='Deixe em branco para manter a senha atual'
                    name='password'
                    type='password'
                    value={formData.password}
                    onChange={handlePasswordChange}
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
                <Form.Field>
                  <label>Confirmar Senha</label>
                  <Input
                    placeholder='Digite a nova senha novamente'
                    name='passwordConfirmation'
                    type='password'
                    value={passwordConfirmation}
                    onChange={handlePasswordChange}
                  />
                </Form.Field>
              </Grid.Column>
            </Grid>
            <Button type='submit' primary style={{ marginTop: '20px' }}>Atualizar Usuário</Button>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleEditClose}>Fechar</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default ManageUsers;
