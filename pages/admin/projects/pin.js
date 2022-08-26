import { useEffect, useState, useContext } from "react";
import { createRoot } from "react-dom/client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { styled, useTheme, useMediaQuery } from "@mui/material";

import "mapbox-gl/dist/mapbox-gl.css";
import {
  Map,
  useMap,
  MapProvider,
  Marker,
  Popup,
  AttributionControl,
  GeolocateControl,
  NavigationControl,
  ScaleControl,
} from "react-map-gl";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import NoSsr from "@mui/material/NoSsr";

import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";

import SearchIcon from "@mui/icons-material/Search";
import RoomIcon from "@mui/icons-material/Room";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

import AdminShell from "@/layout/AdminShell";
import ContextAuthenticate from "@/context/authenticate";
import ContextAdmin from "@/context/admin";
import { useGlobal } from "@/lib/helper-ui";
import { MAP } from "@/lib/const";

/**
 * @type {import('mapbox-gl').Map}
 */
let map;

function CustomControl(props) {
  const { current: map } = useMap();

  useEffect(() => {
    const root = createRoot(
      document.getElementsByClassName("mapboxgl-ctrl-top-left").item(0)
    );
    map.addControl({
      onAdd(map) {
        // this.elm = document.createElement("div");
        // this.elm.className = "mapboxgl-ctrl";

        root.render(<div className="mapboxgl-ctrl">{props.children}</div>);
        // this.elm = elm;
        // return elm;
        return document.createElement("div");
      },
      onRemove() {
        // this.elm.parentNode.removeChild(this.elm);
      },
    });
  }, []);

  return <></>;
}
function CenterPin(props) {
  const { current: map } = useMap();

  useEffect(() => {
    const div = document.createElement("div");
    div.style.display = "grid";
    div.style.position = "absolute";
    div.style.top = "-12px";
    div.style.width = "100%";
    div.style.height = "100%";
    const root = createRoot(div);
    root.render(props.children);
    map.getCanvasContainer().append(div);
  }, []);

  return <></>;
}
function geocoding_reverse({ ept = "mapbox.places", lng, lat, token, signal }) {
  return fetch(
    `https://api.mapbox.com/geocoding/v5/${ept}/${lng},${lat}.json?access_token=${token}`
  ).then((res) => res.json());
}

