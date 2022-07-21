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

export default function Pin(props) {
  const TOKEN_MAP = process.env.NEXT_PUBLIC_MAP_TOKEN;
  const router = useRouter();
  const theme = useTheme();
  // const ctx_auth = useContext(ContextAuthenticate);
  const ctx_admin = useContext(ContextAdmin);
  // @ts-ignore
  const user = useSelector((state) => state.user);
  const [get_temp_project, set_temp_project] = useGlobal("project");
  const [center, set_center] = useState([120.1390389, -3.9681887]);
  const [viewState, set_view_state] = useState({
    longitude: 120.1390389,
    latitude: -3.9681887,
    zoom: 9,
  });

  useEffect(() => {
    const project = get_temp_project();

    if (!project) {
      router.back();
    } else {
      let coord;
      if (typeof project.coordinate == "object") {
        coord = project.coordinate;
      } else if (project.coordinate) {
        coord = project.coordinate.split(",").map((coord) => +coord);
      }
      if (coord) {
        set_view_state((prev) => {
          return { longitude: coord[0], latitude: coord[1], zoom: prev.zoom };
        });
      }
    }
  }, []);
  useEffect(() => {
    ctx_admin.set_ctx_data({
      title: "Select Location",
      active_link: "/admin/projects",
    });
  }, []);

  function handleSelect() {
    const project = get_temp_project();
    project.coordinate = center.join(",");
    set_temp_project(project);
    router.back();
  }
  function handleLoad(event) {
    const coord = event.target.getCenter();
    set_center([coord.lng, coord.lat]);
  }
  function handleMove(event) {
    const coord = event.target.getCenter();
    set_center([coord.lng, coord.lat]);
    set_view_state(event.viewState);
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
            }}
          >
            <Box display="grid" sx={{ aspectRatio: { xs: "1", sm: "4 / 2" } }}>
              <NoSsr>
                <Map
                  mapboxAccessToken={TOKEN_MAP}
                  {...viewState}
                  style={{ borderRadius: "6px" }}
                  mapStyle="mapbox://styles/mapbox/streets-v9"
                  onMove={handleMove}
                  onLoad={handleLoad}
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
                  <CustomControl>
                    <FormControl variant="outlined" size="small">
                      {/* <InputLabel htmlFor="input-search">Search...</InputLabel> */}
                      <OutlinedInput
                        sx={{ bgcolor: "white" }}
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
                  </CustomControl>
                  <GeolocateControl />
                  <NavigationControl />
                  <ScaleControl />
                </Map>
              </NoSsr>
            </Box>
            <Box>
              <Button
                variant="contained"
                size="large"
                disableElevation
                onClick={handleSelect}
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
