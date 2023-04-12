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
    found["jobStatus"] = "wc-send";
    my_jobs[index] = { ...found };
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
        return (
          <AdminSettings
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
    if ((nav.slug === "openjobs") & (UserRole === "customer"))
      return "My Orders";
    return nav.title;
  };

  return (
    <Container>
      <Navbar bg={get_setting("navbar_bg_color")} variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">
            <img
              src="data:image/png;base64,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"
              alt="Your Logo"
              style={{ margin: "20px 0", width: "200px" }}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {Navbars_data.filter((nav) => nav.access.includes(UserRole)).map(
                (nav, index) => (
                  <Nav.Link
                    key={index}
                    onClick={() => handleViewChange(nav.slug)}
                  >
                    {getNavTitle(nav)}
                  </Nav.Link>
                )
              )}
              {UserRole === "admin" && (
                <Nav.Link
                  target="__blank"
                  href={`${siteurl}/wp-admin/edit.php?post_type=shop_order`}
                >
                  All Jobs
                </Nav.Link>
              )}
              {UserRole === "customer" && (
                <Nav.Link
                  target="__blank"
                  href={`${siteurl}/my-account/orders/`}
                >
                  Back to Orders
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
