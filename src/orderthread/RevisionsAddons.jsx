import { Box, Stepper, Step, StepLabel, Typography } from "@mui/material";
import { get_setting } from "../../services/helper";
function RevisionsAddon({ RevisionsLimit, totalCustomerMessages }) {
  const RevisionSteps = Array.from({ length: RevisionsLimit }, (_, i) => i + 1);

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={totalCustomerMessages - 1} alternativeLabel>
        {RevisionSteps.map((step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Typography align="center">{get_setting("revisions_note")}</Typography>
    </Box>
  );
}

export default RevisionsAddon;
