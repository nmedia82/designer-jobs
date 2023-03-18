import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { wooconvo_makeid } from "../services/helper";
import pluginData from "./../services/data.json";

const { siteurl } = pluginData;

function DesignerInvoices({
  designer_invoices,
  designer_users,
  onInvoiceDelete,
  UserRole,
}) {
  const [AllInvoices, setAllInvoices] = useState(designer_invoices);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDesigner, setSelectedDesigner] = useState("");
  const [ShowAddInvoice, setShowAddInvoice] = useState(false);
  const [invoiceComment, setInvoiceComment] = useState("");

  useEffect(() => {
    setAllInvoices(designer_invoices);
  }, [designer_invoices]);

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
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
    return AllInvoices.map((invoice) => (
      <tr key={invoice.invoice_id}>
        <td>{invoice.invoice_id}</td>
        <td>
          <a
            target="__blank"
            href={invoice.invoice_url}
            className="btn btn-info"
          >
            Download
          </a>
        </td>
        <td>{invoice.designer}</td>
        <td>{invoice.invoice_date}</td>
        <td>
          <button
            className="btn btn-danger"
            onClick={() => onInvoiceDelete(invoice.post_id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ));
  };

  const enableAddInvoices = () => {
    return !ShowAddInvoice && UserRole === "admin";
  };

  return (
    <div className="container mt-4">
      {enableAddInvoices() && (
        <div className="d-flex mb-3 justify-content-between">
          <button
            className="btn btn-info"
            onClick={() => setShowAddInvoice(!ShowAddInvoice)}
          >
            Add New Invoice
          </button>
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

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Download</th>
            <th>Designer</th>
            <th>Invoice Date</th>
          </tr>
        </thead>
        <tbody>{renderInvoices()}</tbody>
      </table>
    </div>
  );
}

export default DesignerInvoices;
