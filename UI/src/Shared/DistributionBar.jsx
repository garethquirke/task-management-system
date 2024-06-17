import React, { useCallback } from "react";
import { ProgressBar } from "react-bootstrap";

const DistributionBar = (props) => {
  const { label, total, completed, inProgress, pending, archived } = props;

  const calculatePercentage = useCallback((total, figure) => {
    return (figure / total) * 100;
  }, []);

  return (
    <React.Fragment>
      <label htmlFor={`${label.trim()}`}>{label}</label>
      <ProgressBar id={`${label.trim()}`}>
        <ProgressBar
          variant="success"
          now={calculatePercentage(total, completed)}
          key={1}
        />
        <ProgressBar
          variant="warning"
          now={calculatePercentage(total, inProgress)}
          key={2}
        />
        <ProgressBar
          variant="danger"
          now={calculatePercentage(total, archived)}
          key={3}
        />
        <ProgressBar
          variant="primary"
          now={calculatePercentage(total, pending)}
          key={4}
        />
      </ProgressBar>
    </React.Fragment>
  );
};

export default DistributionBar;
