import { useState } from "react";
import { Button, Row, Col, Modal, Container, Form } from "react-bootstrap";
import { setJobRating } from "../services/model";
import { toast } from "react-toastify";
import { Typography } from "@mui/material";
export default function RatingModal({ UserRole, job }) {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(job.ratingStar);
  const [ratingComment, setRatingComment] = useState(job.ratingComment);
  console.log(job);
  const handleSeeModal = () => {
    // setSelectedJob(job);
    setShowModal(true);
  };
  function handleClick(value) {
    setRating(value);
  }

  function handleInputChange(event) {
    setRatingComment(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const ratingData = {
      rating_comment: ratingComment,
      rating_stars: rating,
      order_id: job.orderID,
      designer_id: job.jobDesigner.ID,
    };
    const response = await setJobRating(ratingData);
    const { success, message } = response.data;
    if (success) {
      toast.info(message);
    }
  }
  return (
    <div>
      <Typography style={{ maxWidth: "150px", wordWrap: "break-word" }}>
        {ratingComment}
      </Typography>
      <p>
        {[1, 2, 3, 4, 5].map((value) => (
          <span
            key={value}
            style={{
              cursor: "pointer",
              fontSize: "20px",
              color: value <= rating ? "#ffc107" : "gray",
            }}
          >
            {value <= rating ? "★" : "☆"}
          </span>
        ))}
      </p>
      {UserRole === "customer" && (
        <Button
          style={{
            textAlign: "center",
            background: "black",
            color: "white",
            border: "none",
            marginLeft: 5,
            marginTop: 10,
          }}
          onClick={handleSeeModal}
        >
          Rating here
        </Button>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rating</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="ratingInput">
                <Form.Control
                  as="textarea"
                  value={ratingComment}
                  onChange={handleInputChange}
                  placeholder="Type here..."
                />
              </Form.Group>
              <Row>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Col key={value} xs="auto" onClick={() => handleClick(value)}>
                    <span
                      style={{
                        cursor: "pointer",
                        fontSize: "30px",
                        color: value <= rating ? "#ffc107" : "gray",
                      }}
                    >
                      {value <= rating ? "★" : "☆"}
                    </span>
                  </Col>
                ))}
              </Row>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </Form>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
