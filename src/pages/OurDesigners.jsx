import { useState } from "react";
import { Container, Table } from "react-bootstrap";
import { get_setting } from "../services/helper";

function OurDesigners({ DesignerUsers }) {
  return (
    <Container>
      <h2>Our Designers</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Avatar</th>
            <th>User Info</th>
            {get_setting("enable_ratings") && <th>Ratings</th>}
          </tr>
        </thead>
        <tbody>
          {DesignerUsers.filter((designer) => designer.id).map((designer) => (
            <tr key={designer.id}>
              <td>{designer.display_name}</td>
              <td>
                <a
                  target="_blank"
                  href={designer.profile_link}
                  rel="noreferrer"
                >
                  {designer.email}
                </a>
              </td>
              <td>{designer.phone}</td>
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
              {get_setting("enable_ratings") && (
                <td>
                  {designer.ratings &&
                    `${designer.ratings.ratings.toFixed(2)} generated in ${
                      designer.ratings.rating_jobs
                    } jobs`}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default OurDesigners;
