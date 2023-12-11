const CourseTable = ({ selectedTeacher, setSelectedTeacher, teachersData }) => {
  const allCourses = teachersData.flatMap((teacher) =>
    teacher.listOfCourses.map((course) => ({
      ...course,
      teacherName: teacher.name,
    }))
  );

  const handleReset = () => {
    setSelectedTeacher(null);
  };

  if (selectedTeacher === null) {
    return (
      <div>
        <h2>All Teachers Courses</h2>
        <button onClick={handleReset}>Reset Selected Teacher</button>
        <table>
          {/* Table header */}
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Course Name</th>
              <th>Speed</th>
              <th>Time Scope</th>
              <th>Department</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {allCourses.map((course, index) => (
              <tr key={index}>
                <td>{course.teacherName}</td>
                <td>{course.name}</td>
                <td>{course.speed}</td>
                <td>{course.timescope}</td>
                <td>{course.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!selectedTeacher || !selectedTeacher.listOfCourses) {
    return null;
  }

  return (
    <div>
      <h2>{selectedTeacher.name}'s Courses</h2>
      <button onClick={handleReset}>Reset Selected Teacher</button>
      <table>
        {/* Table header */}
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Speed</th>
            <th>Time Scope</th>
            <th>Department</th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody>
          {selectedTeacher.listOfCourses.map((course) => (
            <tr key={course.id}>
              <td>{course.name}</td>
              <td>{course.speed}</td>
              <td>{course.timescope}</td>
              <td>{course.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable;
