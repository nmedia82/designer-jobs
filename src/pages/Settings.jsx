import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import data from "./../services/data.json";
import QuickMessages from "./QuickMessages";

let { settings_meta } = data;

const AdminSettings = ({ admin_settings, onSettingsSave, UserRole }) => {
  const [formValues, setFormValues] = useState({
    automatic_mode: admin_settings?.automatic_mode || false,
    disable_emails_designers: admin_settings?.disable_emails_designers || false,
    disable_emails_customers: admin_settings?.disable_emails_customers || false,
    cronjob_days_limit: admin_settings?.cronjob_days_limit || 7,
    header_note_designers: admin_settings?.header_note_designers || "",
    header_note_customers: admin_settings?.header_note_customers || "",
    max_jobs_limit: admin_settings?.max_jobs_limit || "",
    quick_messages: admin_settings?.quick_messages || [],
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditorChange = (value, id, source) => {
    console.log(`Editor ${id} changed: ${value} (${source})`);
    setFormValues((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSettingsSave(formValues);
  };

  // filter settings by user role
  settings_meta = settings_meta.filter(
    (setting) => setting.visibility === UserRole
  );

  const handleQuickMessageChange = (messages) => {
    setFormValues((prevState) => ({
      ...prevState,
      ["quick_messages"]: messages,
    }));
  };
  console.log(formValues);

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
        } else if (type === "textarea") {
          return (
            <div className="form-group mt-3" key={id}>
              <label htmlFor={id}>{label}</label>
              <ReactQuill
                key={id}
                value={value}
                onChange={(value, delta, source) =>
                  handleEditorChange(value, id, source)
                }
              />
            </div>
          );
        } else if (type === "repeater") {
          return (
            <div className="form-group mt-3" key={id}>
              <label htmlFor={id}>{label}</label>
              <QuickMessages
                quick_messages={value}
                onChange={handleQuickMessageChange}
              />
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
