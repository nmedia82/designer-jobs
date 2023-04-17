import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { get_setting } from "../services/helper";

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
            style={{
              color: get_setting("read_moreless_font_color"),
              backgroundColor: get_setting("read_moreless_bg_color"),
              borderColor: get_setting("read_moreless_bg_color"),
            }}
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
