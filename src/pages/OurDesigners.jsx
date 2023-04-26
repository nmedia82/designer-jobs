import { useState } from "react";
import { Container, Table } from "react-bootstrap";

function OurDesigners({ DesignerUsers }) {
  const [designers, setDesigners] = useState([...DesignerUsers]);

  return (
    <Container>
      <h2>Our Designers</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Avatar</th>
            <th>User Info</th>
          </tr>
        </thead>
        <tbody>
          {designers.map((designer) => (
            <tr key={designer.id}>
              <td>{designer.display_name}</td>
              <td>
                <a target="_blank" href={designer.profile_link}>
                  {designer.email}
                </a>
              </td>
              <td>
                {designer.avartar_url && (
                  <img
                    src={designer.avartar_url}
                    alt={`Avatar of ${designer.name}`}
                    style={{ maxWidth: "100px" }}
                  />
                )}
              </td>
              <td>{designer.about_user}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default OurDesigners;
