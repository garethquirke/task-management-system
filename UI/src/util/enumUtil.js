const STATUS_KEY = {
  0: "pending", // blue
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

function getKeyByValue(object, value) {
  const lowerCaseValue = value.toLowerCase();
  const key = Object.keys(object).find(key => object[key].toLowerCase() === lowerCaseValue);
  return key !== undefined ? key : null;
}

export {
   STATUS_KEY, PRIORITY_KEY, FORM_MODE, getPriorityText, getStatusText, getKeyByValue
}