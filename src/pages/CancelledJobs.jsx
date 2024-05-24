import React, { useState, useEffect } from "react";
import { Button, Container, Modal, Table } from "react-bootstrap";
import ReadMoreText from "../common/ReadMore";
import { get_setting } from "../services/helper";
import { getJobByDate } from "../services/model";
import FileDownloads from "../common/FileDownloads";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CancelledJobsView = ({ jobs, DesignerUsers, UserRole, jobidParam }) => {
  const [CancelledJobs, setCancelledJobs] = useState([]);
  const [selectedDesigner, setSelectedDesigner] = useState("");
  const [selectedJobID, setSelectedJobID] = useState(jobidParam || "");
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [DateAfter, setDateAfter] = useState("");
  const [DateBefore, setDateBefore] = useState("");
  const [IsFilter, setIsFilter] = useState(false);
  const [showModalMoreInfo, setShowModalMoreInfo] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    setCancelledJobs(jobs);
    setFilteredJobs(jobs);
    if (jobidParam) {
      handleJobIDFilter({ target: { value: jobidParam } });
    }
  }, [jobs, jobidParam]);

  const handleDesignerChangeFilter = (e) => {
    const designer_id = Number(e.target.value);
    setSelectedDesigner(designer_id);
    const cancelled_jobs = [...CancelledJobs];
    if (!designer_id) return setFilteredJobs(cancelled_jobs);
    const filteredJobs = cancelled_jobs.filter(
      (job) => job.jobDesigner.ID === designer_id
    );
    setFilteredJobs(filteredJobs);
  };

  const handleJobIDFilter = (e) => {
    const jobid = e.target.value;
    setSelectedJobID(jobid);
    const all_jobs = [...CancelledJobs];
    if (!jobid) return setFilteredJobs(all_jobs);
    const filteredJobs = all_jobs.filter((job) =>
      matchSearch(jobid, job.jobID)
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
      setIsFilter(false);
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
    return job?.jobDesigner?.data?.display_name ?? "";
  };

  const handleMoreInfo = (job) => {
    setSelectedJob(job);
    setShowModalMoreInfo(true);
  };

  return (
    <div>
      <h3>Cancelled Jobs</h3>
      <div className="d-flex mb-3 justify-content-between">
        <div className="me-3">
          <label htmlFor="DateAfter" className="me-2">
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
            onChange={handleJobIDFilter}
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
              <option value="">All</option>
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
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>{get_setting("label_job_id")}</th>
              <th>{get_setting("label_job_order_date")}</th>
              <th>{get_setting("label_product_name")}</th>
              <th>{get_setting("label_job_price")}</th>
              <th>{get_setting("label_client_comments")}</th>
              <th>{get_setting("label_download_file")}</th>
              <th>Date Cancelled</th>
              {UserRole === "admin" && (
                <th>{get_setting("label_designer_name")}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job.jobID}>
                <td>{job.jobID}</td>
                <td>{job.orderDate}</td>
                <td>{job.itemName}</td>
                <td dangerouslySetInnerHTML={{ __html: job.jobPrice }} />
                <td>
                  <ReadMoreText text={job.clientComment} maxLength={20} />
                </td>
                <td
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    cursor: "pointer",
                  }}
                  onClick={() => handleMoreInfo(job)}
                >
                  <FontAwesomeIcon
                    icon="plus-circle"
                    style={{ color: "#0B5ED7", fontSize: "2em" }}
                  />
                </td>
                <td className="text-center">
                  <FileDownloads jobData={job} />
                </td>
                <td>{job.dateCancelled}</td>
                {UserRole === "admin" && <td>{getDisplayName(job)}</td>}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {selectedJob && (
        <Modal
          show={showModalMoreInfo}
          onHide={() => setShowModalMoreInfo(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>More Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              {selectedJob.moreInfo.length > 0 ? (
                selectedJob.moreInfo.map((item, index) => (
                  <div key={index}>
                    <strong>{item.label}:</strong>{" "}
                    {Array.isArray(item.value)
                      ? item.value.join(", ")
                      : item.value}
                  </div>
                ))
              ) : (
                <p>No extra information found</p>
              )}
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModalMoreInfo(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default CancelledJobsView;
