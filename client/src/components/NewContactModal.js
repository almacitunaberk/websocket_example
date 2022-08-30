import { Modal, Form, Button } from 'react-bootstrap';
import { useRef } from 'react';
import { useContacts } from '../contexts/ContactsProvider';

function NewContactModal({ closeModal }) {
  const idRef = useRef();
  const contactNameRef = useRef();
  const { createContact } = useContacts();

  const handleSubmit = (e) => {
    e.preventDefault();
    createContact(idRef.current.value, contactNameRef.current.value);
    closeModal();
  };
  return (
    <>
      <Modal.Header closeButton>Create Contact</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>User ID</Form.Label>
            <Form.Control type="text" ref={idRef} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Name of the contact</Form.Label>
            <Form.Control type="text" ref={contactNameRef} required />
          </Form.Group>
          <Button className="mt-2" type="submit">
            Create Contact
          </Button>
        </Form>
      </Modal.Body>
    </>
  );
}

export default NewContactModal;
