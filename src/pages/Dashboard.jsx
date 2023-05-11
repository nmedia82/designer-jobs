import React, { useState, useEffect } from "react";
import {
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Modal,
  Spinner,
} from "react-bootstrap";
import useLocalStorage from "./../services/useLocalStorage";
import OpenJobsView from "./OpenJobs";
import plugin_data from "./../services/data.json";
import InProgressJobsView from "./InProgressJobs";
import CompletedJobsView from "./CompletedJobs";
import { getUserID, getUserRole } from "../services/auth";
import AdminSettings from "../admin/Settings";
import OrderConvoHome from "../orderthread/Index";
import { getStatuses } from "../services/localStorage";
import { get_setting, _to_options } from "../services/helper";
import {
  getJobsInfo,
  getOpenJobs,
  getCompletedJobs,
  getDesignerUsers,
  getCancelledJobs,
  getInProgressJobs,
  setJobClosed,
  saveSettings,
  getSettings,
  getInvoices,
  deleteInvoice,
} from "../services/model";
import { parse } from "query-string";
import queryString from "query-string";
import CancelledJobsView from "./CancelledJobs";
import { toast } from "react-toastify";
import DesignerInvoices from "./DesignerInvoices";
import FAQ from "./FAQ";
import { NavbarLogo } from "../common/NavbarLogo";
import UserSettings from "../admin/UserSettings";
import OurDesigners from "./OurDesigners";
import AnalyticsSales from "./AnalyticSales";
import InfoPage from "./Info";
// import AllOrders from "./AllOrders";

const { siteurl, navbars: Navbars_data } = plugin_data;
const UserRole = getUserRole();
const UserID = getUserID();

