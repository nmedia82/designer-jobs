import { Container } from "react-bootstrap";
import { get_setting } from "../services/helper";

function InfoPage({ UserRole }) {
  const info = get_setting("info_text");

  return (
    <Container>
      <div dangerouslySetInnerHTML={{ __html: info }}></div>
    </Container>
  );
}

export default InfoPage;
