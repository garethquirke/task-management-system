const STATUS_KEY = {
  0: "Pending", // blue
  1: "In Progress", // yellow
  2: "Completed", // green
  3: "Archived", // red
};
const PRIORITY_KEY = {
    0: "Low",
    1: "Medium",
    2: "High"
};

const FORM_MODE = {
    CREATE: 'create',
    UPDATE: 'update'
};

function getPriorityText(id) {
    return PRIORITY_KEY[id];
};

function getStatusText(id) {
  return STATUS_KEY[id];
};

export {
   STATUS_KEY, PRIORITY_KEY, FORM_MODE, getPriorityText, getStatusText
}