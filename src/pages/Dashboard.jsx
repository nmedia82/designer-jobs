import React, { useState, useEffect } from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import useLocalStorage from "./../services/useLocalStorage";
import OpenJobsView from "./OpenJobs";
import AllPickedJobs from "./AllPickedJobs";
import data from "./../services/data.json";
import MyJobs from "./MyJobs";
import { getUserRole } from "../services/auth";
import AdminSettings from "./Settings";
import OrderConvoHome from "../orderthread/Index";
import { getStatuses } from "../services/localStorage";
import { _to_options } from "../services/helper";
import { getOpenJobs } from "../services/model";
// import AllOrders from "./AllOrders";

function Dashboard({ onLogout, User }) {
  const [view, setView] = useState("openjobs");
  const [OpenJobs, setOpenJobs] = useState([]);
  const [JobSelected, setJobSelected] = useState(null);
  const [Settings, setSettings] = useLocalStorage("designjob_settings", {});
  const [Statuses, setStatuses] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setSettings(data.settings);

      let statuses = getStatuses();
      statuses = _to_options(statuses);
      setStatuses(statuses);

      const { data: open_jobs } = await getOpenJobs();
      setOpenJobs(open_jobs);
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

  const handleJobBack = () => {
    setJobSelected(null);
    handleViewChange("myjobs");
  };

  const renderView = () => {
    switch (view) {
      case "openjobs":
        return <OpenJobsView jobs={OpenJobs} />;
      case "allpickedjobs":
        return <AllPickedJobs jobs={data.pickedJobs} Statuses={Statuses} />;
      case "myjobs":
        return (
          <MyJobs
            jobs={data.pickedJobs}
            Statuses={Statuses}
            onJobUpdate={handleJobUpdate}
          />
        );
      case "allorders":
        return <OpenJobs />;
      case "orderconvo":
        return (
          <OrderConvoHome
            OrderID={JobSelected}
            onBack={() => handleJobBack(null)}
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
        return <OpenJobsView />;
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
