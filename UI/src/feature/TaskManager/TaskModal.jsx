import { Button, Form, Modal } from "react-bootstrap";
import { FORM_MODE, PRIORITY_KEY, STATUS_KEY } from "../../util/enumUtil";
import { useEffect, useState } from "react";
import ConfirmStatus from "./ConfirmStatus";

const TaskModal = (props) => {
  const { formMode, show, onHide, task, onSave } = props;

  const [confirmStatusModal, setConfirmStatusModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
    status: "pending",
  });

  useEffect(() => {
    if (formMode === FORM_MODE.CREATE && task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority || "low",
        dueDate: task.dueDate || "",
        status: task.status || "pending",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "low",
        dueDate: "",
        status: "pending",
      });
    }
  }, [formMode, task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'priority' && Number(value) === 2) {
        setConfirmStatusModal(true);
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const cancelHighPriority = () => {
    setFormData({
      ...formData,
      priority: "",
    });
    setConfirmStatusModal(false);
  };

  const handleSave = () => {
    onSave(formData);
    onHide();
  };

  return (
    <>
    <ConfirmStatus show={confirmStatusModal} onHide={cancelHighPriority} onConfirm={() => setConfirmStatusModal(false)} />
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <p className="m-1 w-100 text-center">
            {formMode === "create" ? "Create Task" : "Update Task"}
          </p>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="title">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="priority">
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                {Object.entries(PRIORITY_KEY).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="dueDate">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {Object.entries(STATUS_KEY).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-center p-0">
          <Button variant="primary" onClick={handleSave}>
            {formMode === "create" ? "Create" : "Update"}
          </Button>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TaskModal;
