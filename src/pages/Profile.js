import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Grid, Segment } from 'semantic-ui-react';
import InputMask from 'react-input-mask';

const Profile = ({ userInfo }) => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    cpf: '',
    postalCode: '',
    role: '',
    password: ''
  });
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userInfo) return;

      try {
        const response = await axios.get(`https://localhost:44333/api/User/GetUserById?id=${userInfo.id}`);
        setUserDetails(response.data);
      } catch (err) {
        console.error('Erro ao buscar detalhes do usuário:', err);
      }
    };

    fetchUserDetails();
  }, [userInfo]);

  const handleChange = (e, { name: fieldName, value }) => {
    setUserDetails((prevDetails) => ({ ...prevDetails, [fieldName]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      setUserDetails((prevDetails) => ({ ...prevDetails, password: value }));
    } else {
      setPasswordConfirmation(value);
    }
  };

  const handleUpdate = async () => {
    const updatedDetails = { ...userDetails };

    if (userDetails.password && userDetails.password !== passwordConfirmation) {
      alert('As senhas não correspondem. Por favor, tente novamente.');
      return;
    }

    const requiredFields = ['name', 'phone', 'address', 'city', 'region', 'cpf', 'postalCode'];
    for (const field of requiredFields) {
      if (!updatedDetails[field]) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
    }

    // Certifique-se de que o campo de senha esteja presente
    if (!updatedDetails.password) {
      updatedDetails.password = '';
    }

    try {
      await axios.put(`https://localhost:44333/api/User/UpdateUser?id=${userInfo.id}`, updatedDetails);
      alert('Informações atualizadas com sucesso!');
      setIsEditing(false);
    } catch (err) {
      console.error('Erro ao atualizar informações do usuário:', err);
      alert('Erro ao atualizar informações. Por favor, tente novamente.');
    }
  };

  return (
    <Container>
      <h1 className='quicksand-font'>Perfil</h1>
      <p>Atualize seu endereço e informações pessoais abaixo:</p>
      <div className='ui divider' style={{ marginTop: '20px', marginBottom: '20px' }}></div>

      <Segment>
        <Form>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Form.Input
                  label='Nome'
                  name='name'
                  value={userDetails.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Input
                  label='Email'
                  name='email'
                  value={userDetails.email}
                  readOnly
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={2}>
              <Grid.Column>
                <Form.Field required>
                  <label>Telefone</label>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={userDetails.phone}
                    onChange={(e) => handleChange(e, { name: 'phone', value: e.target.value })}
                    disabled={!isEditing}
                  >
                    {(inputProps) => <Form.Input {...inputProps} />}
                  </InputMask>
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
                <Form.Input
                  label='Endereço / Rua & Número'
                  name='address'
                  value={userDetails.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={3}>
              <Grid.Column>
                <Form.Input
                  label='Cidade'
                  name='city'
                  value={userDetails.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Input
                  label='Estado'
                  name='region'
                  value={userDetails.region}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder='Digite as iniciais do estado (ex: PR, SP, SC)'
                  required
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Field required>
                  <label>CEP</label>
                  <InputMask
                    mask="99999-999"
                    value={userDetails.postalCode}
                    onChange={(e) => handleChange(e, { name: 'postalCode', value: e.target.value })}
                    disabled={!isEditing}
                  >
                    {(inputProps) => <Form.Input {...inputProps} />}
                  </InputMask>
                </Form.Field>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={2}>
              <Grid.Column>
                <Form.Field required>
                  <label>CPF    </label>
                  <InputMask
                    mask="999.999.999-99"
                    value={userDetails.cpf}
                    onChange={(e) => handleChange(e, { name: 'cpf', value: e.target.value })}
                    disabled={!isEditing}
                  >
                    {(inputProps) => <Form.Input {...inputProps} />}
                  </InputMask>
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
                <Form.Input
                  label='Role'
                  name='role'
                  value={userDetails.role}
                  readOnly
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={2}>
              <Grid.Column>
                <Form.Input
                  label='Nova Senha'
                  type='password'
                  name='password'
                  value={userDetails.password}
                  onChange={handlePasswordChange}
                  disabled={!isEditing}
                  placeholder='Deixe em branco para manter a senha atual'
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Input
                  label='Confirmar Nova Senha'
                  type='password'
                  name='passwordConfirmation'
                  value={passwordConfirmation}
                  onChange={handlePasswordChange}
                  disabled={!isEditing}
                  placeholder='Digite novamente a nova senha'
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <div style={{ marginTop: '20px' }}>
            {isEditing ? (
              <>
                <Button primary onClick={handleUpdate} style={{ marginRight: '10px' }}>
                  Salvar
                </Button>
                <Button onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button primary onClick={() => setIsEditing(true)}>
                Editar
              </Button>
            )}
          </div>
        </Form>
      </Segment>
    </Container>
  );
};

export default Profile;
