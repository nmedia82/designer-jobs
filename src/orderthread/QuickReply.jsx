import React from "react";

const QuickReplies = ({ quick_messages }) => {
  return (
    <div>
      <h2>Quick Messages</h2>
      <ul className="list-group">
        {quick_messages.map((message, index) => (
          <li key={index} className="list-group-item">
            <strong>#{index + 1}: </strong>
            {message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuickReplies;
