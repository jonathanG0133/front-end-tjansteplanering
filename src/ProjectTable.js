import { useState } from "react";
import "./ProjectTable.css";
import COLORS from "./values/colors";

const ProjectTable = ({ selectedStaff, projectData }) => {
  const [showInfo, setShowInfo] = useState(false);

  // Use courseInstanceData if no staff is selected, otherwise use staff's courses
  const projectToShow = selectedStaff ? selectedStaff.projects : projectData;

  const getRowStyle = (project) => {
    if (project.task.isCancelled === 1) {
      return { backgroundColor: COLORS.cancelled };
    } else if (project.task.isHandled === 0) {
      return { backgroundColor: COLORS.notHandled };
    }
    return { backgroundColor: COLORS.background };
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
      <div
        className={`info-modal ${showInfo ? "show" : ""}`}
        style={{ backgroundColor: COLORS.background }}
      >
        <div
          className="info-box"
          style={{ backgroundColor: COLORS.notHandled }}
        >
          <p>Not Handled</p>
        </div>
        <div className="info-box" style={{ backgroundColor: COLORS.cancelled }}>
          <p>Cancelled</p>
        </div>
      </div>
      <div className="container">
        <table>
          <thead
            style={{
              backgroundColor: COLORS.tableHeader,
              zindex: 10,
              position: "sticky",
              top: 0,
            }}
          >
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
              <tr key={index} style={getRowStyle(project)}>
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
