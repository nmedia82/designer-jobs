import { useEffect, useState } from "react";
import { Tab, Col, Nav, Row } from "react-bootstrap";
import data from "./../services/data.json";
import QuickMessages from "../pages/QuickMessages";
import RenderField from "./Render";

let { settings_meta } = data;

function AdminSettings({ admin_settings, onSettingsSave, UserRole }) {
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
    // return console.log(settings_data);
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

  const handleQuickMessageChange = (field_key, messages) => {
    // const new_key = "quick_messages";
    setFormValues((prevState) => ({
      ...prevState,
      [field_key]: messages,
    }));
  };
  return (
    <form onSubmit={handleSubmit}>
      <Tab.Container defaultActiveKey="general">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="general">General Settings</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="content">Content/Labels</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="design">Design/Layout</Nav.Link>
              </Nav.Item>
              <Nav.Item className="text-center"></Nav.Item>
            </Nav>
            <button type="submit" className="btn btn-success mt-3">
              Save Settings
            </button>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="general">
                <Row className="m-10">
                  {FieldMeta.filter((field) => field.tab === "general").map(
                    (field) => (
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
                    )
                  )}
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="content">
                <Row className="m-10">
                  {FieldMeta.filter((field) => field.tab === "content").map(
                    (field) => (
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
                    )
                  )}
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="design">
                <Row className="m-10">
                  {FieldMeta.filter((field) => field.tab === "design").map(
                    (field) => (
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
                    )
                  )}
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </form>
  );
}

export default AdminSettings;
