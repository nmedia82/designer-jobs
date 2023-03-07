import React, { useState, useEffect } from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import useLocalStorage from "./../services/useLocalStorage";
import OpenJobsView from "./OpenJobs";
import AllPickedJobs from "./AllPickedJobs";
import data from "./../services/data.json";
import MyJobsView from "./MyJobs";
import CompletedJobsView from "./CompletedJobs";
import { getUserRole } from "../services/auth";
import AdminSettings from "./Settings";
import OrderConvoHome from "../orderthread/Index";
import { getStatuses } from "../services/localStorage";
import { _to_options } from "../services/helper";
import {
  getJobsInfo,
  getOpenJobs,
  getMyJobs,
  getCompletedJobs,
} from "../services/model";
// import AllOrders from "./AllOrders";

function Dashboard({ onLogout, User }) {
  const [view, setView] = useState("openjobs");
  const [OpenJobs, setOpenJobs] = useState([]);
  const [MyPickedJobs, setMyPickedJobs] = useState([]);
  const [CompletedJobs, setCompletedJobs] = useState([]);
  const [JobSelected, setJobSelected] = useState(null);
  const [Settings, setSettings] = useLocalStorage("designjob_settings", {});
  const [MyJobs, setMyJobs] = useLocalStorage("myJobs", []);
  const [MyRequests, setMyRequests] = useLocalStorage("myRequests", []);
  const [Statuses, setStatuses] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setSettings(data.settings);

      let statuses = getStatuses();
      statuses = _to_options(statuses);
      setStatuses(statuses);

      let { data: open_jobs } = await getOpenJobs();
      // since we are getting jobs in object format from server
      open_jobs = Object.values(open_jobs);
      setOpenJobs(open_jobs);

      let { data: picked_jobs } = await getMyJobs();
      // since we are getting jobs in object format from server
      picked_jobs = Object.values(picked_jobs);
      setMyPickedJobs(picked_jobs);

      let { data: completed_jobs } = await getCompletedJobs();
      // since we are getting jobs in object format from server
      completed_jobs = Object.values(completed_jobs);
      setCompletedJobs(completed_jobs);

      // get user jobs info
      const { data: jobs_info } = await getJobsInfo();
      // console.log(jobs_info);
      setMyRequests(jobs_info.my_requests);
      setMyJobs(jobs_info.my_jobs);
    };

    loadData();
  }, [setSettings]);

  const handleViewChange = (view) => {
    setView(view);
  };

  const handleSettingsChange = (settings) => {
    setSettings(settings);
  };

  const handleJobUpdate = (order_id) => {
    setJobSelected(order_id);
    handleViewChange("orderconvo");
  };

  const handleMyJobs = (jobs, id) => {
    // once jobs is picked, removed from open
    // console.log(id);
    let open_jobs = [...OpenJobs];
    open_jobs = open_jobs.filter((j) => j.OrderID !== id);
    setOpenJobs(open_jobs);
    setMyJobs(jobs);
  };

  const handleJobRequest = (jobs) => {
    setMyRequests(jobs);
  };

  const handleJobBack = () => {
    setJobSelected(null);
    handleViewChange("myjobs");
  };

  const handleOrderStatusUpdate = (order_id) => {
    const my_jobs = [...MyPickedJobs];
    const found = my_jobs.find((job) => job.orderID === Number(order_id));
    // console.log(MyPickedJobs, order_id, found);
    const index = my_jobs.indexOf(found);
    found["jobStatus"] = "wc-send";
    my_jobs[index] = { ...found };
    setMyPickedJobs(my_jobs);
  };

  const renderView = () => {
    switch (view) {
      case "openjobs":
        return (
          <OpenJobsView
            jobs={OpenJobs}
            MyJobs={MyJobs}
            MyRequests={MyRequests}
            onMyJob={handleMyJobs}
            onMyRequest={handleJobRequest}
          />
        );
      case "allpickedjobs":
        return <AllPickedJobs jobs={MyPickedJobs} Statuses={Statuses} />;
      case "myjobs":
        return (
          <MyJobsView
            jobs={MyPickedJobs}
            Statuses={Statuses}
            onJobUpdate={handleJobUpdate}
          />
        );
      case "completedjobs":
        return (
          <CompletedJobsView
            jobs={CompletedJobs}
            Statuses={Statuses}
            onJobUpdate={handleJobUpdate}
          />
        );
      case "allorders":
        return null;
      case "orderconvo":
        return (
          <OrderConvoHome
            OrderID={JobSelected}
            onBack={() => handleJobBack(null)}
            onOrderStatusUpdate={handleOrderStatusUpdate}
          />
        );
      case "settings":
        return (
          <AdminSettings
            Settings={Settings}
            onSettingsChange={handleSettingsChange}
          />
        );
      default:
        return null;
    }
  };

  const UserRole = getUserRole();

  return (
    <Container>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">DesignerPicker</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => handleViewChange("openjobs")}>
                Open Jobs
              </Nav.Link>
              {UserRole === "admin" && (
                <>
                  <Nav.Link onClick={() => handleViewChange("allpickedjobs")}>
                    Picked Jobs
                  </Nav.Link>
                  <Nav.Link onClick={() => handleViewChange("allorders")}>
                    Back to Orders
                  </Nav.Link>
                </>
              )}
              {UserRole === "designer" && (
                <Nav.Link onClick={() => handleViewChange("myjobs")}>
                  My Jobs
                </Nav.Link>
              )}
            </Nav>
            <Nav>
              <NavDropdown
                title={`Hi, ${User.data.display_name}`}
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item
                  href="#"
                  onClick={() => handleViewChange("settings")}
                >
                  Settings
                </NavDropdown.Item>
                <NavDropdown.Item href="#" onClick={onLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="container mt-4">{renderView()}</div>
    </Container>
  );
}

export default Dashboard;
