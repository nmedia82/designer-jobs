import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { get_setting } from "../services/helper";

function CheckboxField({ id, label, value, onChange }) {
  return (
    <div className="form-group">
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          name={id}
          id={id}
          checked={value}
          onChange={onChange}
        />
        <label htmlFor={id} className="form-check-label ml-2">
          {label}
        </label>
      </div>
    </div>
  );
}

function SelectField({ id, label, options, value, onChange }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <select
        className="form-control"
        name={id}
        id={id}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.key} value={option.key}>
            {option.value}
          </option>
        ))}
      </select>
    </div>
  );
}

function TinyEditor({ id, label, value, onChange, apiKey }) {
  const editorRef = useRef(null);
  return (
    <div className="form-group mt-3">
      <label htmlFor={id}>{label}</label>
      <Editor
        id={id}
        value={value}
        onEditorChange={onChange}
        onInit={(evt, editor) => (editorRef.current = editor)}
        apiKey={apiKey}
        init={{
          height: 200,
          menubar: true,
          plugins: [
            "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount",
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
}

function InputField({ id, label, type, value, onChange }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        className="form-control"
        name={id}
        id={id}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default function RenderField({
  formValues,
  field,
  QuickMessages,
  onInputChange,
  onEditorChange,
  onQuickMessageChange,
}) {
  const tinymce_api_key = get_setting("tinymce_api_key");
  let { id, label, type, default_value, options, tab } = field;

  const value = formValues[id] || default_value || "";

  switch (type) {
    case "checkbox":
      return (
        <CheckboxField
          id={id}
          label={get_setting(`${id}_label`) || label}
          value={value}
          onChange={onInputChange}
        />
      );
    case "select":
      return (
        <SelectField
          id={id}
          label={label}
          options={options}
          value={value}
          onChange={onInputChange}
        />
      );
    case "tiny":
      return (
        <TinyEditor
          id={id}
          label={label}
          value={value}
          onChange={onEditorChange}
          apiKey={tinymce_api_key}
        />
      );
    case "repeater":
      return (
        <div className="form-group mt-3">
          <label htmlFor={id}>{label}</label>
          <QuickMessages
            field={field}
            quick_messages={value}
            onChange={onQuickMessageChange}
          />
        </div>
      );
    case "heading":
      return <h2>{label}</h2>;
    default:
      return (
        <InputField
          id={id}
          label={label}
          type={type}
          value={value}
          onChange={onInputChange}
        />
      );
  }
}
