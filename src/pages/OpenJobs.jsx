import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Container } from "react-bootstrap";
import { getUserRole } from "../services/auth";

const UserRole = getUserRole();
const OpenJobs = ({ jobs }) => {
  const [openJobs, setOpenJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    setOpenJobs(jobs);
  }, [jobs]);

  const handleRequestPick = (id) => {
    // Do something with the order ID
    console.log(`Requesting pick for order ${id}`);
  };

  const handleSeeRequests = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  return (
    <div>
      <h2>All Jobs</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Product Name</th>
            <th>Product Price</th>
            <th>Comments</th>
            <th>Download File</th>
            {UserRole === "designer" && <th>Request a Pick</th>}
            {UserRole === "admin" && <th>See Requests</th>}
          </tr>
        </thead>
        <tbody>
          {openJobs.map((job) => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.orderDate}</td>
              <td>{job.productName}</td>
              <td>{job.jobPrice}</td>
              <td>{job.comments}</td>
              <td>
                <a href={job.fileUrl} target="_blank" rel="noreferrer">
                  Download File
                </a>
              </td>
              <td>
                {UserRole === "designer" && (
                  <Button onClick={() => handleRequestPick(job.id)}>
                    Request a Pick
                  </Button>
                )}
                {UserRole === "admin" && (
                  <Button onClick={() => handleSeeRequests(job)}>
                    See Requests
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Render modal */}

      {selectedJob && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Job #{selectedJob.id}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <p className="d-flex">
                <input
                  type="text"
                  className="form-control m-1"
                  placeholder="Pick your self: email"
                />
                <Button className="btn-sm">Select</Button>
              </p>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Select User</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedJob.pickekRequests.map((user) => (
                    <tr key={user.id}>
                      <td>{user.user_name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Button variant="primary">Select User</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Container>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            {/* <Button variant="primary" onClick={() => setShowModal(false)}>
              Notify Designer
            </Button> */}
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default OpenJobs;