export default function Pin(props) {
  const router = useRouter();
  const theme = useTheme();
  // const ctx_auth = useContext(ContextAuthenticate);
  const ctx_admin = useContext(ContextAdmin);
  // @ts-ignore
  // const user = useSelector((state) => state.user);
  const [get_temp_project, set_temp_project] = useGlobal("project");
  const [have_map, set_have_map] = useState(false);
  const [select_disabled, set_select_disabled] = useState(true);
  const [values, set_values] = useState({
    coordinate: [MAP.LNG, MAP.LAT],
    address: MAP.NAME.join(", "),
  });

  useEffect(() => {
    const project = get_temp_project();
    if (!project) {
      router.back();
    } else {
      let coord;
      let addr;
      if (typeof project.coordinate == "object") {
        coord = project.coordinate;
        addr = project.address.join(", ");
      } else if (typeof project.coordinate == "string" && project.coordinate) {
        coord = project.coordinate.split(",").map((coord) => +coord);
        addr = project.addr;
        set_values({ coordinate: coord, address: addr });
        if (map) {
          map.flyTo({ center: coord });
        }
      }
    }
  }, []);
  useEffect(() => {
    ctx_admin.set_ctx_data({
      title: "Select Location",
      active_link: "/admin/projects",
    });
  }, []);
  useEffect(() => {
    if (have_map) {
      set_style();
      map.once("styledata", () => {
        set_source();
        set_select_disabled(false);
      });
      // @ts-ignore
      map.flyTo({ center: values.coordinate });
    }
  }, [have_map, theme.palette.mode]);
  function set_style() {
    if (theme.palette.mode == "dark") {
      map.setStyle("mapbox://styles/mapbox/dark-v10");
    } else {
      map.setStyle(MAP.STYLE);
    }
  }
  function set_source() {
    const fill =
      theme.palette.mode == "dark" ? "rgba(200, 100, 240, 1)" : "#627BC1";
    const line_fill =
      theme.palette.mode == "dark" ? "rgba(200, 100, 240, 1)" : "#627BC1";
    const color = theme.palette.mode == "dark" ? "white" : "black";
    if (map.getSource("wajo")) {
      return;
    }
    map.addSource("wajo", {
      type: "geojson",
      data: "/data/wajo.json",
    });
    map.addLayer({
      id: "wajo-fills",
      type: "fill",
      source: "wajo",
      layout: {},
      paint: {
        "fill-color": fill,
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          1,
          0.1,
        ],
      },
    });
    map.addLayer({
      id: "wajo-borders",
      type: "line",
      source: "wajo",
      layout: {},
      paint: {
        "line-color": line_fill,
        "line-width": 2,
      },
    });
    map.addLayer({
      id: "wajo-labels",
      type: "symbol",
      source: "wajo",
      layout: {
        "text-field": [
          "format",
          ["upcase", ["get", "Name"]],
          { "font-scale": 0.7 },
          "\n",
          {},
        ],
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      },
      paint: { "text-color": color },
    });
  }
  function handle_select() {
    const project = get_temp_project();
    project.coordinate = values.coordinate.join(",");
    project.address = values.address;
    set_temp_project(project);
    router.back();
  }
  function handle_load(event) {
    map = event.target;
    // const coord = map.getCenter();
    set_have_map(true);
  }
  function handle_move(event) {
    const coord = event.target.getCenter();
    const center = [coord.lng, coord.lat];
    set_values({ coordinate: center, address: values.address });
  }
  function handle_move_str(event) {
    set_select_disabled(true);
  }
  function handle_move_end(event) {
    const coord = event.target.getCenter();
    geocoding_reverse({
      ...coord,
      token: MAP.TOKEN,
    }).then((body) => {
      const address = [];
      const address_visible = [];
      for (const feature of body.features) {
        address.unshift(feature.text);
        switch (feature.place_type[0]) {
          case "neighborhood":
          case "locality":
          case "place":
          case "region":
          case "country":
            address_visible.unshift(feature.text);
          case "poi":
            break;
          case "postcode":
            break;
          default:
            break;
        }
      }
      set_values({
        coordinate: values.coordinate,
        address: address_visible.join(", "),
      });
      set_select_disabled(false);
    });
  }

  return (
    <>
      <Box
        display="grid"
        padding={{
          xs: "16px",
          sm: "32px",
        }}
        gap={{
          xs: "16px",
          sm: "32px",
        }}
      >
        <Paper variant="outlined">
          <Box
            display="grid"
            padding={{
              xs: "8px",
              sm: "16px",
            }}
            gap={{
              xs: "8px",
              sm: "16px",
              md: "24px",
            }}
          >
            <Box display="grid" sx={{ aspectRatio: { xs: "1", sm: "4 / 2" } }}>
              <NoSsr>
                <Map
                  mapboxAccessToken={MAP.TOKEN}
                  initialViewState={{
                    longitude: values.coordinate[0],
                    latitude: values.coordinate[1],
                    // @ts-ignore
                    bounds: MAP.BBOX,
                    zoom: MAP.ZOOM,
                  }}
                  style={{ borderRadius: "6px" }}
                  mapStyle={MAP.STYLE}
                  onMove={handle_move}
                  onMoveStart={handle_move_str}
                  onMoveEnd={handle_move_end}
                  onLoad={handle_load}
                >
                  <CenterPin>
                    <Box
                      display="grid"
                      justifyContent="center"
                      alignContent="center"
                      zIndex={1}
                    >
                      <RoomIcon fontSize="large" color="primary" />
                    </Box>
                  </CenterPin>
                  {/* <CustomControl>
                    <FormControl variant="outlined" size="small">
                      <OutlinedInput
                        sx={{ bgcolor: "white" }}
                        size="small"
                        id="input-search"
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
                  </CustomControl> */}
                  {/* <GeolocateControl /> */}
                  <NavigationControl />
                  <ScaleControl />
                </Map>
              </NoSsr>
            </Box>
            <Box display="grid" gap={theme.spacing(3)}>
              <Box display="grid" gap={theme.spacing(2)}>
                <TextField
                  id="coordinate"
                  label="Kordinat"
                  variant="outlined"
                  value={values.coordinate.join(",")}
                  aria-readonly
                />
                <TextField
                  id="address"
                  label="Alamat"
                  variant="outlined"
                  value={values.address}
                  aria-readonly
                />
              </Box>
              <Button
                variant="contained"
                size="large"
                disableElevation
                disabled={select_disabled}
                onClick={handle_select}
              >
                Pilih
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

Pin.getLayout = AdminShell;
