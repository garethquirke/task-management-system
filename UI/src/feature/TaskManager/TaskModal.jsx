import { useEffect, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";

import ConfirmStatus from "./ConfirmStatus";
import { FORM_MODE, PRIORITY_KEY, STATUS_KEY } from "../../util/enumUtil";

const TaskModal = (props) => {
  const { formMode, show, onHide, task, onSave, actionPending, errorMessage } = props;

  const [formTouched, setFormTouched] = useState(false);
  const [confirmStatusModal, setConfirmStatusModal] = useState(false);

  const getCurrentDateTimeLocal = (dateInput) => {
    const now =  dateInput ? new Date(dateInput) : new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
    status: "pending",
  });

  useEffect(() => {
    if (formMode === FORM_MODE.UPDATE && task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority || "low",
        dueDate: getCurrentDateTimeLocal(task.dueDate) || "",
        status: task.status || "pending",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "low",
        dueDate: getCurrentDateTimeLocal(),
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
      [name]: name === 'priority' || name === 'status' ? Number(value) : value,
    });

    setFormTouched(true);
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
  };

  const actionButtonDisabled = actionPending || !formTouched || formData.title.length === 0;

  return (
    <>
      <ConfirmStatus
        show={confirmStatusModal}
        onHide={cancelHighPriority}
        onConfirm={() => setConfirmStatusModal(false)}
      />
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <p className="m-1 w-100 text-center">
            {formMode === "create" ? "Create Task" : "Update Task"}
          </p>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <Alert variant={"danger"}>{errorMessage.message}</Alert>}
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
                type={"datetime-local"}
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
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={actionButtonDisabled}
          >
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
