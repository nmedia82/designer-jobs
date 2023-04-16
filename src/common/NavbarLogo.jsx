import { Navbar } from "react-bootstrap";

export function NavbarLogo() {
  return (
    <Navbar.Brand href="#home">
      <img
        src={process.env.PUBLIC_URL + "/logo-w.png"}
        alt="CAD Labs"
        style={{ margin: "10px 0", width: "150px" }}
      />
    </Navbar.Brand>
  );
}
