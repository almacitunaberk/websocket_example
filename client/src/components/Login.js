import { Container, Form, Button } from 'react-bootstrap';
import { useRef } from 'react';
import { v4 as uuidV4 } from 'uuid';

export default function Login({ onIdSubmit }) {
  const idRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    onIdSubmit(idRef.current.value);
  };

  const handleRandomId = () => {
    const randomId = uuidV4();
    onIdSubmit(randomId);
  };

  return (
    <Container className="align-items-center d-flex" style={{ height: '100vh' }}>
      <Form onSubmit={handleSubmit} className="w-100">
        <Form.Group>
          <Form.Label>Enter your ID</Form.Label>
          <Form.Control type="text" ref={idRef} />
        </Form.Group>
        <Button type="submit" className="me-2 mt-2">
          Login
        </Button>
        <Button onClick={handleRandomId} variant="secondary" className="mt-2">
          Create a New ID
        </Button>
      </Form>
    </Container>
  );
}
