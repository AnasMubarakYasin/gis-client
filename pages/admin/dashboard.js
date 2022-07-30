import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { styled, useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";

import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import StorageIcon from "@mui/icons-material/Storage";
import MemoryIcon from "@mui/icons-material/Memory";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import AppsIcon from "@mui/icons-material/Apps";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import SyncIcon from "@mui/icons-material/Sync";
import StreamIcon from "@mui/icons-material/Stream";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FoundationIcon from "@mui/icons-material/Foundation";
import ComputerIcon from "@mui/icons-material/Computer";

import Battery20Icon from "@mui/icons-material/Battery20";
import Battery30Icon from "@mui/icons-material/Battery30";
import Battery50Icon from "@mui/icons-material/Battery50";
import Battery60Icon from "@mui/icons-material/Battery60";
import Battery80Icon from "@mui/icons-material/Battery80";
import Battery90Icon from "@mui/icons-material/Battery90";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";

import BatteryCharging20Icon from "@mui/icons-material/BatteryCharging20";
import BatteryCharging30Icon from "@mui/icons-material/BatteryCharging30";
import BatteryCharging50Icon from "@mui/icons-material/BatteryCharging50";
import BatteryCharging60Icon from "@mui/icons-material/BatteryCharging60";
import BatteryCharging80Icon from "@mui/icons-material/BatteryCharging80";
import BatteryCharging90Icon from "@mui/icons-material/BatteryCharging90";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";

import BatteryUnknownIcon from "@mui/icons-material/BatteryUnknown";

import AdminShell from "@/layout/AdminShell";
import ContextAuthenticate from "@/context/authenticate";
import AdminContext from "@/context/admin";
import { useStatsQuery, useSystemQuery } from "@/store/models";

const stats = [];

export default function Dashboard(props) {
  const router = useRouter();
  const theme = useTheme();
  const ctx_auth = useContext(ContextAuthenticate);
  const ctx_admin = useContext(AdminContext);
  // @ts-ignore
  const user = useSelector((state) => state.user);
  const {
    data: stat,
    error: error_stat,
    isLoading: is_loading_stat,
    isFetching: is_fetching_stat,
    isSuccess: is_success_stat,
    isError: is_error_stat,
  } = useStatsQuery({ token: user.token });
  const {
    data: system,
    error: error_system,
    isLoading: is_loading_system,
    isFetching: is_fetching_system,
    isSuccess: is_success_system,
    isError: is_error_system,
    refetch: refetch_system,
  } = useSystemQuery({ token: user.token }, { skip: is_loading_stat });
  const [snack, setSnack] = useState({
    id: "default",
    open: false,
    timeout: 6000,
    message: <div></div>,
  });

  useEffect(() => {
    ctx_admin.set_ctx_data({
      title: "Dashboard",
      active_link: "/admin/dashboard",
    });
  }, []);
  useEffect(() => {
    ctx_admin.set_loader(is_fetching_stat);
  }, [is_fetching_stat]);
  useEffect(() => {
    if (is_success_stat) {
    }
    if (is_error_stat) {
      const message = convertAndHandleErrorApi(error_stat);
      setSnack({
        ...snack,
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            {message}
          </Alert>
        ),
      });
    }
  }, [is_success_stat, is_error_stat, is_fetching_stat]);
  useEffect(() => {
    if (is_success_system) {
      const id = setTimeout(() => {
        refetch_system();
      }, 1500);
      return () => {
        clearTimeout(id);
      };
    }
    if (is_error_system) {
      const message = convertAndHandleErrorApi(error_system);
      setSnack({
        ...snack,
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            {message}
          </Alert>
        ),
      });
    }
  }, [is_success_system, is_error_system, is_fetching_system]);

  function convertAndHandleErrorApi(error) {
    if (error.error) {
      return error.error;
    } else {
      if (error.status == 401) {
        ctx_auth.open_signin(true);
      }
      return error.data.message;
    }
  }

  const CardStatSkeleton = (
    <Card variant="outlined" sx={{ position: "relative" }}>
      <CardActionArea>
        <CardContent>
          <Box display="flex" gap={2} justifyContent="space-between">
            <Box display="grid" flexGrow={1}>
              <Skeleton animation="wave" variant="text" width="100%">
                <Typography
                  variant="subtitle1"
                  component="div"
                  sx={{ opacity: "0.9" }}
                >
                  &space;
                </Typography>
              </Skeleton>
              <Skeleton animation="wave" variant="text" width="100%">
                <Typography variant="subtitle1" fontWeight="medium">
                  &space;
                </Typography>
              </Skeleton>
            </Box>
            <Skeleton
              animation="wave"
              variant="rectangular"
              width="44px"
              height="44px"
              sx={{
                borderRadius: 4,
              }}
            >
              {" "}
            </Skeleton>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  let BatteryIcon = <BatteryUnknownIcon fontSize="medium" />;
  if (system) {
    if (system.battery) {
      if (system.battery.isCharging) {
        if (system.battery.percent > 99) {
          BatteryIcon = <BatteryChargingFullIcon fontSize="medium" />;
        } else if (system.battery.percent >= 90) {
          BatteryIcon = <BatteryCharging90Icon fontSize="medium" />;
        } else if (system.battery.percent >= 80) {
          BatteryIcon = <BatteryCharging80Icon fontSize="medium" />;
        } else if (system.battery.percent >= 60) {
          BatteryIcon = <BatteryCharging60Icon fontSize="medium" />;
        } else if (system.battery.percent >= 50) {
          BatteryIcon = <BatteryCharging50Icon fontSize="medium" />;
        } else if (system.battery.percent >= 30) {
          BatteryIcon = <BatteryCharging30Icon fontSize="medium" />;
        } else {
          BatteryIcon = <BatteryCharging20Icon fontSize="medium" />;
        }
      } else {
        if (system.battery.percent > 99) {
          BatteryIcon = <BatteryFullIcon fontSize="medium" />;
        } else if (system.battery.percent >= 90) {
          BatteryIcon = <Battery90Icon fontSize="medium" />;
        } else if (system.battery.percent >= 80) {
          BatteryIcon = <Battery80Icon fontSize="medium" />;
        } else if (system.battery.percent >= 60) {
          BatteryIcon = <Battery60Icon fontSize="medium" />;
        } else if (system.battery.percent >= 50) {
          BatteryIcon = <Battery50Icon fontSize="medium" />;
        } else if (system.battery.percent >= 30) {
          BatteryIcon = <Battery30Icon fontSize="medium" />;
        } else {
          BatteryIcon = <Battery20Icon fontSize="medium" />;
        }
      }
    }
  }

  return (
    <>
      <Box
        display="grid"
        padding={{
          xs: 2,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 8,
        }}
        gap={{
          xs: 2,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 8,
        }}
      >
        <Grid
          container
          spacing={{ xs: 2, sm: 2, md: 4, lg: 4, xl: 8 }}
          columns={{ xs: 1, sm: 4, md: 4, lg: 6, xl: 8 }}
        >
          <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
            {is_fetching_stat && CardStatSkeleton}
            {is_success_stat && (
              <Card variant="outlined" sx={{ position: "relative" }}>
                <CardActionArea>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Box display="grid">
                        <Typography
                          variant="subtitle1"
                          component="div"
                          fontWeight="medium"
                          sx={{ opacity: "0.9" }}
                        >
                          Total Proyek
                        </Typography>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ opacity: "1" }}
                        >
                          {stat.projects}
                        </Typography>
                      </Box>
                      <Paper
                        variant="elevation"
                        elevation={2}
                        sx={{
                          display: "grid",
                          placeContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: 4,
                          boxShadow: "none",
                        }}
                      >
                        <FoundationIcon fontSize="medium" />
                      </Paper>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            )}
          </Grid>
          <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
            {is_fetching_stat && CardStatSkeleton}
            {is_success_stat && (
              <Card variant="outlined" sx={{ position: "relative" }}>
                <CardActionArea>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Box display="grid">
                        <Typography
                          variant="subtitle1"
                          component="div"
                          fontWeight="medium"
                          sx={{ opacity: "0.9" }}
                        >
                          Total Laporan
                        </Typography>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ opacity: "1" }}
                        >
                          {stat.reports}
                        </Typography>
                      </Box>
                      <Paper
                        variant="elevation"
                        elevation={2}
                        sx={{
                          display: "grid",
                          placeContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: 4,
                          boxShadow: "none",
                        }}
                      >
                        <AssignmentIcon fontSize="medium" />
                      </Paper>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            )}
          </Grid>
          <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
            {is_fetching_stat && CardStatSkeleton}
            {is_success_stat && (
              <Card variant="outlined" sx={{ position: "relative" }}>
                <CardActionArea>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Box display="grid">
                        <Typography
                          variant="subtitle1"
                          component="div"
                          fontWeight="medium"
                          sx={{ opacity: "0.9" }}
                        >
                          Total Anggota
                        </Typography>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ opacity: "1" }}
                        >
                          {stat.members}
                        </Typography>
                      </Box>
                      <Paper
                        variant="elevation"
                        elevation={2}
                        sx={{
                          display: "grid",
                          placeContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: 4,
                          boxShadow: "none",
                        }}
                      >
                        <GroupIcon fontSize="medium" />
                      </Paper>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            )}
          </Grid>
          <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
            {is_fetching_stat && CardStatSkeleton}
            {is_success_stat && (
              <Card variant="outlined" sx={{ position: "relative" }}>
                <CardActionArea>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Box display="grid">
                        <Typography
                          variant="subtitle1"
                          component="div"
                          fontWeight="medium"
                          sx={{ opacity: "0.9" }}
                        >
                          Warn
                        </Typography>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ opacity: "1" }}
                        >
                          {0}
                        </Typography>
                      </Box>
                      <Paper
                        variant="elevation"
                        elevation={2}
                        sx={{
                          display: "grid",
                          placeContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: 4,
                          boxShadow: "none",
                        }}
                      >
                        <WarningAmberIcon fontSize="medium" />
                      </Paper>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            )}
          </Grid>
          <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
            {is_fetching_stat && CardStatSkeleton}
            {is_success_stat && (
              <Card variant="outlined" sx={{ position: "relative" }}>
                <CardActionArea>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Box display="grid">
                        <Typography
                          variant="subtitle1"
                          component="div"
                          fontWeight="medium"
                          sx={{ opacity: "0.9" }}
                        >
                          Error
                        </Typography>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ opacity: "1" }}
                        >
                          {0}
                        </Typography>
                      </Box>
                      <Paper
                        variant="elevation"
                        elevation={2}
                        sx={{
                          display: "grid",
                          placeContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: 4,
                          boxShadow: "none",
                        }}
                      >
                        <ErrorOutlineIcon fontSize="medium" />
                      </Paper>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            )}
          </Grid>
        </Grid>
        <Grid
          container
          spacing={{ xs: 2, sm: 2, md: 4, lg: 4, xl: 8 }}
          columns={{ xs: 1, sm: 4, md: 4, lg: 6, xl: 8 }}
        >
          <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
            {is_loading_system && CardStatSkeleton}
            {is_success_system && (
              <Card variant="outlined" sx={{ position: "relative" }}>
                <CardActionArea>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Box display="grid">
                        <Typography
                          variant="subtitle1"
                          component="div"
                          fontWeight="medium"
                          sx={{ opacity: "0.9" }}
                        >
                          Processor
                        </Typography>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ opacity: "1" }}
                        >
                          {system.cpu.core} ({system.cpu.percent.toPrecision(3)}
                          )
                        </Typography>
                      </Box>
                      <Paper
                        variant="elevation"
                        elevation={2}
                        sx={{
                          display: "grid",
                          placeContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: 4,
                          boxShadow: "none",
                        }}
                      >
                        <MemoryIcon fontSize="medium" />
                      </Paper>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            )}
          </Grid>
          <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
            {is_loading_system && CardStatSkeleton}
            {is_success_system && (
              <Card variant="outlined" sx={{ position: "relative" }}>
                <CardActionArea>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Box display="grid">
                        <Typography
                          variant="subtitle1"
                          component="div"
                          fontWeight="medium"
                          sx={{ opacity: "0.9" }}
                        >
                          Memory
                        </Typography>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ opacity: "1" }}
                        >
                          {system.mem.active.toPrecision(3)}GB of{" "}
                          {system.mem.total.toPrecision(3)}GB (
                          {system.mem.percent.toPrecision(3)})
                        </Typography>
                      </Box>
                      <Paper
                        variant="elevation"
                        elevation={2}
                        sx={{
                          display: "grid",
                          placeContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: 4,
                          boxShadow: "none",
                        }}
                      >
                        <DeveloperBoardIcon fontSize="medium" />
                      </Paper>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            )}
          </Grid>
          <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
            {is_loading_system && CardStatSkeleton}
            {is_success_system && (
              <Card variant="outlined" sx={{ position: "relative" }}>
                <CardActionArea>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Box display="grid">
                        <Typography
                          variant="subtitle1"
                          component="div"
                          fontWeight="medium"
                          sx={{ opacity: "0.9" }}
                        >
                          Disk
                        </Typography>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ opacity: "1" }}
                        >
                          {system.disk.active.toPrecision(3)}GB of{" "}
                          {system.disk.total.toPrecision(3)}GB (
                          {system.disk.percent.toPrecision(3)})
                        </Typography>
                      </Box>
                      <Paper
                        variant="elevation"
                        elevation={2}
                        sx={{
                          display: "grid",
                          placeContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: 4,
                          boxShadow: "none",
                        }}
                      >
                        <StorageIcon fontSize="medium" />
                      </Paper>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            )}
          </Grid>
          <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
            {is_loading_system && CardStatSkeleton}
            {is_success_system && (
              <Card variant="outlined" sx={{ position: "relative" }}>
                <CardActionArea>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Box display="grid">
                        <Typography
                          variant="subtitle1"
                          component="div"
                          fontWeight="medium"
                          sx={{ opacity: "0.9" }}
                        >
                          Network IO
                        </Typography>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ opacity: "1" }}
                        >
                          {system.nio.receive.toPrecision(3)}MB /{" "}
                          {system.nio.transfer.toPrecision(3)}MB
                        </Typography>
                      </Box>
                      <Paper
                        variant="elevation"
                        elevation={2}
                        sx={{
                          display: "grid",
                          placeContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: 4,
                          boxShadow: "none",
                        }}
                      >
                        <SyncAltIcon rotate={90} fontSize="medium" />
                      </Paper>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            )}
          </Grid>
          <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
            {is_loading_system && CardStatSkeleton}
            {is_success_system && (
              <Card variant="outlined" sx={{ position: "relative" }}>
                <CardActionArea>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Box display="grid">
                        <Typography
                          variant="subtitle1"
                          component="div"
                          fontWeight="medium"
                          sx={{ opacity: "0.9" }}
                        >
                          Disk IO
                        </Typography>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ opacity: "1" }}
                        >
                          {system.dio.read.toPrecision(3)}MB /{" "}
                          {system.dio.write.toPrecision(3)}MB
                        </Typography>
                      </Box>
                      <Paper
                        variant="elevation"
                        elevation={2}
                        sx={{
                          display: "grid",
                          placeContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: 4,
                          boxShadow: "none",
                        }}
                      >
                        <SyncIcon fontSize="medium" />
                      </Paper>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            )}
          </Grid>
          <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
            {is_loading_system && CardStatSkeleton}
            {is_success_system && (
              <Card variant="outlined" sx={{ position: "relative" }}>
                <CardActionArea>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Box display="grid">
                        <Typography
                          variant="subtitle1"
                          component="div"
                          fontWeight="medium"
                          sx={{ opacity: "0.9" }}
                        >
                          Battery
                        </Typography>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ opacity: "1" }}
                        >
                          {system?.battery?.percent ?? "unknown"}%
                        </Typography>
                      </Box>
                      <Paper
                        variant="elevation"
                        elevation={2}
                        sx={{
                          display: "grid",
                          placeContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: 4,
                          boxShadow: "none",
                        }}
                      >
                        {BatteryIcon}
                      </Paper>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            )}
          </Grid>
          <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
            {is_loading_system && CardStatSkeleton}
            {is_success_system && (
              <Card variant="outlined" sx={{ position: "relative" }}>
                <CardActionArea>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Box display="grid">
                        <Typography
                          variant="subtitle1"
                          component="div"
                          fontWeight="medium"
                          sx={{ opacity: "0.9" }}
                        >
                          Instance
                        </Typography>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ opacity: "1" }}
                        >
                          ({system.instance.proc}){" "}
                          {system.instance.cpu.toPrecision(3)}{" "}
                          {system.instance.mem.toPrecision(3)}
                        </Typography>
                      </Box>
                      <Paper
                        variant="elevation"
                        elevation={2}
                        sx={{
                          display: "grid",
                          placeContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: 4,
                          boxShadow: "none",
                        }}
                      >
                        <AppsIcon fontSize="medium" />
                      </Paper>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            )}
          </Grid>
          <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
            {is_loading_system && CardStatSkeleton}
            {is_success_system && (
              <Card variant="outlined" sx={{ position: "relative" }}>
                <CardActionArea>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Box display="grid">
                        <Typography
                          variant="subtitle1"
                          component="div"
                          fontWeight="medium"
                          sx={{ opacity: "0.9" }}
                        >
                          OS
                        </Typography>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ opacity: "1" }}
                        >
                          {system.os?.distro ?? system.os?.platform}{" "}
                          {system.os.release}
                        </Typography>
                      </Box>
                      <Paper
                        variant="elevation"
                        elevation={2}
                        sx={{
                          display: "grid",
                          placeContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: 4,
                          boxShadow: "none",
                        }}
                      >
                        <ComputerIcon fontSize="medium" />
                      </Paper>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            )}
          </Grid>
          <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
            {is_loading_system && CardStatSkeleton}
            {is_success_system && (
              <Card variant="outlined" sx={{ position: "relative" }}>
                <CardActionArea>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Box display="grid">
                        <Typography
                          variant="subtitle1"
                          component="div"
                          fontWeight="medium"
                          sx={{ opacity: "0.9" }}
                        >
                          Node
                        </Typography>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ opacity: "1" }}
                        >
                          {system.mod.node}
                        </Typography>
                      </Box>
                      <Paper
                        variant="elevation"
                        elevation={2}
                        sx={{
                          display: "grid",
                          placeContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: 4,
                          boxShadow: "none",
                        }}
                      >
                        <GridViewRoundedIcon fontSize="medium" />
                      </Paper>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            )}
          </Grid>
          <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
            {is_loading_system && CardStatSkeleton}
            {is_success_system && (
              <Card variant="outlined" sx={{ position: "relative" }}>
                <CardActionArea>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Box display="grid">
                        <Typography
                          variant="subtitle1"
                          component="div"
                          fontWeight="medium"
                          sx={{ opacity: "0.9" }}
                        >
                          NPM
                        </Typography>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ opacity: "1" }}
                        >
                          {system.mod.npm}
                        </Typography>
                      </Box>
                      <Paper
                        variant="elevation"
                        elevation={2}
                        sx={{
                          display: "grid",
                          placeContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: 4,
                          boxShadow: "none",
                        }}
                      >
                        <GridViewRoundedIcon fontSize="medium" />
                      </Paper>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            )}
          </Grid>
          <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
            {is_loading_system && CardStatSkeleton}
            {is_success_system && (
              <Card variant="outlined" sx={{ position: "relative" }}>
                <CardActionArea>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Box display="grid">
                        <Typography
                          variant="subtitle1"
                          component="div"
                          fontWeight="medium"
                          sx={{ opacity: "0.9" }}
                        >
                          PostgreSQL
                        </Typography>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ opacity: "1" }}
                        >
                          {system.mod.postgresql}
                        </Typography>
                      </Box>
                      <Paper
                        variant="elevation"
                        elevation={2}
                        sx={{
                          display: "grid",
                          placeContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: 4,
                          boxShadow: "none",
                        }}
                      >
                        <GridViewRoundedIcon fontSize="medium" />
                      </Paper>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        key={snack.id}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={snack.open}
        autoHideDuration={snack.timeout}
        onClose={(event, reason) => {
          setSnack({ ...snack, open: false });
        }}
      >
        {snack.message}
      </Snackbar>
    </>
  );
}

Dashboard.getLayout = AdminShell;
