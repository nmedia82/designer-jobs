import { useState, useEffect } from "react";
import { Divider } from "@mui/material";
import NoticeMsg from "./NoticeMsg";
import CustomerMsg from "./CustomerMsg";
import { get_setting } from "./../services/helper";

function MessagesBody({ Thread, showMore, onDownload }) {
  const order_reverse = get_setting("reverse_message_display_order");
  var thread = [...Thread];
  if (order_reverse) {
    thread.reverse();
  }
  return (
    <div>
      {thread.map((msg, index) => (
        <div key={index}>
          {/* Notice Message */}
          {(msg.type === "order_note" || msg.type === "order_change") && (
            <>
              <NoticeMsg message={msg} />
              <Divider variant="inset" component="h2" />
            </>
          )}

          {/* Customer Message */}
          {msg.type === "message" && (
            <CustomerMsg
              message={msg}
              showMore={showMore}
              onDownload={onDownload}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default MessagesBody;
