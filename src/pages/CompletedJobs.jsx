import { ReadMore } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import ReadMoreText from "../common/ReadMore";
import { getJobByDate } from "../services/model";

const CompletedJobsView = ({ jobs, DesignerUsers, UserRole, onJobUpdate }) => {
  const [CompletedJobs, setCompletedJobs] = useState([]);
  const [selectedDesigner, setSelectedDesigner] = useState("");
  const [selectedJobID, setSelectedJobID] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [DateAfter, setDateAfter] = useState("");
  const [DateBefore, setDateBefore] = useState("");
  const [IsFilter, setIsFilter] = useState(false);

  useEffect(() => {
    setCompletedJobs(jobs);
    setFilteredJobs(jobs);
  }, [jobs]);

  const handleDesignerChangeFilter = (e) => {
    const designer_id = Number(e.target.value);
    // console.log(jobs, designer_id);
    setSelectedDesigner(designer_id);
    const completed_jobs = [...CompletedJobs];
    if (!designer_id) return setFilteredJobs(completed_jobs);
    const filteredJobs = jobs.filter(
      (job) => job.jobDesigner.ID === designer_id
    );
    setFilteredJobs(filteredJobs);
  };

  const handlejobIDFilter = (e) => {
    const jobid = e.target.value;
    setSelectedJobID(jobid);
    const all_jobs = [...CompletedJobs];
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

  const handleDateFilter = async () => {
    if (IsFilter) {
      const jobs = [...CompletedJobs];
      setFilteredJobs(jobs);
      setIsFilter(!IsFilter);
      return;
    }

    setIsFilter(true);

    const { data: filtered } = await getJobByDate(
      "completed",
      DateAfter,
      DateBefore
    );
    setFilteredJobs(filtered);
  };

  const getButtonTitle = () => {
    if (UserRole === "admin") return "Comment";
    return "Update File";
  };

  return (
    <div>
      <h3>Completed Jobs</h3>
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
      <p>Total Jobs: {filteredJobs.length}</p>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Job Price</th>
            <th>Client Comments</th>
            {UserRole === "customer" && <th>Case No</th>}
            <th>Download File</th>
            <th>Date Completed</th>
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
              <td>{job.dateCompleted}</td>
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

export default CompletedJobsView;
