import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Container } from "react-bootstrap";
import ReadMoreText from "../common/ReadMore";
import { toast } from "react-toastify";
import { changeDesigner, getJobByDate } from "../services/model";
import { get_job_thumb, get_setting } from "../services/helper";
import { Settings } from "@mui/icons-material";

const InProgressJobsView = ({
  jobs,
  Statuses,
  onJobUpdate,
  UserRole,
  DesignerUsers,
}) => {
  const [MyJobs, setMyJobs] = useState([]);
  const [selectedJobStatus, setSelectedJobStatus] = useState("");
  const [selectedJobID, setSelectedJobID] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [DateAfter, setDateAfter] = useState("");
  const [DateBefore, setDateBefore] = useState("");
  const [IsFilter, setIsFilter] = useState(false);
  const [selectedDesigner, setSelectedDesigner] = useState("");
  // it's for Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    setMyJobs(jobs);
    setFilteredJobs(jobs);
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

  const handleDesignerChangeFilter = (e) => {
    const designer_id = Number(e.target.value);
    setSelectedDesigner(designer_id);
    const inprogress_jobs = [...MyJobs];
    if (!designer_id) return setFilteredJobs(inprogress_jobs);
    const filteredJobs = jobs.filter(
      (job) => job.jobDesigner.ID === designer_id
    );
    console.log(MyJobs, designer_id);
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

  const handleSeeRequests = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleDesignerChange = async (job_id, designer_id) => {
    // Do something with the order ID
    const { data } = await changeDesigner(job_id, designer_id);
    const { data: response } = data;
    // console.log(response);
    toast.success("Designer changed successully");
    return window.location.reload();
  };
  function getStatusColor(status) {
    if (status === "send") {
      return "purple";
    } else if (status === "in progress") {
      return "black";
    } else {
      return "white";
    }
  }

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
          <Button
            style={{
              background: get_setting("filter_button_bg_color"),
              color: get_setting("filter_button_font_color"),
              marginLeft: "10px",
              border: "none",
            }}
          >
            {IsFilter ? "Reset Filter" : "Filter"}
          </Button>
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
              <th>{get_setting("label_job_id")}</th>
              <th>{get_setting("label_job_order_date")}</th>
              <th>{get_setting("label_job_status")}</th>
              {UserRole !== "customer" && (
                <th>{get_setting("label_job_price")}</th>
              )}
              <th>{get_setting("label_client_comments")}</th>
              {UserRole === "customer" && <th>Case No</th>}
              <th>{get_setting("label_download_file")}</th>
              <th>{get_setting("label_comment_notify")}</th>
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
                <td
                  style={{
                    background: getStatusColor(job.jobStatus),
                    color: "white",
                  }}
                >
                  {getStatusLabel(job.jobStatus)}
                </td>
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
                    <p>
                      {job?.jobDesigner?.data?.display_name ||
                        job?.jobDesigner?.data?.user_email}
                      <Button
                        style={{
                          marginLeft: "10px",
                          background: get_setting("designer_button_bg_color"),
                          color: get_setting("designer_button_font_color"),
                          border: "none",
                        }}
                        onClick={() => handleSeeRequests(job)}
                      >
                        Change Designer
                      </Button>
                    </p>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Change Designer */}

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
                  {DesignerUsers.filter((user) => user.id !== 0).map((user) => (
                    <tr key={user.id}>
                      <td>{user.display_name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleDesignerChange(selectedJob.orderID, user.id)
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

export default InProgressJobsView;
