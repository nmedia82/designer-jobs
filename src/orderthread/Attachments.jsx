import { useRef } from "react";
import { Box, IconButton, Divider, Tooltip } from "@mui/material";
import { AttachFileOutlined } from "@mui/icons-material";
import { get_setting } from "./../services/helper";
function Attachments({ onFileSelected }) {
  const hiddenFileInput = useRef(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = () => {
    hiddenFileInput.current.click();
  };
  // console.log(get_setting("enable_file_attachments"));
  return (
    <Box>
      <input
        multiple
        type="file"
        ref={hiddenFileInput}
        onChange={onFileSelected}
        style={{ display: "none" }}
      />

      <Tooltip title="Attach File">
        <IconButton
          sx={{ p: 1, color: get_setting("icon_color_upload_button", "#000") }}
          aria-label="Send"
          onClick={handleClick}
        >
          {<AttachFileOutlined />}
        </IconButton>
      </Tooltip>

      <Divider sx={{ height: "auto" }} orientation="vertical" />
    </Box>
  );
}

export default Attachments;
