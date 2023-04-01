import { ReadMore } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import ReadMoreText from "../common/ReadMore";
import { get_job_thumb } from "../services/helper";
import { getJobByDate } from "../services/model";

const CancelledJobsView = ({ jobs, DesignerUsers, UserRole }) => {
  const [CancelledJobs, setCancelledJobs] = useState([]);
  const [selectedDesigner, setSelectedDesigner] = useState("");
  const [selectedJobID, setSelectedJobID] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [DateAfter, setDateAfter] = useState("");
  const [DateBefore, setDateBefore] = useState("");
  const [IsFilter, setIsFilter] = useState(false);

  useEffect(() => {
    setCancelledJobs(jobs);
    setFilteredJobs(jobs);
  }, [jobs]);

  const handleDesignerChangeFilter = (e) => {
    const designer_id = Number(e.target.value);
    // console.log(jobs, designer_id);
    setSelectedDesigner(designer_id);
    const cancelled_jobs = [...CancelledJobs];
    if (!designer_id) return setFilteredJobs(cancelled_jobs);
    const filteredJobs = jobs.filter(
      (job) => job.jobDesigner.ID === designer_id
    );
    setFilteredJobs(filteredJobs);
  };

  const handlejobIDFilter = (e) => {
    const jobid = e.target.value;
    setSelectedJobID(jobid);
    const all_jobs = [...CancelledJobs];
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
      const jobs = [...CancelledJobs];
      setFilteredJobs(jobs);
      setIsFilter(!IsFilter);
      return;
    }

    setIsFilter(true);

    const { data: filtered } = await getJobByDate(
      "Cancelled",
      DateAfter,
      DateBefore
    );
    setFilteredJobs(filtered);
  };

  const getDisplayName = (job) => {
    const displayName = job?.jobDesigner?.data?.display_name ?? "";
  };
  return (
    <div>
      <h3>Cancelled Jobs</h3>
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
      <div class="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Order ID</th>
              <th>Job Price</th>
              <th>Client Comments</th>
              <th>Download File</th>
              <th>Date Cancelled</th>
              {UserRole === "admin" && <th>Designer Name</th>}
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job.jobID}>
                <td>{job.jobID}</td>
                <td>{job.orderDate}</td>
                <td dangerouslySetInnerHTML={{ __html: job.jobPrice }} />
                <td>
                  <ReadMoreText text={job.clientComment} maxLength={20} />
                </td>
                <td className="text-center">
                  <a href={job.fileDownlload} target="_blank" rel="noreferrer">
                    {get_job_thumb(job)}
                  </a>
                </td>
                <td>{job.dateCancelled}</td>
                {UserRole === "admin" && <td>{getDisplayName(job)}</td>}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default CancelledJobsView;
