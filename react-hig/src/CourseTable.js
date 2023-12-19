import { useState } from "react";
import "./CourseTable.css";

const CourseTable = ({ selectedStaff, courseInstanceData }) => {
  const [showInfo, setShowInfo] = useState(false);

  // Use courseInstanceData if no staff is selected, otherwise use staff's courses
  const coursesToShow = selectedStaff
    ? selectedStaff.courseInstances.map((courseInstance) => ({
        ...courseInstance,
        courseName: courseInstance.course.name,
      }))
    : courseInstanceData.map((courseInstance) => ({
        ...courseInstance,
        courseName: courseInstance.course.name,
      }));

  const getRowClass = (course) => {
    if (course.task.isCancelled === 1) {
      return "row-grey";
    } else if (course.task.isHandled === 0) {
      return "row-red";
    }
    return "";
  };

  return (
    <div>
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
      <div className={`info-modal ${showInfo ? "show" : ""}`}>
        <div id="handled">
          <p>Not Handled</p>
        </div>
        <div id="cancelled">
          <p>Cancelled</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Course Name</th>
            <th>Speed</th>
            <th>Students</th>
            <th>Start:End-Date</th>
          </tr>
        </thead>
        <tbody>
          {coursesToShow.map((course, index) => (
            <tr key={index} className={getRowClass(course)}>
              <td>{course.courseInstanceId}</td>
              <td>{course.courseName}</td>
              <td>{course.speed}</td>
              <td>{course.students}</td>
              <td>{course.task.timescope}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable;
