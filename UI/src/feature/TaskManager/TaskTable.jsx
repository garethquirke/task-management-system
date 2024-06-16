import moment from "moment";
import { useCallback } from "react";

import { getPriorityText, getStatusText } from "../../util/enumUtil";
import { Badge, Button, Spinner, Table } from "react-bootstrap";

const TaskTable = props => {
    const { isLoading, filteredData, handleEdit, handleDelete } = props;

    const getStatusVariant = useCallback((status) => {
        switch (status) {
            case 0:
              return "primary";
            case 1:
              return "warning";
            case 2:
              return "success";
            case 3:
              return "danger";
            default:
              return "secondary";
          }
    }, []);

    return (
        <div className="table-container">
        {isLoading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <Table className="task-table" variant="dark" striped bordered>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((task) => {
                return (
                  <tr key={`task-${task.id}`}>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{getPriorityText(task.priority)}</td>
                    <td>{moment(task.dueDate).format("DD/MM/YYYY h:mmA")}</td>
                    <td>
                      <Badge bg={getStatusVariant(task.status)}>
                        {getStatusText(task.status)}
                      </Badge>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <Button variant="secondary" onClick={(e) => handleEdit(task.id)}>
                          Edit
                        </Button>
                        <Button
                          onClick={(e) => handleDelete(task.id)}
                          variant="danger"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
    )
};

export default TaskTable;