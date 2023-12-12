import React from "react";

const CourseTable = ({ selectedTeacher, teachersData }) => {
  const isFlagRed = (hanterad) => {
    // Define your logic here for determining if the flag is red
    // For example, you can check if hanterad is "Ja" or use any other condition
    return hanterad === "Nej";
  };

  // Display courses for the selected teacher, or for all teachers if none is selected
  const coursesToDisplay = selectedTeacher
    ? selectedTeacher.listOfCourses
    : teachersData.flatMap((teacher) => teacher.listOfCourses);

  return (
    <div>
      <h3>
        Courses {selectedTeacher ? `for ${selectedTeacher.name}` : "for All Teachers"}
      </h3>
      <table border="1">
        <thead>
          {selectedTeacher && (
            <tr>
              <th>Course Name</th>
              <th>Size</th>
              <th>Students</th>
              <th>Distributed Days</th>
              <th>Number of Teachers</th>
              <th>Year Load</th>
              <th>Speed</th>
              <th>Timescope</th>
              <th>Department</th>
              <th>Hanterad</th>
            </tr>
          )}
          {!selectedTeacher && (
            <tr>
              <th>Course Name</th>
              <th>Size</th>
              <th>Students</th>
              <th>Distributed Days</th>
              <th>Number of Teachers</th>
              <th>Year Load</th>
              <th>Speed</th>
              <th>Timescope</th>
              <th>Department</th>
              <th>Hanterad</th>
            </tr>
          )}
        </thead>
        <tbody>
          {coursesToDisplay.map((course, index) => (
            <tr
              key={index}
              style={{
                backgroundColor: isFlagRed(course.hanterad) ? "#ffcccc" : "white",
              }}
            >
              <td>{course.name}</td>
              <td>{course.size}</td>
              <td>{course.students}</td>
              <td>{course.distributedDays}</td>
              <td>{course.numberOfTeachers}</td>
              <td>{course.yearLoad}</td>
              <td>{course.speed}</td>
              <td>{course.timescope}</td>
              <td>{course.department}</td>
              <td>{course.hanterad}</td> {/* Change flag to hanterad here */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable;
