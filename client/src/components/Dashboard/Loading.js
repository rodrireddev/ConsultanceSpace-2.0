import { Box, CircularProgress } from "@material-ui/core";

export default function Loading() {
  return (
    <Box display="flex" justifyContent="center" padding="40px">
      <CircularProgress />
    </Box>
  );
}
