import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

import TaskList from "./TaskList";
import ConfirmDelete from "./ConfirmDelete";

const TaskContainer = (props) => {
  const [loadState, setLoadState] = useState({ isLoading: true, error: null });
  const [tasks, setTasks] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);

  const [deleteInfo, setDeleteInfo] = useState({deleteId: null, name: ''});
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  const fetchTasks = () => {
    fetch("http://localhost:5208/api/Task")
      .then((response) => response.json())
      .then((json) => {
        setTasks(json);
        setLoadState({ isLoading: false, error: null });
      })
      .catch((err) => setLoadState({ isLoading: false, error: err }));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = (taskId) => {
    const taskName = tasks.find(t => t.id === taskId).title;
    setDeleteInfo({deleteId: taskId, name: taskName});

    setConfirmDeleteVisible(true);
  };

  const onDelete = () => {
    fetch(`http://localhost:5208/api/Task/${deleteInfo.deleteId}`, {
        method: 'DELETE'
      })
    .then(() => {
        fetchTasks();
        setConfirmDeleteVisible(false);
    })
    .catch((err) => setLoadState({ isLoading: false, error: err }));
  };

  return (
    <Container fluid>
      <h2 className="text-align-center">Task Management</h2>
      <ConfirmDelete taskName={deleteInfo.name} show={confirmDeleteVisible} onHide={() => setConfirmDeleteVisible(false)} onDelete={() => onDelete()} />
      <TaskList fetchTasks={fetchTasks} tasks={tasks} isLoading={loadState.isLoading} handleDelete={handleDelete} />
    </Container>
  );
};

export default TaskContainer;
