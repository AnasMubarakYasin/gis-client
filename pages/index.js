import Head from "next/head";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { createPortal, render } from "react-dom";
import { styled, useTheme, useMediaQuery } from "@mui/material";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import NoSsr from "@mui/material/NoSsr";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Link from "@mui/material/Link";

import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

import AdbIcon from "@mui/icons-material/Adb";
import RoomIcon from "@mui/icons-material/Room";
import CircleIcon from "@mui/icons-material/Circle";
import SearchIcon from "@mui/icons-material/Search";

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

import Page from "@/layout/Page";
import { useGetAllPublicQuery } from "@/store/projects";
import { capitalize_each_word } from "@/lib/helper-ui";
import { MAP } from "@/lib/const";

const nav_links = [
  { text: "Beranda", href: "/" },
  {
    text: "Monitoring",
    href: "/monitoring",
    sub: [
      { text: "Pembangunan", href: "/monitoring?pembangunan" },
      { text: "Perawatan", href: "/monitoring?perawatan" },
    ],
  },
  { text: "Berita", href: "/news" },
];
// const blogs = [{ img: "", published_at: "", title: "", desc: "", link: "" }];
/**
 * @type {import('mapbox-gl').Map}
 */
let map;

const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-122.4, 37.8] },
    },
  ],
};

const layerStyle = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": 10,
    "circle-color": "#007cbf",
  },
};

export default function Home(props) {
  const theme = useTheme();
  const app_name = process.env.NEXT_PUBLIC_WEB_NAME;
  const [ref_nav, set_nav_link] = useState(null);
  const [have_map, set_have_map] = useState(null);
  const [selected_tab, set_selected_tab] = useState(0);
  const [selected_marker, set_selected_marker] = useState(0);
  const [list_message, set_list_message] = useState("");
  const [selected_sub_district, set_selected_sub_district] = useState("");
  const open = !!ref_nav;
  const {
    data = [],
    error,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch,
  } = useGetAllPublicQuery();
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
  projects = data.filter((item) => {
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
  function handle_nav_click(event) {
    set_nav_link(event.currentTarget);
  }
  function handle_nav_close() {
    set_nav_link(null);
  }
  function handle_tab_change(event, value) {
    set_selected_tab(value);
  }
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
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

  return (
    <section>
      <Head>
        <title>Home</title>
      </Head>
      <Page animate>
        <AppBar position="static">
          <Toolbar></Toolbar>
        </AppBar>
        <AppBar position="fixed">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Avatar
                alt={app_name}
                src="/proto-512.v2.svg"
                variant="rounded"
                sx={{ display: { xs: "none", sm: "flex" }, mr: 2 }}
              />
              <IconButton sx={{ display: { xs: "flex", sm: "none" }, mr: 1 }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" mr={2}>
                {app_name}
              </Typography>
              <Box flexGrow={1}></Box>
              <Box
                component="nav"
                display="flex"
                gap="44px"
                alignItems="center"
              >
                <Box
                  gap="24px"
                  alignItems="center"
                  sx={{ display: { xs: "none", sm: "flex" } }}
                >
                  {nav_links.map((nav) => (
                    <NextLink href={nav.href} key={nav.href}>
                      <>
                        <Link
                          href={nav.href}
                          underline="hover"
                          color="white"
                          onClick={(e) => {
                            if (nav.sub) {
                              e.preventDefault();
                              handle_nav_click(e);
                            }
                          }}
                        >
                          {nav.text}
                        </Link>
                        {nav.sub && (
                          <Menu
                            id="sub navigation"
                            disableScrollLock
                            anchorEl={ref_nav}
                            open={open}
                            onClose={handle_nav_close}
                            MenuListProps={{
                              "aria-labelledby": "basic-button",
                            }}
                          >
                            {nav.sub.map((nav_s) => (
                              <NextLink href={nav_s.href} key={nav_s.href}>
                                <MenuItem onClick={handle_nav_close}>
                                  <Link
                                    href={nav.href}
                                    underline="hover"
                                    color="white"
                                  >
                                    {nav_s.text}
                                  </Link>
                                </MenuItem>
                              </NextLink>
                            ))}
                          </Menu>
                        )}
                      </>
                    </NextLink>
                  ))}
                </Box>
                <NextLink href="/admin/signin">
                  <Button
                    variant="contained"
                    disableElevation
                    href="/admin/signin"
                  >
                    Login
                  </Button>
                </NextLink>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <Container
          component="main"
          maxWidth="lg"
          sx={{
            py: {
              xs: theme.spacing(1),
              md: theme.spacing(2),
            },
            px: {
              xs: theme.spacing(1),
              sm: theme.spacing(2),
              md: theme.spacing(4),
              lg: theme.spacing(6),
              xl: theme.spacing(8),
            },
          }}
        >
          <Box display="grid" gap="32px">
            <Box display="grid" gap={theme.spacing(2)}>
              <Box>
                <Box display="flex" justifyContent="space-between">
                  <Tabs
                    value={selected_tab}
                    onChange={handle_tab_change}
                    aria-label="status proyek"
                  >
                    <Tab label="All" {...a11yProps(0)} />
                    <Tab label="Pembangunan" {...a11yProps(1)} />
                    <Tab label="Perawatan" {...a11yProps(2)} />
                  </Tabs>
                  <FormControl
                    variant="outlined"
                    size="small"
                    sx={{ display: { xs: "none", sm: "block" } }}
                  >
                    <OutlinedInput
                      sx={{ bgcolor: theme.palette.background.paper }}
                      size="small"
                      id="input-search"
                      // value={values.weight}
                      // onChange={handleChange("weight")}
                      placeholder="Search..."
                      startAdornment={
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      }
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        "aria-label": "search",
                      }}
                    />
                  </FormControl>
                </Box>

                <Divider light></Divider>
              </Box>
              <Box>
                <Grid
                  container
                  spacing={{ xs: 1, sm: 2 }}
                  columns={{ xs: 1, sm: 12 }}
                >
                  <Grid
                    item
                    xs={1}
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
                        mapStyle={
                          /* MAP.STYLE */ "mapbox://styles/mapbox/dark-v10"
                        }
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
                  <Grid item xs={1} sm={4}>
                    <Paper variant="outlined">
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
              </Box>
            </Box>
            <Box display="grid" gap="16px">
              <Box display="flex">
                <Typography
                  variant="h5"
                  fontWeight={theme.typography.fontWeightBold}
                >
                  Berita
                </Typography>
              </Box>
              <Grid
                container
                spacing={{ xs: 1, sm: 1, md: 2, lg: 3 }}
                columns={{ xs: 1, sm: 1, md: 4, lg: 9 }}
              >
                {[1, 2, 3, 4, 5].map((item, index) => (
                  <Grid item xs={1} sm={1} md={2} lg={3} key={item + index}>
                    <Card sx={{}}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                          alt="green iguana"
                        />
                        <CardContent>
                          <Typography variant="overline">
                            Maret 23, 2022
                          </Typography>
                          <Typography variant="h5" gutterBottom>
                            Lizard
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Lizards are a widespread group of squamate reptiles,
                            with over 6,000 species, ranging across all
                            continents except Antarctica
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Container>
        <Paper variant="elevation" elevation={0}>
          <Box
            display="grid"
            justifyContent="center"
            alignContent="center"
            padding={theme.spacing(2)}
          >
            <Typography fontSize={theme.typography.pxToRem(16)}>
              Copyright &copy; 2022 Bladerlaiga, All Right Reserved.
            </Typography>
          </Box>
        </Paper>
      </Page>
    </section>
  );
}
