import { useEffect, useState, useContext, useRef } from "react";
import { createRoot } from "react-dom/client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { styled, useTheme, useMediaQuery } from "@mui/material";

import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
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
import Portal from "@mui/material/Portal";

import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";

import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import SearchIcon from "@mui/icons-material/Search";
import RoomIcon from "@mui/icons-material/Room";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import PanToolIcon from "@mui/icons-material/PanTool";
import TimelineIcon from "@mui/icons-material/Timeline";
import DeleteIcon from "@mui/icons-material/Delete";
import CircleIcon from "@mui/icons-material/Circle";

import AdminShell from "@/layout/AdminShell";
import ContextAuthenticate from "@/context/authenticate";
import ContextAdmin from "@/context/admin";
import { useGlobal } from "@/lib/helper-ui";
import { MAP } from "@/lib/const";

import { useGetAllPublicQuery } from "@/store/projects";

/**
 *
 * @param {[[number,number],[number,number]]} coordinates
 */
function eucledian([[lat1, lon1], [lat2, lon2]]) {
  console.log([
    [lon1, lat1],
    [lon2, lat2],
  ]);
  return Math.sqrt(((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2)) + 111.319;
}
/**
 *
 * @param {[[number,number],[number,number]]} coordinates
 */
function spherical([[lon1, lat1], [lon2, lat2]]) {
  return (
    Math.acos(
      Math.sin(lat1) * Math.sin(lat2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)
    ) * 6371000
  );
}

function CustomControl(props) {
  const { current: map } = useMap();
  useEffect(() => {
    if (!props.position) {
      props.position = "top-left";
    }
    const root = createRoot(
      document.getElementsByClassName("mapboxgl-ctrl-" + props.position).item(0)
    );
    map.addControl({
      onAdd(map) {
        root.render(<div className="mapboxgl-ctrl">{props.children}</div>);
        return document.createElement("div");
      },
      onRemove() {},
    });
  }, []);
  return <></>;
}
const ctrl = {
  btn: "move",
};
// REVIEW maybe error on server
const event = new EventTarget();

export default function Distance(props) {
  const router = useRouter();
  const theme = useTheme();
  const container = useRef(null);
  // const ctx_auth = useContext(ContextAuthenticate);
  const ctx_admin = useContext(ContextAdmin);
  // @ts-ignore
  // const user = useSelector((state) => state.user);
  const {
    data: projects = [],
    error: projects_error,
    isLoading: project_loading,
    isFetching: project_fetching,
    isSuccess: project_success,
    isError: project_error,
    refetch,
  } = useGetAllPublicQuery();

  const [btn_ctrl, set_btn_ctrl] = useState("move");
  const [have_map, set_have_map] = useState(false);
  const [coordinates, set_coordinates] = useState([
    [0, 0],
    [0, 0],
  ]);
  const [address_list, set_address_list] = useState(["", ""]);
  const [distance, set_distance] = useState("");
  const [select_disabled, set_select_disabled] = useState(true);
  const [values, set_values] = useState({
    coordinate: [MAP.LNG, MAP.LAT],
    address: MAP.NAME.join(", "),
  });
  const handle_ctrl = (evt, btn) => {
    set_btn_ctrl(btn);
    event.dispatchEvent(new CustomEvent("change", { detail: { btn } }));
  };

  useEffect(() => {
    ctx_admin.set_ctx_data({
      title: "Distance",
      active_link: "/admin/distance",
    });
  }, []);
  useEffect(() => {
    if (have_map) {
    }
  }, [have_map, theme.palette.mode]);

  function handle_select() {
    // @ts-ignore
    // set_distance(spherical(coordinates) + " km");
    set_distance(eucledian(coordinates) + " km");
  }
  function handle_load(event) {
    set_have_map(true);
    set_style(event.target);
    // set_source(event.target);
  }
  /**
   * @param {import('mapbox-gl').Map} map
   */
  function set_style(map) {
    map.once("styledata", () => {
      set_source(map);
      // set_select_disabled(false);
    });
    if (theme.palette.mode == "dark") {
      map.setStyle("mapbox://styles/mapbox/dark-v10");
    } else {
      map.setStyle(MAP.STYLE);
    }
  }
  /**
   * @param {import('mapbox-gl').Map} map
   */
  function set_source(map) {
    let project_clicked = [0, 0];
    // SECTION wajo
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
    // SECTION projects
    map.addSource("projects", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: projects.map((project, index) => {
          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: project.coordinate,
            },
            properties: {
              id: String(Date.now()),
              index,
              name: project.name,
              address: project.address.join(", "),
            },
          };
        }),
      },
    });
    map.addLayer({
      id: "project-point",
      source: "projects",
      type: "circle",
      paint: {
        "circle-radius": 10,
        "circle-color": "#007cbf",
      },
    });
    map.on("click", "project-point", (e) => {
      project_clicked = projects[e.features.at(0).properties.index].coordinate;
      if (ctrl.btn == "move") {
        new mapboxgl.Popup()
          // @ts-ignore
          .setLngLat(project_clicked)
          .setHTML(
            `<div style="color: #111;">${
              e.features.at(0).properties.name
            }</div>`
          )
          .addTo(map);
      } else if (ctrl.btn == "line") {
        e.preventDefault();
        if (point_count == 0) {
          set_address_list([e.features.at(0).properties.address, ""]);
        } else if (point_count == 1) {
          set_address_list([
            address_list.at(0),
            e.features.at(0).properties.address,
          ]);
        }
      }
    });
    map.on("mouseenter", "project-point", (e) => {
      if (ctrl.btn == "move") {
        map.getCanvas().style.cursor = "pointer";
      } else if (ctrl.btn == "line") {
        e.originalEvent.stopPropagation();
        map.getCanvas().style.cursor = "pointer";
      }
    });
    map.on("mousemove", "project-point", (e) => {
      if (ctrl.btn == "line") {
        e.preventDefault();
        // e.originalEvent.preventDefault();
        // e.originalEvent.stopPropagation();
        // e.originalEvent.stopImmediatePropagation();
        map.getCanvas().style.cursor = "pointer";
      }
    });
    map.on("mouseleave", "project-point", () => {
      if (ctrl.btn == "move") {
        map.getCanvas().style.cursor = "";
      }
    });
    // SECTION distance
    const geojson = { features: [], type: "FeatureCollection" };
    const linestring = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [],
      },
    };
    map.addSource("geojson", {
      type: "geojson",
      // @ts-ignore
      data: geojson,
    });
    map.addLayer({
      id: "measure-points",
      type: "circle",
      source: "geojson",
      paint: {
        "circle-radius": 5,
        "circle-color": "#000",
      },
      filter: ["in", "$type", "Point"],
    });
    map.addLayer({
      id: "measure-lines",
      type: "line",
      source: "geojson",
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#000",
        "line-width": 2.5,
      },
      filter: ["in", "$type", "LineString"],
    });
    let point_count = 0;
    let line_count = 0;
    event.addEventListener("change", (event) => {
      // @ts-ignore
      ctrl.btn = event.detail.btn;
      if (ctrl.btn == "delete") {
        point_count = 0;
        set_coordinates([
          [0, 0],
          [0, 0],
        ]);
        set_address_list(["", ""]);
        set_select_disabled(true);
        geojson.features.splice(0);
        const source = map.getSource("geojson");
        if (source.type == "geojson") {
          // @ts-ignore
          source.setData(geojson);
        }
      }
    });
    map.on("click", "wajo-fills", (e) => {
      if (ctrl.btn == "line") {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["measure-points"],
        });
        // Remove the linestring from the group
        // so we can redraw it based on the points collection.
        if (geojson.features.length > 1) geojson.features.pop();

        // If a feature was clicked, remove it from the map.
        if (features.length) {
          const id = features[0].properties.id;
          geojson.features = geojson.features.filter(
            (point) => point.properties.id !== id
          );
          point_count--;
        } else {
          if (point_count >= 2) {
            return;
          }
          if (point_count >= 1) {
            set_select_disabled(false);
          }
          const point = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: e.lngLat.toArray(),
            },
            properties: {
              id: String(Date.now()),
            },
          };
          if (e.defaultPrevented) {
            point.geometry.coordinates = project_clicked;
          }

          point_count++;
          geojson.features.push(point);
          const list = [];
          geojson.features.forEach((feature) => {
            if (feature.geometry.type == "Point") {
              list.push(feature.geometry.coordinates);
            }
          });
          set_coordinates(list);
        }
        if (geojson.features.length > 1) {
          linestring.geometry.coordinates = geojson.features.map(
            (point) => point.geometry.coordinates
          );
          geojson.features.push(linestring);
        }
        const source = map.getSource("geojson");
        if (source.type == "geojson") {
          // @ts-ignore
          source.setData(geojson);
        }
      } else if (ctrl.btn == "delete") {
      }
    });
    map.on("mousemove", "wajo-fills", (e) => {
      if (ctrl.btn == "move") {
        // map.getCanvas().style.cursor = "grab";
      } else if (ctrl.btn == "delete") {
        map.getCanvas().style.cursor = "default";
      } else if (ctrl.btn == "line") {
        if (e.defaultPrevented) return;
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["measure-points"],
        });
        map.getCanvas().style.cursor = features.length
          ? "pointer"
          : "crosshair";
      }
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
                  onLoad={handle_load}
                >
                  <CustomControl position="top-right">
                    <Box ref={container}></Box>
                  </CustomControl>
                  <NavigationControl position="bottom-right" />
                  <ScaleControl />
                </Map>
              </NoSsr>
            </Box>
            <Portal container={container.current}>
              <Paper
                elevation={0}
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                <ToggleButtonGroup
                  value={btn_ctrl}
                  exclusive
                  onChange={handle_ctrl}
                  aria-label="tool"
                  size="small"
                  orientation="vertical"
                  sx={{}}
                >
                  <ToggleButton value="move" aria-label="move tool">
                    <PanToolIcon />
                  </ToggleButton>
                  <ToggleButton value="line" aria-label="line tool">
                    <TimelineIcon />
                  </ToggleButton>
                  <ToggleButton value="delete" aria-label="delete tool">
                    <DeleteIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Paper>
            </Portal>
            <Box display="grid" gap={theme.spacing(3)}>
              <Box display="grid" gap={theme.spacing(2)}>
                <Box display="flex" gap={theme.spacing(2)}>
                  <TextField
                    fullWidth
                    id="from"
                    label="Dari"
                    variant="outlined"
                    value={coordinates.at(0)?.join(", ") ?? ""}
                  />
                  <TextField
                    fullWidth
                    id="to"
                    label="Ke"
                    variant="outlined"
                    value={coordinates.at(1)?.join(", ") ?? ""}
                  />
                </Box>
                <Box display="flex" gap={theme.spacing(2)}>
                  <TextField
                    fullWidth
                    id="from-address"
                    label="Alamat Dari"
                    variant="outlined"
                    value={address_list.at(0) ?? ""}
                  />
                  <TextField
                    fullWidth
                    id="to-address"
                    label="Alamat Ke"
                    variant="outlined"
                    value={address_list.at(1) ?? ""}
                  />
                </Box>
                <TextField
                  id="distance"
                  label="Jarak"
                  variant="outlined"
                  value={distance}
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
                Hitung
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

Distance.getLayout = AdminShell;
