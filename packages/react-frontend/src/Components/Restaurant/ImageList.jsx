import React, { useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import "../../Styles/ImageList.scss";

const ImageList = ({ photos, onClose }) => {
  useEffect(() => {
    // Add 'modal-open' class to body when the modal is open
    document.body.classList.add("modal-open");
    return () => {
      // Remove 'modal-open' class when the modal is closed
      document.body.classList.remove("modal-open");
    };
  }, []);

  return (
    <div className="image-list-overlay">
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      <Row>
        {photos.map((photo, index) => (
          <Col key={index} lg={4} md={6} sm={12} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={photo}
                alt={`Photo ${index + 1}`}
                className="image-list-img"
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ImageList;
