import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { get_setting, wooconvo_makeid } from "../services/helper";
import pluginData from "./../services/data.json";
import { Button } from "react-bootstrap";

const { siteurl } = pluginData;

function DesignerInvoices({
  designer_invoices,
  designer_users,
  onInvoiceDelete,
  DesignerUsers,
  UserRole,
}) {
  const [AllInvoices, setAllInvoices] = useState(designer_invoices);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDesigner, setSelectedDesigner] = useState("");
  const [ShowAddInvoice, setShowAddInvoice] = useState(false);
  const [invoiceComment, setInvoiceComment] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState(designer_invoices);

  useEffect(() => {
    setAllInvoices(designer_invoices);
    setFilteredInvoices(designer_invoices);
  }, [designer_invoices]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDesignerChange = (e) => {
    setSelectedDesigner(e.target.value);
  };

  const handleSave = async () => {
    const random_id = wooconvo_makeid();
    const invoice_id = `INV-${random_id}`;
    try {
      const formData = new FormData();
      formData.append("invoice_id", invoice_id);
      formData.append("designer", selectedDesigner);
      formData.append("comment", invoiceComment);
      formData.append("file", selectedFile);

      const response = await fetch(
        `${siteurl}/wp-json/jobdone/v1/save-invoice`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        // Show success message to user
        toast.success(data.message);
        setAllInvoices(data.invoices);
        setFilteredInvoices(data.invoices);
      } else {
        // Show error message to user
        toast.error(data.message);
      }
    } catch (error) {
      // Show error message to user
      console.error("An error occurred while saving the invoice:", error);
    }
  };

  const renderInvoices = () => {
    return filteredInvoices.map((invoice) => (
      <tr key={invoice.invoice_id}>
        <td>{invoice.comment}</td>
        <td>
          <Button
            style={{
              background: get_setting("download_button_bg_color"),
              color: get_setting("download_button_font_color"),
              border: "none",
            }}
            target="__blank"
            href={invoice.invoice_url}
          >
            Download
          </Button>
        </td>
        <td>{invoice.designer}</td>
        <td>{invoice.invoice_date}</td>
        {UserRole === "admin" && (
          <td>
            <Button
              style={{
                background: get_setting("delect_button_bg_color"),
                color: get_setting("delect_button_font_color"),
                border: "none",
              }}
              onClick={() => onInvoiceDelete(invoice.post_id)}
            >
              Delete
            </Button>
          </td>
        )}
      </tr>
    ));
  };

  const enableAddInvoices = () => {
    return !ShowAddInvoice && UserRole === "admin";
  };

  const handleDesignerChangeFilter = (e) => {
    const designer_id = Number(e.target.value);
    setSelectedDesigner(designer_id);
    const invoices = [...AllInvoices];
    if (!designer_id) return setFilteredInvoices(invoices);
    const filteredInvoices = invoices.filter(
      (invoice) => Number(invoice.designer_id) === designer_id
    );
    setFilteredInvoices(filteredInvoices);
  };

  return (
    <div className="container mt-4">
      {enableAddInvoices() && (
        <div className="d-flex mb-3 justify-content-between">
          <Button
          style={{
            background: get_setting("addnew_invoice_button_bg_color"),
            color: get_setting("addnew_invoice_button_font_color"),
            border: "none",
          }}
            //className="btn btn-info"
            onClick={() => setShowAddInvoice(!ShowAddInvoice)}
          >
            Add New Invoice
          </Button>
          {UserRole === "admin" && (
            <div className="me-3">
              <label htmlFor="designerFilter" className="me-2">
                Designers:
              </label>
              <select
                id="designerFilter"
                value={selectedDesigner}
                onChange={handleDesignerChangeFilter}
              >
                {DesignerUsers.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.display_name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
      {ShowAddInvoice && (
        <div className="row mb-3">
          <div className="form-group">
            <label htmlFor="file-input">Select file:</label>
            <input
              type="file"
              className="form-control-file"
              id="file-input"
              onChange={handleFileChange}
            />
          </div>
          <div className="col-md-3">
            <label className="font-weight-bold">Invoice Comment:</label>
            <input
              type="text"
              className="form-control"
              value={invoiceComment}
              onChange={(e) => setInvoiceComment(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="font-weight-bold">Select Designer:</label>
            <select
              className="form-control"
              value={selectedDesigner}
              onChange={handleDesignerChange}
            >
              {designer_users.map((designer) => (
                <option key={designer.id} value={designer.id}>
                  {designer.display_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3 align-self-end">
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
            <button
              className="btn btn-danger m-1"
              onClick={() => setShowAddInvoice(!ShowAddInvoice)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div class="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>{get_setting("label_invoice_comment")}</th>
              <th>{get_setting("label_invoice_download")}</th>
              <th>{get_setting("label_invoice_designer")}</th>
              <th>{get_setting("label_invoice_upload_date")}</th>
              {UserRole === "admin" && (
                <td>{get_setting("label_invoice_delect")}</td>
              )}
            </tr>
          </thead>
          <tbody>{renderInvoices()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default DesignerInvoices;
