import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { get_setting } from "../services/helper";

export default function RenderField({
  formValues,
  field,
  QuickMessages,
  onInputChange,
  onEditorChange,
  onQuickMessageChange,
}) {
  const editorRef = useRef(null);
  const tinymce_api_key = get_setting("tinymce_api_key");

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
            onChange={onInputChange}
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
          onEditorChange={onEditorChange}
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
        <QuickMessages quick_messages={value} onChange={onQuickMessageChange} />
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
            onChange={onInputChange}
          />
        }
      </div>
    );
  }
}
