import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Col,
  Container,
  Card,
  Row,
} from "react-bootstrap";

const MyJobs = ({ jobs, Statuses }) => {
  const [AllJobs, setAllJobs] = useState([]);
  const [selectedJobStatus, setSelectedJobStatus] = useState("");
  const [selectedJobID, setSelectedJobID] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [Comment, setComment] = useState("");

  useEffect(() => {
    setAllJobs(jobs);
  }, [jobs]);

  const handleJobStatusChange = (e) => {
    const status = e.target.value;
    setSelectedJobStatus(status);
    if (!status) return setFilteredJobs(AllJobs);
    const filteredJobs = jobs.filter((job) => job.jobStatus === status);
    setFilteredJobs(filteredJobs);
  };

  const handlejobIDFilter = (e) => {
    const jobid = e.target.value;
    setSelectedJobID(jobid);
    const all_jobs = [...AllJobs];
    if (!jobid) return setFilteredJobs(all_jobs);
    const filteredJobs = all_jobs.filter((job) =>
      matchSearch(job.orderID, jobid)
    );
    setFilteredJobs(filteredJobs);
  };

  const matchSearch = (text, testwith) => {
    const regex = new RegExp("(?:^|\\s)" + text, "gi");
    return regex.test(testwith);
  };

  const updateJob = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  return (
    <div>
      <h3>All Picked Jobs</h3>
      <div className="d-flex mb-3">
        <div className="me-3">
          <label htmlFor="jobStatusFilter" className="me-2">
            Job Status:
          </label>
          <select
            id="jobStatusFilter"
            value={selectedJobStatus}
            onChange={handleJobStatusChange}
          >
            <option value="">All</option>
            <option value="approved">Approved</option>
            <option value="revise">Revise</option>
            <option value="processing">Processing</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label htmlFor="jobIDFilter" className="me-2">
            Job ID:
          </label>
          <input
            id="jobIDFilter"
            type="text"
            value={selectedJobID}
            onChange={handlejobIDFilter}
          />
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product ID</th>
            <th>Job Price</th>
            <th>Designer Email</th>
            <th>Job Status</th>
            <th>Comment & Notify</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map((job, index) => (
            <tr key={job.orderID}>
              <td>{job.orderID}</td>
              <td>{job.productID}</td>
              <td>{job.jobPrice}</td>
              <td>{job.designerEmail}</td>
              <td>{job.jobStatus}</td>
              <td>
                <Button variant="success" onClick={() => updateJob(job)}>
                  Update File
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Render modal */}

      {selectedJob && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Job #{selectedJob.orderID}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col>
                  <Card bg="secondary" border="dark">
                    <Card.Body className="d-flex align-items-center justify-content-center">
                      <Button variant="primary">Upload file</Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <h4>Files:</h4>
                  {selectedJob.designerFiles.map((file, index) => (
                    <div key={index}>
                      <a href={file} target="_blank" rel="noreferrer">
                        File {index + 1}
                      </a>
                    </div>
                  ))}
                </Col>
              </Row>
            </Container>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => setShowModal(false)}>
              Notify Admin
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default MyJobs;
