import React from 'react';

const CVTable = ({ cvs }) => {
  if (!cvs.length) return <p>No submissions found.</p>;

  const fieldNames = Object.keys(cvs[0]?.data || {});

  return (
    <table className="table table-bordered table-striped mt-3">
      <thead>
        <tr>
          <th>Project</th>
          <th>User</th>
          <th>Email</th>
          {fieldNames.map((key) => (
            <th key={key}>{key}</th>
          ))}
          <th>Submitted At</th>
        </tr>
      </thead>
      <tbody>
        {cvs.map((cv) => (
          <tr key={cv.id}>
            <td>{cv.project_name}</td>
            <td>{cv.user_name}</td>
            <td>{cv.email}</td>
            {fieldNames.map((key) => (
              <td key={key}>{cv.data[key]}</td>
            ))}
            <td>{new Date(cv.submitted_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CVTable;
