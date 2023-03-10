import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import ReadMoreText from "../common/ReadMore";
import { getJobByDate, requestJob } from "../services/model";

const OpenJobsView = ({ jobs, MyRequests, UserRole, UserID }) => {
  const [openJobs, setOpenJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [DateAfter, setDateAfter] = useState("");
  const [DateBefore, setDateBefore] = useState("");
  const [IsFilter, setIsFilter] = useState(false);

  useEffect(() => {
    // remove jobs which are picked by me
    setOpenJobs(jobs);
  }, [jobs]);

  const handleRequestPick = async (job_id) => {
    // Do something with the order ID
    const { data } = await requestJob(job_id, UserID);
    const { data: response } = data;
    toast.success(response.message);
    if (response.reload) return window.location.reload();
  };

  const handleUserPickedByAdmin = async (job_id, designer_id) => {
    // Do something with the order ID
    const { data } = await requestJob(job_id, designer_id);
    const { data: response } = data;
    toast.success(response.message);
    if (response.reload) return window.location.reload();
  };

  const canRequest = (order_id) => {
    // console.log(MyRequests, order_id);
    if (MyRequests.includes(order_id)) return true;
    return false;
  };

  const handleSeeRequests = (job) => {
    console.log(job);
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleDateFilter = async () => {
    if (IsFilter) {
      setOpenJobs(jobs);
      setIsFilter(!IsFilter);
      return;
    }
    setIsFilter(true);
    const { data: filtered } = await getJobByDate(
      "open",
      DateAfter,
      DateBefore
    );
    setOpenJobs(filtered);
    // console.log(jobs);
  };

  return (
    <div>
      <h2>All Jobs</h2>
      <div className="d-flex">
        <div className="me-3">
          <label htmlFor="jobIDFilter" className="me-2">
            Dates
          </label>
          <input
            id="DateAfter"
            type="date"
            value={DateAfter}
            onChange={(e) => setDateAfter(e.target.value)}
          />{" "}
          -
          <input
            id="DateBefore"
            type="date"
            value={DateBefore}
            onChange={(e) => setDateBefore(e.target.value)}
          />
          <button
            className="btn btn-info btn-sm m-1"
            onClick={handleDateFilter}
          >
            {IsFilter ? "Reset Filter" : "Filter"}
          </button>
        </div>
      </div>
      <p>Total Jobs: {openJobs.length}</p>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Product Name</th>
            <th>Job Price</th>
            <th>Client Comments</th>
            {UserRole === "customer" && <th>Case No</th>}
            <th>Download File</th>
            {UserRole === "designer" && <th>Request a Pick</th>}
            {UserRole === "admin" && <th>See Requests</th>}
          </tr>
        </thead>
        <tbody>
          {openJobs.map((job) => (
            <tr key={job.jobID}>
              <td>{job.jobID}</td>
              <td>{job.orderID}</td>
              <td>{job.orderDate}</td>
              <td>{job.itemName}</td>
              <td dangerouslySetInnerHTML={{ __html: job.jobPrice }} />
              <td>
                <ReadMoreText text={job.clientComment} maxLength={20} />
              </td>
              {UserRole === "customer" && <td>{job.caseNo}</td>}
              <td>
                <a href={job.fileDownlload} target="_blank" rel="noreferrer">
                  <img src={job.fileThumb} alt={job.itemName} />
                </a>
              </td>
              <td>
                {UserRole === "designer" && (
                  <Button
                    onClick={() => handleRequestPick(job.orderID)}
                    disabled={canRequest(job.orderID)}
                  >
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
            <Modal.Title>Job# {selectedJob.orderID}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              {/* <p className="d-flex">
                <input
                  type="text"
                  className="form-control m-1"
                  placeholder="Pick your self: email"
                />
                <Button className="btn-sm">Select</Button>
              </p> */}
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Select User</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedJob.pickedRequests.map((user) => (
                    <tr key={user.id}>
                      <td>{user.data.user_login}</td>
                      <td>{user.data.user_email}</td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleUserPickedByAdmin(
                              selectedJob.orderID,
                              user.ID
                            )
                          }
                        >
                          Select User
                        </Button>
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

export default OpenJobsView;
