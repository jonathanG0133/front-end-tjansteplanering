import { useState } from "react";
import "./ProjectTable.css";

const ProjectTable = ({ selectedStaff, projectData }) => {
  const [showInfo, setShowInfo] = useState(false);

  // Use courseInstanceData if no staff is selected, otherwise use staff's courses
  const projectToShow = selectedStaff ? selectedStaff.projects : projectData;

  const getRowClass = (project) => {
    if (project.task.isCancelled === 1) {
      return "row-grey";
    } else if (project.task.isHandled === 0) {
      return "row-red";
    }
    return "row-default";
  };

  return (
    <div className="project-table">
      <div className="header-container">
        <h2>
          {selectedStaff ? `${selectedStaff.name}'s Projects` : "All Projects"}
        </h2>
        <button
          className="info-button"
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
          aria-label="Information"
        >
          ?
        </button>
      </div>
      <div className={`info-modal ${showInfo ? "show" : ""}`}>
        <div id="handled">
          <p>Not Handled</p>
        </div>
        <div id="cancelled">
          <p>Cancelled</p>
        </div>
      </div>
      <div className="container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Budget</th>
              <th>TimeResource</th>
              <th>Start:End-Date</th>
            </tr>
          </thead>
          <tbody>
            {projectToShow.map((project, index) => (
              <tr key={index} className={getRowClass(project)}>
                <td>{project.id}</td>
                <td>{project.name}</td>
                <td>{project.task.budget}</td>
                <td>{project.task.timeResource}</td>
                <td>{project.task.timescope}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;
