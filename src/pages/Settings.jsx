import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

import data from "./../services/data.json";
import QuickMessages from "./QuickMessages";
import { get_setting } from "../services/helper";
import RenderField from "../admin/Render";

let { settings_meta } = data;

const AdminSettings = ({ admin_settings, onSettingsSave, UserRole }) => {
  // const [formValues, setFormValues] = useState({
  //   automatic_mode: admin_settings?.automatic_mode || false,
  //   disable_emails_designers: admin_settings?.disable_emails_designers || false,
  //   disable_emails_customers: admin_settings?.disable_emails_customers || false,
  //   cronjob_days_limit: admin_settings?.cronjob_days_limit || 7,
  //   header_note_designers: admin_settings?.header_note_designers || "",
  //   header_note_customers: admin_settings?.header_note_customers || "",
  //   faq_for_designers: admin_settings?.faq_for_designers || "",
  //   faq_for_customers: admin_settings?.faq_for_customers || "",
  //   max_jobs_limit: admin_settings?.max_jobs_limit || "",
  //   quick_messages: admin_settings?.quick_messages || [],
  //   email_admin_to_designer: admin_settings?.email_admin_to_designer || "",
  //   max_file_size: admin_settings?.max_file_size || "",
  //   file_types_allowed: admin_settings?.file_types_allowed || "",
  //   tinymce_api_key: admin_settings?.tinymce_api_key || "",
  //   agreement_text_for_customer:
  //     admin_settings?.agreement_text_for_customer || "",
  // });
  const [formValues, setFormValues] = useState({
    ...admin_settings,
  });
  const [FieldMeta, setFieldMeta] = useState([...settings_meta]);

  useEffect(() => {
    // filter settings by user role
    const meta = settings_meta.filter(
      (setting) => setting.visibility === UserRole
    );
    setFieldMeta(meta);
  }, [settings_meta]);

  console.log(FieldMeta);

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
      const ids = FieldMeta.map((item) => item.id);
      settings_data = Object.keys(formValues)
        .filter((key) => ids.includes(key))
        .reduce((obj, key) => {
          obj[key] = formValues[key];
          return obj;
        }, {});
    }
    onSettingsSave(settings_data);
  };

  const handleQuickMessageChange = (messages) => {
    const new_key = "quick_messages";
    setFormValues((prevState) => ({
      ...prevState,
      [new_key]: messages,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {FieldMeta.map((field) => {
        return (
          <RenderField
            field={field}
            QuickMessages={QuickMessages}
            formValues={formValues}
            onInputChange={handleInputChange}
            onEditorChange={handleEditorChange}
            onQuickMessageChange={handleQuickMessageChange}
          />
        );
      })}
      <button type="submit" className="btn btn-primary mt-3">
        Submit
      </button>
    </form>
  );
};

export default AdminSettings;
