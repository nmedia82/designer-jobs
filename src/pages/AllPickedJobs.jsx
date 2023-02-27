import React, { useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Col,
  Container,
  Row,
} from "react-bootstrap";

const AllPickedJobs = ({ jobs, Statuses }) => {
  const [AllJobs, setAllJobs] = useState(jobs);
  const [selectedJobStatus, setSelectedJobStatus] = useState("");
  const [selectedDesignerEmail, setSelectedDesignerEmail] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [Comment, setComment] = useState("");

  const handleJobStatusChange = (e) => {
    const status = e.target.value;
    setSelectedJobStatus(status);
    if (!status) return setFilteredJobs(AllJobs);
    const filteredJobs = jobs.filter((job) => job.jobStatus === status);
    setFilteredJobs(filteredJobs);
  };

  const handleDesignerEmailFilter = (e) => {
    const email = e.target.value;
    setSelectedDesignerEmail(email);
    if (!email) return setFilteredJobs(AllJobs);
    const filteredJobs = jobs.filter((job) =>
      matchSearch(email, job.designerEmail)
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

  const handleNewComment = (e) => {
    e.preventDefault();

    const job = selectedJob;
    job.comments = [...job.comments, Comment];
    // console.log(job);
    setComment("");
    setSelectedJob(job);
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
            {Statuses.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="designerEmailFilter" className="me-2">
            Designer Email:
          </label>
          <input
            id="designerEmailFilter"
            type="text"
            value={selectedDesignerEmail}
            onChange={handleDesignerEmailFilter}
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
                  Comment & Notify
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
                  <h4>Comments:</h4>
                  {selectedJob.comments.map((comment, index) => (
                    <div key={index}>
                      <p>{comment}</p>
                    </div>
                  ))}
                  <Form onSubmit={handleNewComment}>
                    <Form.Group controlId="comment">
                      <Form.Control
                        type="text"
                        placeholder="Add comment"
                        value={Comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </Form.Group>
                    <Button type="submit" className="mt-3">
                      Add Comment
                    </Button>
                  </Form>
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
            <Form.Select defaultValue={selectedJob.jobStatus}>
              {Statuses.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => setShowModal(false)}>
              Notify Designer
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default AllPickedJobs;
