import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";

import ReadMoreText from "../common/ReadMore";
import { get_job_thumb, get_setting } from "../services/helper";
import { getJobByDate } from "../services/model";
import Calculator from "./Calculator";

const CompletedJobsView = ({ jobs, DesignerUsers, UserRole, onJobUpdate }) => {
  const [CompletedJobs, setCompletedJobs] = useState([]);
  const [selectedDesigner, setSelectedDesigner] = useState("");
  const [selectedJobID, setSelectedJobID] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [DateFilteredJobs, setDateFilteredJobs] = useState([]);
  const [DateAfter, setDateAfter] = useState("");
  const [DateBefore, setDateBefore] = useState("");
  const [IsFilter, setIsFilter] = useState(false);
  const [ShowCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    setCompletedJobs(jobs);
    setFilteredJobs(jobs);
  }, [jobs]);

  const handleDesignerChangeFilter = (e) => {
    const designer_id = Number(e.target.value);
    setSelectedDesigner(designer_id);
    let jobs = [];
    if (DateFilteredJobs.length) {
      jobs = [...DateFilteredJobs];
    } else {
      jobs = [...filteredJobs];
    }
    // const completed_jobs = [...filteredJobs];
    console.log(jobs);
    if (!designer_id) return setFilteredJobs(jobs);
    const filtered_jobs = jobs.filter(
      (job) => job.jobDesigner.ID === designer_id
    );
    setFilteredJobs(filtered_jobs);
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
    setDateFilteredJobs(filtered);
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
          <Button
            style={{
              background: get_setting("filter_button_bg_color"),
              color: get_setting("filter_button_font_color"),
              marginLeft: "10px",
              border: "none",
            }}
            onClick={handleDateFilter}
          >
            {IsFilter ? "Reset Filter" : "Filter"}
          </Button>
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
      <div className="d-flex mb-3 justify-content-between">
        <p>Total Jobs: {filteredJobs.length}</p>
        {UserRole !== "customer" && (
          <button
            className="btn btn-info btn-calculator"
            onClick={() => setShowCalculator(!ShowCalculator)}
          >
            {ShowCalculator ? "Close" : "Calculator"}
          </button>
        )}
      </div>
      {ShowCalculator && (
        <Calculator
          jobs={filteredJobs}
          startDate={DateAfter}
          endDate={DateBefore}
        />
      )}
      <div class="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Order Date</th>
              {UserRole !== "customer" && <th>Job Price</th>}
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
                <td>{job.orderDate}</td>
                {UserRole !== "customer" && (
                  <td dangerouslySetInnerHTML={{ __html: job.jobPrice }} />
                )}
                <td>
                  <ReadMoreText text={job.clientComment} maxLength={20} />
                </td>
                {UserRole === "customer" && <td>{job.caseNo}</td>}
                <td className="text-center">
                  <a href={job.fileDownlload} target="_blank" rel="noreferrer">
                    {get_job_thumb(job)}
                  </a>
                </td>
                <td>{job.dateCompleted}</td>
                <td style={{ textAlign: "center" }}>
                  <Button
                    style={{
                      background: get_setting("comment_button_bg_color"),
                      color: get_setting("comment_button_font_color"),
                      border: "none",
                    }}
                    onClick={() => onJobUpdate(job.orderID)}
                  >
                    {getButtonTitle()}
                  </Button>
                </td>
                {UserRole === "admin" && (
                  <td style={{ textAlign: "center" }}>
                    {job?.jobDesigner?.data?.display_name}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default CompletedJobsView;
