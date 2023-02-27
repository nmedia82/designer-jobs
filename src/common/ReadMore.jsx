import React, { useState } from "react";
import { Button } from "react-bootstrap";

const ReadMoreText = ({ text, maxLength }) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => setShowMore(!showMore);

  const truncatedText = text.slice(0, maxLength);
  const shouldTruncate = text.length > maxLength;

  return (
    <div>
      <p>
        {showMore ? text : truncatedText}
        {shouldTruncate && (
          <Button
            className="m-1"
            variant="info"
            size="sm"
            onClick={toggleShowMore}
          >
            {showMore ? " Read less" : " Read more"}
          </Button>
        )}
      </p>
    </div>
  );
};

export default ReadMoreText;
