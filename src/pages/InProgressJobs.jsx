import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import ReadMoreText from "../common/ReadMore";
import { getJobByDate } from "../services/model";

const InProgressJobsView = ({
  jobs,
  Statuses,
  onJobUpdate,
  UserRole,
  UserID,
}) => {
  const [MyJobs, setMyJobs] = useState([]);
  const [selectedJobStatus, setSelectedJobStatus] = useState("");
  const [selectedJobID, setSelectedJobID] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [DateAfter, setDateAfter] = useState("");
  const [DateBefore, setDateBefore] = useState("");
  const [IsFilter, setIsFilter] = useState(false);

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

  function getStatusLabel(key) {
    const statusObject = Statuses.find((status) => status.value === key);
    return statusObject ? statusObject.label : "";
  }

  const handleDateFilter = async () => {
    if (IsFilter) {
      setFilteredJobs(MyJobs);
      setIsFilter(!IsFilter);
      return;
    }

    setIsFilter(true);

    const { data: jobs } = await getJobByDate(
      "progress",
      DateAfter,
      DateBefore
    );
    // setMyJobs(jobs);
    setFilteredJobs(jobs);
  };

  const getPageTitle = () => {
    if (UserRole === "admin") return "In Progess";
    return "My Jobs";
  };

  const getButtonTitle = () => {
    if (UserRole === "admin") return "Comment";
    return "Update File";
  };

  // const updateJob = (job) => {
  //   setSelectedJob(job);
  //   setShowModal(true);
  // };

  return (
    <div>
      <h3>{getPageTitle()}</h3>
      <div className="d-flex mb-3 justify-content-between">
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
        <div className="me-3">
          <label htmlFor="jobStatusFilter" className="me-2">
            Status:
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
      <p>Total Jobs: {filteredJobs.length}</p>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Jobs Status</th>
            <th>Job Price</th>
            <th>Client Comments</th>
            <th>Download File</th>
            <th>Comment & Notify</th>
            {UserRole === "admin" && <th>Designer Name</th>}
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map((job) => (
            <tr key={job.jobID}>
              <td>{job.jobID}</td>
              <td>{job.orderID}</td>
              <td>{job.orderDate}</td>
              <td>{getStatusLabel(job.jobStatus)}</td>
              <td dangerouslySetInnerHTML={{ __html: job.jobPrice }} />
              <td>
                <ReadMoreText text={job.clientComment} maxLength={20} />
              </td>
              <td>
                <a href={job.fileDownlload} target="_blank" rel="noreferrer">
                  <img src={job.fileThumb} alt={job.itemName} />
                </a>
              </td>
              <td>
                <Button
                  variant="success"
                  onClick={() => onJobUpdate(job.orderID)}
                >
                  {getButtonTitle()}
                </Button>
              </td>
              {UserRole === "admin" && (
                <td>{job.jobDesigner.data.display_name}</td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default InProgressJobsView;
