import { useEffect, useState } from "react";
import data from "../services/data.json";
import QuickMessages from "../pages/QuickMessages";
import RenderField from "./Render";
import { Col, Row } from "react-bootstrap";

let { settings_meta } = data;

function UserSettings({ admin_settings, onSettingsSave, UserRole }) {
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

  const handleQuickMessageChange = (field_id, messages) => {
    // const new_key = "quick_messages";
    setFormValues((prevState) => ({
      ...prevState,
      [field_id]: messages,
    }));
  };
  return (
    <form onSubmit={handleSubmit}>
      <Row>
        {FieldMeta.map((field) => (
          <Col sm={field.col || 12} key={field.id}>
            <RenderField
              field={field}
              QuickMessages={QuickMessages}
              formValues={formValues}
              onInputChange={handleInputChange}
              onEditorChange={handleEditorChange}
              onQuickMessageChange={handleQuickMessageChange}
            />
          </Col>
        ))}
      </Row>
    </form>
  );
}

export default UserSettings;
