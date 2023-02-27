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
import { get_setting } from "./../services/helper";

export default function NoticeMsg({ message }) {
  return (
    <div>
      {get_setting("enable_order_notices") && (
        <List
          sx={{ width: "100%", bgcolor: get_setting("bg_color_order_notices") }}
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
      )}
    </div>
  );
}
