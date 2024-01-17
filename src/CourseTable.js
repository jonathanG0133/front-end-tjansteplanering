import { useState } from "react";
import "./CourseTable.css";
import COLORS from "./values/colors";

const CourseTable = ({ selectedStaff, courseInstanceData }) => {
  const [showInfo, setShowInfo] = useState(false);

  // Use courseInstanceData if no staff is selected, otherwise use staff's courses
  const coursesToShow = selectedStaff
    ? selectedStaff.courseInstances
    : courseInstanceData;

  const getRowStyle = (course) => {
    if (course.task.isCancelled === 1) {
      return { backgroundColor: COLORS.cancelled };
    } else if (course.task.isHandled === 0) {
      return { backgroundColor: COLORS.notHandled };
    }
    return { backgroundColor: COLORS.background };
  };

  return (
    <div className="course-table">
      <div className="header-container">
        <h2>
          {selectedStaff ? `${selectedStaff.name}'s Courses` : "All Courses"}
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
              <th>Speed</th>
              <th>Students</th>
              <th>Start:End-Date</th>
            </tr>
          </thead>
          <tbody>
            {coursesToShow.map((course, index) => (
              <tr key={index} style={getRowStyle(course)}>
                <td>{course.courseInstanceId}</td>
                <td>{course.course.name}</td>
                <td>{course.speed}</td>
                <td>{course.students}</td>
                <td>{course.task.timescope}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseTable;
