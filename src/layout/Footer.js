import React, { useState } from "react";
import { Menu, Button, Modal } from "semantic-ui-react";
import "../css/Styles.css";

const Footer = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Menu className="footer">
      <Menu.Menu>
        <Menu.Item>
          <h3 className="lobster-font">Cupcake Dream</h3>
        </Menu.Item>
        <Menu.Item position="right">
          <Button onClick={handleOpen} basic style={{ backgroundColor:'white', borderRadius:'5PX'}}>
            Contato
          </Button>
          <Modal open={open} onClose={handleClose} size="small">
            <Modal.Header>Suporte</Modal.Header>
            <Modal.Content>
              <p>
                Se precisar de suporte, prestar reclamações, ou dúvidas, entre em contato diretamente com o email 
                <a href="mailto:Admin@teste.com.br"> Admin@teste.com.br</a>, ou mande uma mensagem para o WhatsApp no número 
                <strong> (41) 00000-0000</strong>.
              </p>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={handleClose}>Fechar</Button>
            </Modal.Actions>
          </Modal>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default Footer;
