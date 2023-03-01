import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";

const MyJobsView = ({ jobs, Statuses, onJobUpdate }) => {
  const [MyJobs, setMyJobs] = useState([]);
  const [selectedJobStatus, setSelectedJobStatus] = useState("");
  const [selectedJobID, setSelectedJobID] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  useEffect(() => {
    setMyJobs(jobs);
  }, [jobs]);

  const handleJobStatusChange = (e) => {
    const status = e.target.value;
    setSelectedJobStatus(status);
    if (!status) return setFilteredJobs(MyJobs);
    const filteredJobs = jobs.filter((job) => job.jobStatus === status);
    setFilteredJobs(filteredJobs);
  };

  const handlejobIDFilter = (e) => {
    const jobid = e.target.value;
    setSelectedJobID(jobid);
    const all_jobs = [...MyJobs];
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

  // const updateJob = (job) => {
  //   setSelectedJob(job);
  //   setShowModal(true);
  // };

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
            <th>Job Status</th>
            <th>Comment & Notify</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map((job) => (
            <tr key={job.jobID}>
              <td>{job.orderID}</td>
              <td>{job.productID}</td>
              <td dangerouslySetInnerHTML={{ __html: job.jobPrice }} />
              <td>{job.designerEmail}</td>
              <td>{job.jobStatus}</td>
              <td>
                <Button
                  variant="success"
                  onClick={() => onJobUpdate(job.orderID)}
                >
                  Update File
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default MyJobsView;
