import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Page from "./Page";

/**
 * @param {{text: string; desc?: string; finish?: boolean; full?: boolean}} props
 */
export default function Loading(props) {
  const app_name = process.env.NEXT_PUBLIC_WEB_NAME;
  const app_logo = process.env.NEXT_PUBLIC_WEB_LOGO;
  let Progress;
  let Logo;

  if (props.finish) {
    Progress = "";
    Logo = (
      <Box>
        <Avatar
          alt={app_name}
          src={app_logo}
          variant="rounded"
          sx={{
            width: {
              xs: "44px",
              md: "50px",
            },
            height: {
              xs: "44px",
              md: "50px",
            },
          }}
        />
      </Box>
    );
  } else {
    Progress = (
      <CircularProgress variant="indeterminate" thickness={2} size={60} />
    );
    Logo = (
      <Box position="absolute">
        <Avatar
          alt={app_name}
          src={app_logo}
          sx={{
            width: {
              xs: "44px",
              md: "50px",
            },
            height: {
              xs: "44px",
              md: "50px",
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Page animate>
      <Box
        display="grid"
        justifyContent="center"
        alignContent="center"
        width="100vmax"
        height="100vmin"
      >
        <Box
          display="grid"
          justifyItems="center"
          alignItems="center"
          gap="16px"
        >
          <Box
            display="grid"
            justifyItems="center"
            alignItems="center"
            position="relative"
          >
            {Progress}
            {Logo}
          </Box>
          <Typography component="div" variant="body1">
            {props.text}
          </Typography>
        </Box>
      </Box>
    </Page>
  );
}
