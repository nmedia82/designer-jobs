import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import ReadMoreText from "../common/ReadMore";
import { get_job_thumb, get_setting } from "../services/helper";
import { getJobByDate, requestJob } from "../services/model";
import FileDownloads from "../common/FileDownloads";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const OpenJobsView = ({
  jobs,
  MyRequests,
  UserRole,
  UserID,
  allowDesignersToPick,
  DesignerUsers,
}) => {
  const [openJobs, setOpenJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalMoreInfo, setShowModalMoreInfo] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [DateAfter, setDateAfter] = useState("");
  const [DateBefore, setDateBefore] = useState("");
  const [IsFilter, setIsFilter] = useState(false);
  const [showRequested, setShowRequested] = useState(false);

  useEffect(() => {
    let open_jobs = jobs;
    if (!showRequested && UserRole !== "customer") {
      open_jobs = jobs.filter((job) => job.isRequested === showRequested);
    }
    setOpenJobs(open_jobs);
  }, [jobs, showRequested, UserRole]);

  const handleRequestPick = async (job) => {
    let request_type = get_setting("automatic_mode") ? "direct" : "wait";
    if (job.isRequested) request_type = "wait";
    const { data } = await requestJob(job.orderID, UserID, request_type);
    const { data: response } = data;
    toast.success(response.message);
    if (response.reload) return window.location.reload();
  };

  const handleUserPickedByAdmin = async (job_id, designer_id) => {
    const request_type = "direct";
    const { data } = await requestJob(job_id, designer_id, request_type);
    const { data: response } = data;
    toast.success("Job assigned to designer");
    if (response.reload) return window.location.reload();
  };

  const disableRequest = (order_id) => {
    return MyRequests.includes(order_id) || !allowDesignersToPick;
  };

  const handleSeeRequests = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleMoreInfo = (job) => {
    setSelectedJob(job);
    setShowModalMoreInfo(true);
  };

  const handleDateFilter = async () => {
    if (IsFilter) {
      setOpenJobs(jobs);
      setIsFilter(false);
      return;
    }
    setIsFilter(true);
    const { data: filtered } = await getJobByDate(
      "open",
      DateAfter,
      DateBefore
    );
    setOpenJobs(filtered);
  };

  const getTitle = () => {
    return "Open Jobs";
  };

  const getRowBGColor = (job) => {
    return job.isRequested && UserRole !== "customer"
      ? get_setting("requested_job_bg_color", "magenta")
      : "white";
  };

  return (
    <div>
      <h2>{getTitle()}</h2>
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
        {UserRole !== "customer" && (
          <div className="me-3">
            <label htmlFor="requestedJobsFilter" className="me-2">
              <input
                type="checkbox"
                id="requestedJobsFilter"
                onChange={(e) => setShowRequested(e.target.checked)}
              />{" "}
              Requested Jobs
            </label>
          </div>
        )}
      </div>
      <p>
        Total Jobs: {openJobs.length}
        <span className="bg-light text-danger m-2">
          {!allowDesignersToPick
            ? "Sorry, you already have enough jobs open. Please finish them and request than an new  pick"
            : ""}
        </span>
      </p>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>{get_setting("label_job_id")}</th>
              <th>{get_setting("label_job_order_date")}</th>
              <th>{get_setting("label_product_name")}</th>
              {UserRole !== "customer" && (
                <th>{get_setting("label_job_price")}</th>
              )}
              <th>{get_setting("label_client_comments")}</th>
              <th>{get_setting("label_more_info")}</th>
              {UserRole === "customer" && <th>Case No</th>}
              <th>{get_setting("label_download_file")}</th>
              {UserRole !== "customer" && (
                <th>
                  {UserRole === "admin" ? "Request/Assign" : "Request a Pick"}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {openJobs.map((job, index) => (
              <tr key={index} style={{ backgroundColor: getRowBGColor(job) }}>
                <td>{job.jobID}</td>
                <td>{job.orderDate}</td>
                <td>{job.itemName}</td>
                {UserRole !== "customer" && (
                  <td dangerouslySetInnerHTML={{ __html: job.jobPrice }} />
                )}
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
                {UserRole === "customer" && <td>{job.caseNo}</td>}
                <td className="text-center">
                  <FileDownloads jobData={job} />
                </td>
                {UserRole !== "customer" && (
                  <td style={{ textAlign: "center" }}>
                    {UserRole === "admin" ? (
                      <Button
                        style={{
                          background: get_setting("request_button_bg_color"),
                          color: get_setting("request_button_font_color"),
                          border: "none",
                        }}
                        onClick={() => handleSeeRequests(job)}
                      >
                        Request/Assign
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleRequestPick(job)}
                        disabled={disableRequest(job.orderID)}
                      >
                        Request a Pick
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {selectedJob && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Job# {selectedJob.orderID}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <div className="table-responsive">
                <h3>Requests ({selectedJob.pickedRequests.length})</h3>
                <Table className="table table-striped">
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
                </Table>
              </div>
              <div className="table-responsive">
                <h3>Choose Designer ({DesignerUsers.length})</h3>
                <Table className="table table-striped">
                  <thead>
                    <tr>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Select User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DesignerUsers.filter((user) => user.id !== 0).map(
                      (user) => (
                        <tr key={user.id}>
                          <td>{user.display_name}</td>
                          <td>{user.email}</td>
                          <td>
                            <Button
                              variant="primary"
                              onClick={() =>
                                handleUserPickedByAdmin(
                                  selectedJob.orderID,
                                  user.id
                                )
                              }
                            >
                              Select User
                            </Button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </Table>
              </div>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
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

export default OpenJobsView;
