import { Navbar } from "react-bootstrap";

export function NavbarLogo() {
  return (
    <Navbar.Brand href="#home">
      <img
        src={process.env.PUBLIC_URL + "/logo-w.png"}
        alt="CAD Labs"
        style={{ margin: "20px 0", width: "200px" }}
      />
    </Navbar.Brand>
  );
}
