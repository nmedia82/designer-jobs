import { useEffect, useState } from "react";
import {
  Typography,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Collapse,
  ListItemButton,
  IconButton,
  Box,
} from "@mui/material";
//import InfoIcon from "@mui/icons-material/Info";
import { blue, green } from "@mui/material/colors";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { DownloadOutlined } from "@mui/icons-material";
import { get_setting, jobdone_date } from "./../services/helper";

export default function CustomerMsg({
  message,
  showMore,
  onDownload,
  UserRole,
}) {
  function stringAvatar(name) {
    return {
      children: `${name.split(" ")[0][0]}`,
    };
  }
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(showMore);
  }, [showMore]);

  const handleClick = () => {
    setOpen(!open);
  };

  const getDisplayName = (message) => {
    if (UserRole === "designer" && message.user_type === "customer")
      return "Customer";
    return message.user_name;
  };
  return (
    <div>
      <ListItemButton onClick={handleClick}>
        <ListItemAvatar>
          <Avatar
            sx={{
              bgcolor:
                message.user_type === "customer" ? green[600] : blue[600],
            }}
            {...stringAvatar(getDisplayName(message).toUpperCase())}
          />
        </ListItemAvatar>
        <ListItemText
          secondary={
            <>
              <Typography
                sx={{ display: "inline", fontWeight: "bold" }}
                variant="span"
                color="text.primary"
              >
                {getDisplayName(message)}
              </Typography>
              <Typography
                sx={{ display: "inline", ml: 2 }}
                variant="span"
                color="text.primary"
              >
                {jobdone_date(message.date)}
              </Typography>
            </>
          }
        />

        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <ListItemText
          sx={{ backgroundColor: get_setting("bg_color_order_messages"), p: 2 }}
        >
          <Typography variant="body1" gutterBottom>
            {message.message}
          </Typography>

          <Box
            sx={{
              flexDirection: "row",
              display: "flex",
            }}
          >
            {message.attachments &&
              message.attachments.map((att, index) => (
                <Box className="preview-thumb-upload" key={index}>
                  <img
                    src={att.thumbnail}
                    className="preview-thumb-img-upload"
                    height="50"
                    width="100"
                    alt={att.filename}
                  />
                  <p className="preview-thumb-tool-upload">
                    <IconButton onClick={() => onDownload(att)}>
                      <DownloadOutlined />
                    </IconButton>
                  </p>
                </Box>
              ))}
          </Box>
        </ListItemText>
      </Collapse>
    </div>
  );
}
