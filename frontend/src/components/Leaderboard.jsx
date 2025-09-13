import React from "react";

function Leaderboard() {
  const users = [
    { name: "John Doe", points: 120 },
    { name: "Alice Smith", points: 110 },
    { name: "Michael Brown", points: 95 },
    { name: "Emma Davis", points: 90 },
  ];

  return (
    <div className="container py-4">
      <h2 className="mb-3">Best Energy User</h2>
      <ul className="list-group">
        {users.map((u, i) => (
          <li key={i} className="list-group-item d-flex justify-content-between">
            <span>{u.name}</span>
            <strong>{u.points} pts</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Leaderboard;