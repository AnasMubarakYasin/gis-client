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
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

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
import CircleIcon from "@mui/icons-material/Circle";

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

import NoSsr from "@mui/material/NoSsr";

import "mapbox-gl/dist/mapbox-gl.css";
import {
  Map,
  useMap,
  MapProvider,
  Marker,
  Popup,
  Source,
  Layer,
  AttributionControl,
  GeolocateControl,
  NavigationControl,
  ScaleControl,
} from "react-map-gl";
import { MAP } from "@/lib/const";

import AdminShell from "@/layout/AdminShell";
import ContextAuthenticate from "@/context/authenticate";
import AdminContext from "@/context/admin";
import { useGlobal, capitalize_each_word } from "@/lib/helper-ui";
import { useStatsQuery, useSystemQuery } from "@/store/models";
import { useGetAllQuery } from "@/store/projects";

const stats = [];
/**
 * @type {import('mapbox-gl').Map}
 */
let map;
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
    data: raw_projects = [],
    error: error_projects,
    isLoading: is_loading_project,
    isFetching: is_fetching_project,
    isSuccess: is_success_project,
    isError: is_error_project,
    // @ts-ignore
  } = useGetAllQuery({ token: user.token });
  const {
    // data: system,
    error: error_system,
    // isLoading: is_loading_system,
    isFetching: is_fetching_system,
    // isSuccess: is_success_system,
    isError: is_error_system,
    refetch: refetch_system,
  } = useSystemQuery({ token: user.token }, { skip: true });
  const [system, setSystem] = useState(null);
  const [is_loading_system, set_is_loading_system] = useState(true);
  const [is_success_system, set_is_success_system] = useState(false);

  const [get_client_sse, set_client_sse] = useGlobal("client_sse_system");
  const [snack, setSnack] = useState({
    id: "default",
    open: false,
    timeout: 6000,
    message: <div></div>,
  });
  const [have_map, set_have_map] = useState(null);
  const [selected_tab, set_selected_tab] = useState(0);
  const [selected_marker, set_selected_marker] = useState(0);
  const [list_message, set_list_message] = useState("");
  const [selected_sub_district, set_selected_sub_district] = useState("");

  let project_status_filter = ".*";
  let project_status = "All";
  let projects = [];
  switch (selected_tab) {
    case 1:
      project_status = project_status_filter = "Pembangunan";
      break;
    case 2:
      project_status = project_status_filter = "Perawatan";
      break;
  }
  if (selected_sub_district) {
    project_status += ` ${selected_sub_district}`;
  }
  projects = raw_projects.filter((item) => {
    const address = new RegExp(`${selected_sub_district || ".*"}`).test(
      item.address.join(" ")
    );
    const status = new RegExp(`${project_status_filter}`).test(item.status);
    return status && address;
  });
  project_status += ` (${projects.length})`;

  useEffect(() => {
    if (!map) {
      set_have_map(false);
    } else {
    }
  }, [map]);
  useEffect(() => {
    ctx_admin.set_ctx_data({
      title: "Dashboard",
      active_link: "/admin/dashboard",
    });
  }, []);
  useEffect(() => {
    let client_sse = get_client_sse();
    if (!client_sse) {
      client_sse = set_client_sse(
        new EventSource(`/api/v1/models/system?authc=${user.token}`)
      );
    }
    if (client_sse.readyState == EventSource.CLOSED) {
      client_sse = set_client_sse(
        new EventSource(`/api/v1/models/system?authc=${user.token}`)
      );
    }
    client_sse.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        setSystem(data);
        set_is_loading_system(false);
        set_is_success_system(true);
      } catch (error) {
        setSnack({
          ...snack,
          open: true,
          message: (
            <Alert elevation={6} severity="error">
              {error.message}
            </Alert>
          ),
        });
      }
    });
    client_sse.addEventListener("error", (event) => {
      console.error(event);
      set_is_loading_system(false);
      setSnack({
        ...snack,
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            Something Wrong
          </Alert>
        ),
      });
    });
    router.events.on("routeChangeStart", () => {
      client_sse.close();
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
  // useEffect(() => {
  //   if (is_success_system) {
  //     const id = setTimeout(() => {
  //       refetch_system();
  //     }, 1500);
  //     return () => {
  //       clearTimeout(id);
  //     };
  //   }
  //   if (is_error_system) {
  //     const message = convertAndHandleErrorApi(error_system);
  //     setSnack({
  //       ...snack,
  //       open: true,
  //       message: (
  //         <Alert elevation={6} severity="error">
  //           {message}
  //         </Alert>
  //       ),
  //     });
  //   }
  // }, [is_success_system, is_error_system, is_fetching_system]);

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
  function handle_list_click(event, item) {
    set_selected_marker(item.id);
    map.flyTo({ center: item.coordinate, zoom: 11 });
  }
  function handle_load(event) {
    map = event.target;
    set_have_map(true);
    let hoveredStateId = null;
    let firstSymbolId = null;
    const layers = map.getStyle().layers;
    for (const layer of layers) {
      if (layer.type === "symbol") {
        firstSymbolId = layer.id;
        break;
      }
    }
    map.addSource("wajo", {
      type: "geojson",
      data: "/data/wajo.json",
    });
    map.addLayer(
      {
        id: "state-fills",
        type: "fill",
        source: "wajo",
        layout: {},
        paint: {
          "fill-color": "rgba(200, 100, 240, 1)",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0.25,
          ],
        },
      },
      firstSymbolId
    );
    map.addLayer({
      id: "state-borders",
      type: "line",
      source: "wajo",
      layout: {},
      paint: {
        "line-color": "rgba(200, 100, 240, 1)",
        "line-width": 2,
      },
    });
    map.on("mousemove", "state-fills", (e) => {
      if (e.features.length > 0) {
        if (hoveredStateId !== null) {
          map.setFeatureState(
            { source: "wajo", id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = e.features[0].id;
        map.setFeatureState(
          { source: "wajo", id: hoveredStateId },
          { hover: true }
        );
      }
    });
    map.on("mouseleave", "state-fills", () => {
      if (hoveredStateId !== null) {
        map.setFeatureState(
          { source: "wajo", id: hoveredStateId },
          { hover: false }
        );
      }
      hoveredStateId = null;
    });

    map.addLayer({
      id: "wajo-labels",
      type: "symbol",
      source: "wajo",
      layout: {
        "text-field": [
          "format",
          ["upcase", ["get", "Name"]],
          { "font-scale": 0.75 },
          "\n",
          {},
        ],
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      },
      paint: {
        "text-halo-color": "#000",
        "text-halo-width": 1,
        "text-color": "#fff",
      },
    });

    map.on("click", "state-fills", (event) => {
      console.log(event);
      if (event.features) {
        const [feature] = event.features;
        set_selected_sub_district(
          capitalize_each_word(feature.properties.Name)
        );
      }
      // @ts-ignore
      map.flyTo({ center: event.lngLat.toArray(), zoom: 10 });
    });
    map.on("mouseenter", "state-fills", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "state-fills", () => {
      map.getCanvas().style.cursor = "";
    });
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
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            {is_fetching_stat && CardStatSkeleton}
            {is_success_stat && (
              <Grid container spacing={{ xs: 2, sm: 2, md: 4, lg: 4, xl: 8 }}>
                <Grid
                  item
                  xs={12}
                  sm={8}
                  sx={{ aspectRatio: { xs: "1", sm: "2 / 1.25" } }}
                >
                  <NoSsr>
                    <Map
                      mapboxAccessToken={MAP.TOKEN}
                      initialViewState={{
                        longitude: MAP.LNG,
                        latitude: MAP.LAT,
                        zoom: MAP.ZOOM,
                      }}
                      style={{ borderRadius: "6px" }}
                      mapStyle={"mapbox://styles/mapbox/dark-v10"}
                      onLoad={handle_load}
                    >
                      {/* <GeolocateControl /> */}
                      <NavigationControl />
                      <ScaleControl />
                      {/* <Source id="my-data" type="geojson" data={geojson}>
                      <Layer {...layerStyle} />
                    </Source> */}
                      {projects.map((item) => (
                        <Marker
                          key={"marker" + item.name}
                          longitude={item.coordinate[0]}
                          latitude={item.coordinate[1]}
                          anchor="bottom"
                        >
                          <CircleIcon color="primary" fontSize="medium" />
                        </Marker>
                      ))}
                    </Map>
                  </NoSsr>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper
                    variant="outlined"
                    sx={{
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ px: theme.spacing(2), pt: theme.spacing(2) }}
                    >
                      View {project_status}
                    </Typography>
                    <List component="nav" aria-label="list projects">
                      {projects.map((item) => (
                        <ListItemButton
                          key={"list" + item.name}
                          selected={selected_marker == item.id}
                          disabled={!have_map}
                          onClick={(event) => handle_list_click(event, item)}
                        >
                          <ListItemAvatar>
                            <Avatar alt={item.name} src={item.image} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={item.name}
                            secondary={item.address.slice(2).join(", ")}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              </Grid>
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
