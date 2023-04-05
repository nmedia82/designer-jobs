import * as React from "react";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { common } from "@mui/material/colors";
import Attachments from "./Attachments";
import { DeleteOutline, SendOutlined } from "@mui/icons-material";
import {
  get_preview_thumb,
  get_setting,
  wooconvo_makeid,
} from "./../services/helper";
import { Button } from "react-bootstrap";
import { getUserRole } from "../services/auth";
import QuickReplies from "./QuickReply";

const UserRole = getUserRole();
export default function ReplyMsg({ onReplySend, onJobClose }) {
  //Emoji
  const [ReplyText, setReplyText] = useState("");
  const [Files, setFiles] = useState([]);
  const [isRead, setIsRead] = useState(false);

  const quick_messages = get_setting("quick_messages");

  const validateSelectedFiles = (files_selected) => {
    // max_files_allowed
    // max_file_size
    // file_types_allowed
    let msg = "";
    const max_files_allowed = Number(get_setting("max_files_allowed", 1));
    const max_file_size = Number(get_setting("max_file_size", 100));
    let file_types_allowed = get_setting("file_types_allowed", "jpg,png,pdf");
    file_types_allowed = file_types_allowed.split(",");

    const wrong_found = Object.keys(files_selected).find(
      (f) =>
        !file_types_allowed.includes(files_selected[f].name.split(".").pop())
    );
    if (wrong_found) msg += `Filetypes allowed ${file_types_allowed.join(",")}`;
    // console.log(file_types_allowed, files_selected, wrong_found);

    // console.log(files_selected);
    if (files_selected.length + Files.length > max_files_allowed)
      msg += `\nMax files limit is ${max_files_allowed}`;

    const found = Object.keys(files_selected).find(
      (f) => files_selected[f].size > max_file_size * 1024
    );
    if (found) msg += `\nMax filesize limit is ${max_file_size}KB`;

    if (msg) alert(msg);
    return msg === "";
  };

  const onReplyTextChanged = (e) => {
    const value = e.target.value;
    setReplyText(value);

    const match = value.match(/^#(\d+)$/);

    if (match) {
      const index = parseInt(match[1], 10) - 1;
      if (index >= 0 && index < quick_messages.length) {
        setReplyText(quick_messages[index]);
      }
    }
  };

  const handleFileSelected = (event) => {
    let fileUploaded = event.target.files;

    if (!validateSelectedFiles(fileUploaded)) return;

    fileUploaded = Object.keys(fileUploaded).map((f) => {
      fileUploaded[f].id = wooconvo_makeid();
      return fileUploaded[f];
    });
    const files = [...Files, ...fileUploaded];
    // console.log(fileUploaded);
    // document.getElementById(`preview-${fileUploaded.name}`).src =
    //   get_preview_thumb();
    // previewFile(files);
    setFiles(files);
  };

  // const previewFile = (files) => {
  //   files.forEach((file) => {
  //     var reader = new FileReader();
  //     reader.onloadend = function () {
  //       document.getElementById(`preview-${file.name}`).src =
  //         get_preview_thumb();
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // };

  const hanldeImageRemove = (file_id) => {
    const files = [...Files];
    const filter = files.filter((file) => file.name !== file_id);
    setFiles(filter);
  };

  const validateAttachments = () => {
    const attachment_enabled = get_setting("enable_file_attachments");
    if (!attachment_enabled) return false;
    const attach_required = get_setting("attachments_required");
    if (attach_required && !Files.length) return true;
    return false;
  };

  const getThumbSize = () => {
    const thum_size = get_setting("thumb_size", 150);
    return thum_size;
  };

  const onReplyClick = (message, files) => {
    setReplyText("");
    onReplySend(message, files);
  };

  const onEnterKeyPressed = (e) => {
    if (e.key === "Enter") {
      onReplyClick(ReplyText, Files);
    }
  };

  const handleCheckboxChange = (event) => {
    setIsRead(event.target.checked);
  };
  return (
    <Box>
      <Paper
        className="reply"
        component="div"
        sx={{ p: "2px 4px", display: "flex", bgcolor: common }}
      >
        <Attachments onFileSelected={handleFileSelected} />

        <TextField
          value={ReplyText}
          onChange={(e) => onReplyTextChanged(e)}
          onKeyDown={onEnterKeyPressed}
          fullWidth
          id="standard-basic"
          variant="standard"
        />

        <Divider sx={{ height: "auto" }} orientation="vertical" />

        <IconButton
          sx={{ p: 1, color: get_setting("icon_color_send_button") }}
          aria-label="Send"
          onClick={() => onReplyClick(ReplyText, Files)}
          disabled={ReplyText === "" || validateAttachments()}
        >
          <SendOutlined />
        </IconButton>
      </Paper>

      {/* Notice to customer */}
      {UserRole !== "designer" && (
        <Box>
          <Typography>
            <div
              dangerouslySetInnerHTML={{
                __html: get_setting("agreement_text_for_customer"),
              }}
            ></div>
          </Typography>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography className="m-1">
                Did you read the message above?
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox checked={isRead} onChange={handleCheckboxChange} />
                }
                label="Yes, I have read it."
                labelPlacement="end"
              />
              <Button disabled={!isRead} onClick={onJobClose}>
                I approve the design file
              </Button>
            </Box>
          </div>
        </Box>
      )}

      {/* Attachments Display*/}

      <Box
        sx={{ p: 3, flexDirection: "row", display: "flex", flexWrap: "wrap" }}
      >
        {validateAttachments() && (
          <Typography color={"red"} textAlign="center">
            Attachments are required
          </Typography>
        )}
        {Files.map((file) => (
          <Box className="preview-thumb" key={file.name}>
            <img
              className="preview-thumb-img"
              height={getThumbSize()}
              width={getThumbSize()}
              id={`preview-${file.name}`}
              alt={file.name}
              src={get_preview_thumb()}
            />
            <p className="preview-thumb-tool">
              <IconButton
                color="primary"
                sx={{ p: 1 }}
                aria-label="Send"
                onClick={() => hanldeImageRemove(file.name)}
              >
                <DeleteOutline />
              </IconButton>
              <Typography variant="span" display={"block"}>
                {file.name}
              </Typography>
            </p>
          </Box>
        ))}
      </Box>

      {/* Quick Messages */}
      {quick_messages.length > 0 && UserRole !== "customer" && (
        <QuickReplies quick_messages={quick_messages} />
      )}
    </Box>
  );
}
