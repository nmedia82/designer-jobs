import React from "react";
import {
  ListItem,
  Typography,
  Grid,
  ListItemAvatar,
  ListItemText,
  Avatar,
  List,
} from "@mui/material";
import { pink } from "@mui/material/colors";
import InfoIcon from "@mui/icons-material/Info";
import { get_setting } from "../services/helper";

export default function AdminComments({ message, UserRole }) {
  const bgcolor =
    UserRole === "customer"
      ? get_setting("admin_to_customer_msg_bg_color", "lightblue")
      : get_setting("admin_to_designer_msg_bg_color", "#d9aaa0");
  return (
    <div>
      <List
        sx={{ width: "100%", bgcolor }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <ListItem alignItems="center">
          <Grid>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: pink[500] }}>
                <InfoIcon />
              </Avatar>
            </ListItemAvatar>
            {/* <Divider orientation="vertical" flexItem sx={{ ml:-2, mt:-1  }}>|</Divider> */}
          </Grid>
          <ListItemText
            secondary={
              <>
                <Typography
                  sx={{ display: "inline" }}
                  variant="span"
                  color="text.primary"
                >
                  {message.message}
                </Typography>
                <Typography
                  sx={{ display: "inline", ml: 2 }}
                  variant="span"
                  color="text.primary"
                >
                  {message.date}
                </Typography>
              </>
            }
          />
        </ListItem>
      </List>
    </div>
  );
}
