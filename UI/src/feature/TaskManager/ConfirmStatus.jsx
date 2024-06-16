import { Modal, Button } from "react-bootstrap";

const ConfirmStatus = (props) => {
  const { show, onHide, onConfirm } = props;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm High Priority</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to set priority to high?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmStatus;
