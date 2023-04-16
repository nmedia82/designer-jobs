import { Container } from "react-bootstrap";
import { get_setting } from "../services/helper";

function FAQ({ UserRole }) {
  const faq =
    UserRole === "designer"
      ? get_setting("faq_for_designers")
      : get_setting("faq_for_customers");

  return (
    <Container>
      <h2>FAQ</h2>

      <div dangerouslySetInnerHTML={{ __html: faq }}></div>
    </Container>
  );
}

export default FAQ;
