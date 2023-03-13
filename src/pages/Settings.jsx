import React, { useState } from "react";
import data from "./../services/data.json";

const { settings_meta } = data;

const AdminSettings = ({ admin_settings, onSettingsSave }) => {
  const [formValues, setFormValues] = useState({
    automatic_mode: admin_settings?.automatic_mode || true,
    disable_emails_designers: admin_settings?.disable_emails_designers || false,
    disable_emails_customers: admin_settings?.disable_emails_customers || false,
    cronjob_days_limit: admin_settings?.cronjob_days_limit || 7,
    header_note_designers: admin_settings?.header_note_designers || "",
    header_note_customers: admin_settings?.header_note_customers || "",
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSettingsSave(formValues);
  };

  return (
    <form onSubmit={handleSubmit}>
      {settings_meta.map((field) => {
        const { id, label, type, default_value } = field;
        const value = formValues[id] || default_value;
        if (type === "checkbox") {
          return (
            <div className="form-group" key={id}>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name={id}
                  id={id}
                  checked={value}
                  onChange={handleInputChange}
                />
                <label htmlFor={id} className="form-check-label ml-2">
                  {label}
                </label>
              </div>
            </div>
          );
        } else {
          return (
            <div className="form-group" key={id}>
              <label htmlFor={id}>{label}</label>
              {type === "textarea" ? (
                <textarea
                  className="form-control"
                  name={id}
                  id={id}
                  value={value}
                  onChange={handleInputChange}
                  rows="3"
                />
              ) : (
                <input
                  type={type}
                  className="form-control"
                  name={id}
                  id={id}
                  value={value}
                  onChange={handleInputChange}
                />
              )}
            </div>
          );
        }
      })}
      <button type="submit" className="btn btn-primary mt-3">
        Submit
      </button>
    </form>
  );
};

export default AdminSettings;
