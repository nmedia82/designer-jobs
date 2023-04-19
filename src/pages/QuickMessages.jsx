import React, { useState, useEffect } from "react";

const QuickMessages = ({ field, quick_messages, onChange }) => {
  const [fields, setFields] = useState(quick_messages || []);

  useEffect(() => {
    setFields(quick_messages);
  }, [quick_messages]);

  const handleInputChange = (e, index) => {
    const newFields = [...fields];
    newFields[index] = e.target.value;
    setFields(newFields);
    onChange(field.id, newFields);
  };

  const handleAddField = () => {
    setFields([...fields, ""]);
  };

  const handleRemoveField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    onChange(newFields);
  };

  return (
    <div>
      {fields.map((field, index) => (
        <div key={index} className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            value={field}
            onChange={(e) => handleInputChange(e, index)}
          />
          <a
            className="btn btn-outline-danger"
            href="#/"
            onClick={() => handleRemoveField(index)}
          >
            -
          </a>
        </div>
      ))}
      <a href="#/" className="btn btn-outline-primary" onClick={handleAddField}>
        +
      </a>
    </div>
  );
};

export default QuickMessages;
