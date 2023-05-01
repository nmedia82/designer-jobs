import { Divider } from "@mui/material";
import CustomerMsg from "./CustomerMsg";
import AdminComments from "./AdminComments";
import { get_setting } from "./../services/helper";
import { getUserRole } from "../services/auth";

const UserRole = getUserRole();
function MessagesBody({ Thread, showMore, onDownload }) {
  console.log(Thread);
  const order_reverse = get_setting("reverse_message_display_order");
  var thread = [...Thread];
  if (order_reverse) {
    thread.reverse();
  }

  const showAdminComment = (msg) => {
    return (
      (UserRole === "customer" && msg.type === "comment_customer") ||
      (UserRole === "designer" && msg.type === "comment_designer") ||
      (UserRole === "admin" && msg.type !== "message")
    );
  };
  return (
    <div>
      {thread.map((msg, index) => (
        <div key={index}>
          {/* Notice Message */}
          {/* {(msg.type === "order_note" || msg.type === "order_change") && (
            <>
              <NoticeMsg message={msg} />
              <Divider variant="inset" component="h2" />
            </>
          )} */}

          {/* Customer Message */}
          {showAdminComment(msg) && (
            <>
              <AdminComments message={msg} UserRole={UserRole} />
            </>
          )}

          {/* Customer Message */}
          {msg.type === "message" && (
            <>
              <CustomerMsg
                message={msg}
                showMore={showMore}
                onDownload={onDownload}
                UserRole={UserRole}
              />

              <Divider variant="inset" component="h2" />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default MessagesBody;
