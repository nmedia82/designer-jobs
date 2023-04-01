import React, { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

import data from "./../services/data.json";
import QuickMessages from "./QuickMessages";
import { get_setting } from "../services/helper";

let { settings_meta } = data;

const AdminSettings = ({ admin_settings, onSettingsSave, UserRole }) => {
  const [formValues, setFormValues] = useState({
    automatic_mode: admin_settings?.automatic_mode || false,
    disable_emails_designers: admin_settings?.disable_emails_designers || false,
    disable_emails_customers: admin_settings?.disable_emails_customers || false,
    cronjob_days_limit: admin_settings?.cronjob_days_limit || 7,
    header_note_designers: admin_settings?.header_note_designers || "",
    header_note_customers: admin_settings?.header_note_customers || "",
    faq_for_designers: admin_settings?.faq_for_designers || "",
    faq_for_customers: admin_settings?.faq_for_customers || "",
    max_jobs_limit: admin_settings?.max_jobs_limit || "",
    quick_messages: admin_settings?.quick_messages || [],
    email_admin_to_designer: admin_settings?.email_admin_to_designer || [],
    max_file_size: admin_settings?.max_file_size || [],
    file_types_allowed: admin_settings?.file_types_allowed || [],
    tinymce_api_key: admin_settings?.tinymce_api_key || [],
  });

  const editorRef = useRef(null);
  const tinymce_api_key = get_setting("tinymce_api_key");

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditorChange = (value, editor) => {
    setFormValues((prevState) => ({
      ...prevState,
      [editor.id]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let settings_data = formValues;
    // if user is not admin then save single values
    if (UserRole !== "admin") {
      const ids = settings_meta.map((item) => item.id);
      settings_data = Object.keys(formValues)
        .filter((key) => ids.includes(key))
        .reduce((obj, key) => {
          obj[key] = formValues[key];
          return obj;
        }, {});
    }
    onSettingsSave(settings_data);
  };

  // filter settings by user role
  settings_meta = settings_meta.filter(
    (setting) => setting.visibility === UserRole
  );

  const handleQuickMessageChange = (messages) => {
    const new_key = "quick_messages";
    setFormValues((prevState) => ({
      ...prevState,
      [new_key]: messages,
    }));
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
        } else if (type === "tiny") {
          return (
            <div className="form-group mt-3" key={id}>
              <label htmlFor={id}>{label}</label>
              <Editor
                id={id}
                value={value}
                onEditorChange={handleEditorChange}
                onInit={(evt, editor) => (editorRef.current = editor)}
                apiKey={tinymce_api_key}
                init={{
                  height: 200,
                  menubar: true,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | code" +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
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
              {
                <input
                  type={type}
                  className="form-control"
                  name={id}
                  id={id}
                  value={value}
                  onChange={handleInputChange}
                />
              }
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
