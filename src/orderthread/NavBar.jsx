import {
  Chip,
  Box,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  TextField,
} from "@mui/material";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { ArrowBack, UnfoldLess } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { get_setting } from "./../services/helper";

const darkTheme = createTheme({
  palette: {
    primary: {
      main: get_setting("bg_color_message_header", "#000"),
    },
  },
});

function NavBar({
  TotalCount,
  onCollapsed,
  showMore,
  onSearchThread,
  OrderID,
  onBack,
}) {
  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block" },
            }}
          >
            <IconButton
              size="large"
              edge="start"
              aria-label="open drawer"
              sx={{ mr: 2, color: "#fff" }}
              onClick={onBack}
            >
              <ArrowBack />
            </IconButton>
            <Chip
              label={`#${OrderID}`}
              variant="outlined"
              sx={{ mr: 5, color: "#fff" }}
            />
          </Typography>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {get_setting("enable_msg_search") && (
              <TextField
                sx={{ bgcolor: "white" }}
                label="Search"
                size="small"
                variant="filled"
                id="margin-none"
                onChange={(e) => onSearchThread(e.target.value)}
              />
            )}
            <IconButton
              onClick={() => onCollapsed(!showMore)}
              size="small"
              edge="end"
              color="inherit"
              aria-label="open drawer"
              sx={{ ml: 3 }}
            >
              {showMore ? <UnfoldLess /> : <UnfoldMoreIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default NavBar;
