import React, { useState } from "react";
import { Container, Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import AllJobs from "./AllJobs";
// import MyJobs from "./MyJobs";
// import AllOrders from "./AllOrders";

function Dashboard() {
  const [view, setView] = useState("alljobs");

  const handleViewChange = (view) => {
    setView(view);
  };

  const renderView = () => {
    switch (view) {
      case "alljobs":
        return <AllJobs />;
      case "myjobs":
        return <AllJobs />;
      case "allorders":
        return <AllJobs />;
      default:
        return <AllJobs />;
    }
  };

  return (
    <Container>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#">My App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link onClick={() => handleViewChange("alljobs")}>
              All Jobs
            </Nav.Link>
            <Nav.Link onClick={() => handleViewChange("myjobs")}>
              My Jobs
            </Nav.Link>
            <Nav.Link onClick={() => handleViewChange("allorders")}>
              All Orders
            </Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown
              title={`Hi, ${localStorage.getItem("username")}`}
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item href="#">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#">Settings</NavDropdown.Item>
              <NavDropdown.Item href="#">Help</NavDropdown.Item>
            </NavDropdown>
            <Button
              variant="outline-danger"
              onClick={() => localStorage.clear()}
              className="ml-2"
            >
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="container mt-4">{renderView()}</div>
    </Container>
  );
}

export default Dashboard;
