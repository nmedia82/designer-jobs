import React, { useState } from "react";
import { Container, Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import OpenJobs from "./OpenJobs";
import AllPickedJobs from "./AllPickedJobs";
import data from "./../services/data.json";
import MyJobs from "./MyJobs";
import NavBar from "../common/NavBar";
import { getUserRole } from "../services/auth";
// import AllOrders from "./AllOrders";

function Dashboard({ onLogout, User }) {
  const [view, setView] = useState("openjobs");

  const handleViewChange = (view) => {
    setView(view);
  };

  const renderView = () => {
    switch (view) {
      case "openjobs":
        return <OpenJobs jobs={data.openJobs} />;
      case "allpickedjobs":
        return (
          <AllPickedJobs jobs={data.pickedJobs} Statuses={data.jobStatuses} />
        );
      case "myjobs":
        return <MyJobs jobs={data.pickedJobs} Statuses={data.jobStatuses} />;
      case "allorders":
        return <OpenJobs />;
      default:
        return <OpenJobs />;
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