function Dashboard({ onLogout, User }) {
  const [showWorking, setShowWorking] = useState(false);
  const [view, setView] = useState("openjobs");
  const [OpenJobs, setOpenJobs] = useState([]);
  const [InProgressJobs, setInProgressJobs] = useState([]);
  const [CompletedJobs, setCompletedJobs] = useState([]);
  const [CancelledJobs, setCancelledJobs] = useState([]);
  const [JobSelected, setJobSelected] = useState(null);
  const [Settings, setSettings] = useLocalStorage("jobdone_settings", {});
  const [MyJobs, setMyJobs] = useLocalStorage("myJobs", []);
  const [MyRequests, setMyRequests] = useLocalStorage("myRequests", []);
  const [Statuses, setStatuses] = useState([]);
  const [DesignerUsers, setDesignerUsers] = useState([]);
  const [Invoices, setInvoices] = useState([]);
  const urlParams = queryString.parse(window.location.search);
  const pageParam = urlParams.page;

  useEffect(() => {
    const loadData = async () => {
      setShowWorking(true);

      const { data: settings } = await getSettings();
      const { global_settings, user_settings } = settings;
      const settings_merged = {
        ...JSON.parse(global_settings),
        ...JSON.parse(user_settings),
      };
      setSettings(settings_merged);

      let statuses = getStatuses();
      statuses = _to_options(statuses);
      setStatuses(statuses);

      let { data: open_jobs } = await getOpenJobs();
      // since we are getting jobs in object format from server
      open_jobs = Object.values(open_jobs);
      setOpenJobs(open_jobs);

      let { data: inprogress_jobs } = await getInProgressJobs();
      // since we are getting jobs in object format from server
      inprogress_jobs = Object.values(inprogress_jobs);
      setInProgressJobs(inprogress_jobs);

      let { data: completed_jobs } = await getCompletedJobs();
      // since we are getting jobs in object format from server
      completed_jobs = Object.values(completed_jobs);
      setCompletedJobs(completed_jobs);

      let { data: cancelled_jobs } = await getCancelledJobs();
      // since we are getting jobs in object format from server
      cancelled_jobs = Object.values(cancelled_jobs);
      setCancelledJobs(cancelled_jobs);

      // get user jobs info
      const { data: jobs_info } = await getJobsInfo();
      // console.log(jobs_info);
      setMyRequests(jobs_info.my_requests);
      setMyJobs(jobs_info.my_jobs);

      let { data: designers } = await getDesignerUsers();
      designers = [
        { id: 0, email: "", display_name: "All Designers" },
        ...designers,
      ];
      setDesignerUsers(designers);

      const { data: invoices } = await getInvoices();
      setInvoices(invoices);

      setShowWorking(false);
    };

    loadData();
    if (pageParam) setView(pageParam);
  }, [setSettings, setMyJobs, setMyRequests, pageParam]);

  const handleViewChange = (view) => {
    setView(view);
  };

  const handleSettingsSave = async (settings) => {
    const { data: response } = saveSettings(settings);
    toast.info("Settings are saved");
    setSettings(settings);
  };

  const handleJobUpdate = (order_id) => {
    setJobSelected(order_id);
    handleViewChange("orderconvo");
  };

  const getJobIDByOrderID = (order_id) => {
    const found = InProgressJobs.find((order) => order.orderID === order_id);
    return found ? found.jobID : "";
  };

  const handleInvoiceDelete = async (id) => {
    const a = window.confirm("Are you sure?");
    if (!a) return;

    const { data: response } = await deleteInvoice(id);
    if (!response.success) return toast.error(response.data);
    setInvoices(response.data);
    toast.info("Deleted successfully");
  };

  const handleJobBack = () => {
    setJobSelected(null);
    handleViewChange("inprogrogressjobs");
  };

  const handleOrderStatusUpdate = (order_id) => {
    const my_jobs = [...InProgressJobs];
    const found = my_jobs.find((job) => job.orderID === Number(order_id));
    // console.log(InProgressJobs, order_id, found);
    const index = my_jobs.indexOf(found);
    const temp_status = UserRole === "customer" ? "wc-revise" : "wc-send";
    found["jobStatus"] = temp_status;
    my_jobs[index] = found;
    setInProgressJobs(my_jobs);
  };

  const handleJobClose = async () => {
    const { data: response } = await setJobClosed(JobSelected);
    response && window.location.reload();
  };

  // if designer has reach the limit of max allowed jobs return false
  const allowDesignersToPick = () => {
    if (UserRole === "designer") {
      let max_jobs_limit = get_setting("max_jobs_limit");
      if (InProgressJobs.length < Number(max_jobs_limit)) return true;
      return false;
    }
    return true;
  };

  const customDropdownStyles = {
    ".dropdown-toggle::after": {
      color: get_setting("navbar_font_color"),
    },
  };
  const renderView = () => {
    switch (view) {
      case "openjobs":
        return (
          <OpenJobsView
            jobs={OpenJobs}
            MyRequests={MyRequests}
            UserRole={UserRole}
            UserID={UserID}
            allowDesignersToPick={allowDesignersToPick()}
            DesignerUsers={DesignerUsers}
          />
        );

      case "inprogrogressjobs":
        return (
          <InProgressJobsView
            jobs={InProgressJobs}
            Statuses={Statuses}
            DesignerUsers={DesignerUsers}
            onJobUpdate={handleJobUpdate}
            UserRole={UserRole}
          />
        );
      case "completedjobs":
        return (
          <CompletedJobsView
            jobs={CompletedJobs}
            DesignerUsers={DesignerUsers}
            onJobUpdate={handleJobUpdate}
            UserRole={UserRole}
          />
        );
      case "cancelledjobs":
        return (
          <CancelledJobsView
            jobs={CancelledJobs}
            DesignerUsers={DesignerUsers}
            UserRole={UserRole}
          />
        );
      case "invoices":
        return (
          <DesignerInvoices
            designer_users={DesignerUsers}
            designer_invoices={Invoices}
            onInvoiceDelete={handleInvoiceDelete}
            DesignerUsers={DesignerUsers}
            UserRole={UserRole}
          />
        );
      case "faq":
        return <FAQ UserRole={UserRole} />;
      case "info":
        return <InfoPage />;
      case "ourdesigners":
        return <OurDesigners DesignerUsers={DesignerUsers} />;
      case "orderconvo":
        return (
          <OrderConvoHome
            OrderID={JobSelected}
            JobID={getJobIDByOrderID(JobSelected)}
            onBack={() => handleJobBack(null)}
            onOrderStatusUpdate={handleOrderStatusUpdate}
            onJobClose={handleJobClose}
            UserRole={UserRole}
          />
        );
      case "settings":
        return UserRole === "admin" ? (
          <AdminSettings
            admin_settings={Settings}
            onSettingsSave={handleSettingsSave}
            UserRole={UserRole}
          />
        ) : (
          <UserSettings
            admin_settings={Settings}
            onSettingsSave={handleSettingsSave}
            UserRole={UserRole}
          />
        );

      default:
        return null;
    }
  };

  const getNavTitle = (nav) => {
    // if ((nav.slug === "openjobs") & (UserRole === "customer"))
    // return "My Orders";
    return nav.title;
  };

  function handleNavClick(nav) {
    if (nav.slug) {
      handleViewChange(nav.slug);
    } else {
      const link = document.createElement("a");
      link.href = `${siteurl}/${nav.link}`;
      link.target = "_blank"; // Add this line to set target to _blank
      link.click();
    }
  }

  return (
    <Container>
      <Navbar
        style={{ backgroundColor: get_setting("navbar_bg_color") }}
        variant="dark"
        expand="lg"
      >
        <Container>
          <NavbarLogo />
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {Navbars_data.filter((nav) => nav.access.includes(UserRole)).map(
                (nav, index) => (
                  <Nav.Link
                    key={index}
                    onClick={() => handleNavClick(nav)}
                    style={{
                      color: get_setting("navbar_font_color"),
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = get_setting(
                        "navbar_font_hover_color"
                      ))
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = get_setting("navbar_font_color"))
                    }
                  >
                    {getNavTitle(nav)}
                  </Nav.Link>
                )
              )}
            </Nav>

            <Nav>
              <style
                dangerouslySetInnerHTML={{
                  __html: `.dropdown-menu.show { background-color: ${get_setting(
                    "navbar_bg_color"
                  )}; }`,
                }}
              />

              <NavDropdown
                title={
                  <span
                    style={{ color: get_setting("navbar_font_color") }}
                    dangerouslySetInnerHTML={{
                      __html: `Hi, ${User.data.display_name}`,
                    }}
                  />
                }
                id="basic-nav-dropdown"
                className="custom-dropdown"
                style={{
                  color: get_setting("navbar_font_color"),
                }}
              >
                <NavDropdown.Item
                  className="top-nav-dropdown-item"
                  style={{
                    color: get_setting("navbar_font_color"),
                    "--bs-dropdown-link-hover-bg": "#543BAF",
                  }}
                  href="#"
                  onClick={() => handleViewChange("settings")}
                >
                  Settings
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="#"
                  onClick={onLogout}
                  style={{
                    color: get_setting("navbar_font_color"),
                    "--bs-dropdown-link-hover-bg": "#543BAF",
                  }}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="container mt-4">{renderView()}</div>
      <Modal
        show={showWorking}
        onHide={() => setShowWorking(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status" className="modal-spinner">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Dashboard;
