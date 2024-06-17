import { useMemo, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { STATUS_KEY, PRIORITY_KEY, FORM_MODE, getKeyByValue } from "../../util/enumUtil";
import TaskTable from "./TaskTable";
import DistributionBar from "../../Shared/DistributionBar";
import TaskModal from "./TaskModal";

const TaskList = (props) => {
  const { fetchTasks, tasks, isLoading, handleDelete } = props;

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [formMode, setFormMode] = useState(null);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const [actionPending, setActionPending] = useState(false);
  const [errorMessage, setErrorMessge] = useState(null);

  const filteredData = useMemo(() => {
    return tasks.filter((item) => {
      const matchesStatus = statusFilter
        ? item.status === parseInt(statusFilter)
        : true;
      const matchesPriority = priorityFilter
        ? item.priority === parseInt(priorityFilter)
        : true;
      return matchesStatus && matchesPriority;
    });
  }, [tasks, statusFilter, priorityFilter]);

  const taskBreakdown = useMemo(() => {
    return tasks
      .map((t) => t.status)
      .reduce((accumulator, currentValue) => {
        const statusKey = STATUS_KEY[currentValue];
        accumulator[statusKey] = accumulator[statusKey] || 0;
        accumulator[statusKey]++;
        return accumulator;
      }, {});
  }, [tasks]);

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handlePriorityFilterChange = (e) => {
    setPriorityFilter(e.target.value);
  };

  const handleModalOpen = (formMode) => {
    setErrorMessge(null);
    setTaskModalVisible(true);
    setFormMode(formMode);
  };

  const onUpdate = async (task) => {
    const updateBody = {
      ...task,
      id: taskToUpdate.id,
      dueDate: new Date(task.dueDate).toISOString(),
      status: Number.isInteger(task.status) ? task.status : Number(getKeyByValue(STATUS_KEY, task.status)),
      priority: Number.isInteger(task.priority) ? task.priority : Number(getKeyByValue(PRIORITY_KEY, task.priority))
    };

    try {
      const response = await fetch(`http://localhost:5208/api/Task/tasks/${updateBody.id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateBody)
        });

        if (!response.ok) {
          throw new Error(`Failed to update task: ${response.statusText}`);
        }

        setTaskModalVisible(false);
        fetchTasks();
      } catch (err) {
          setErrorMessge(err);
      }
  };

  const onCreate = async (task) => {
    try {
        const body  = {...task, dueDate: new Date(task.dueDate).toISOString() };
        const response = await fetch(`http://localhost:5208/api/Task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(body)
          });

          if (!response.ok) {
            throw new Error(`Failed to create task: ${response.statusText}`);
          }

          setTaskModalVisible(false);
          fetchTasks();
        } catch (err) {
            setErrorMessge(err);
        }
  }

  const handleEdit = (taskId) => {
    const task = tasks.find(x => x.id === taskId);
    setTaskToUpdate(task);
    handleModalOpen(FORM_MODE.UPDATE);
  };

  const handleOnSave = (task) => {
    const action = formMode === FORM_MODE.UPDATE ? onUpdate : onCreate;
    action(task);
  };

  return (
    <Container>
      <TaskModal
        formMode={formMode}
        show={taskModalVisible}
        task={taskToUpdate}
        onSave={handleOnSave}
        onHide={() => setTaskModalVisible(false)}
        actionPending={actionPending}
        errorMessage={errorMessage}
      />
      <Row className="mb-2">
        <Col sm={2}>
          <Button onClick={() => handleModalOpen(FORM_MODE.CREATE)}>
            Create +
          </Button>
        </Col>
        <Col sm={{ span: 4 }}>
          <DistributionBar
            label="Status Breakdown"
            total={tasks.length}
            completed={taskBreakdown[STATUS_KEY[2]]}
            inProgress={taskBreakdown[STATUS_KEY[1]]}
            pending={taskBreakdown[STATUS_KEY[0]]}
            archived={taskBreakdown[STATUS_KEY[3]]}
          />{" "}
        </Col>
        <Col sm={3}>
          <Form.Group controlId="statusFilter">
            <Form.Select
              className="bg-dark text-light"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="">Status - All</option>
              {Object.entries(STATUS_KEY).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col sm={3}>
          <Form.Group controlId="priorityFilter">
            <Form.Select
              className="bg-dark text-light"
              value={priorityFilter}
              onChange={handlePriorityFilterChange}
            >
              <option value="">Priority - All</option>
              {Object.entries(PRIORITY_KEY).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <TaskTable
          isLoading={isLoading}
          filteredData={filteredData}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </Row>
    </Container>
  );
};

export default TaskList;
