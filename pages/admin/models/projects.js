import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { styled, useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import NoSsr from "@mui/material/NoSsr";

import Button from "@mui/material/Button";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import CachedIcon from "@mui/icons-material/Cached";

import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  GridToolbarExport,
  GridCellEditStopReasons,
} from "@mui/x-data-grid";
// import { useDemoData } from '@mui/x-data-grid-generator';

import AdminShell from "@/layout/AdminShell";
import ContextAuthenticate from "@/context/authenticate";
import AdminContext from "@/context/admin";

const columns = [
  { field: "id", headerName: "ID" },
  { field: "id_admins", headerName: "ID Admin" },
  { field: "id_supervisors", headerName: "ID Supervisor" },
  {
    field: "name",
    headerName: "Name",
    editable: true,
  },
  {
    field: "name_company",
    headerName: "Company Name",
    editable: true,
  },
  {
    field: "contract_number",
    headerName: "Contract Number",
    editable: true,
  },
  {
    field: "contract_date",
    headerName: "Contract Date",
    editable: true,
    type: "date",
  },
  {
    field: "activity",
    headerName: "Activity",
    editable: true,
  },
  {
    field: "status",
    headerName: "Status",
    editable: true,
    type: "singleSelect",
    valueOptions: ["Pembangunan", "Perawatan"],
  },
  {
    field: "progress",
    headerName: "Progress",
    editable: true,
    type: "number",
  },
  {
    field: "fiscal_year",
    headerName: "Fiscal Year",
    editable: true,
  },
  {
    field: "fund_source",
    headerName: "Fund Source",
    editable: true,
  },
  {
    field: "coordinate",
    headerName: "Coordinate",
    editable: true,
    // valueGetter: ({ value }) => value && value.join(", "),
  },
  {
    field: "address",
    headerName: "Address",
    editable: true,
    // valueGetter: ({ value }) => value && value.join(", "),
  },
];

import {
  useGetQuery,
  useUpdateMutation,
  useDeleteMutation,
} from "@/store/models";

const model = "projects";

export default function Reports(props) {
  const ctx_auth = useContext(ContextAuthenticate);
  const ctx_admin = useContext(AdminContext);
  // @ts-ignore
  const user = useSelector((state) => state.user);
  const [selection_mode, set_selection_mode] = useState(true);
  const [selection_model, set_selection_model] = useState([]);
  const [update_map, set_update_map] = useState([]);
  const [snack, set_snack] = useState({
    id: "s-def",
    open: false,
    timeout: 3000,
    message: <div></div>,
  });
  const {
    data = [],
    error,
    isLoading: is_loading,
    isFetching: is_fetching,
    isSuccess: is_success,
    isError: is_error,
    refetch,
  } = useGetQuery({ model, token: user.token });
  const [
    update,
    {
      error: error_update,
      isLoading: is_update,
      isSuccess: is_success_update,
      isError: is_error_update,
    },
  ] = useUpdateMutation();
  const [
    remove,
    {
      error: error_remove,
      isLoading: is_remove,
      isSuccess: is_success_remove,
      isError: is_error_remove,
    },
  ] = useDeleteMutation();
  const [rows, set_rows] = useState(data);

  useEffect(() => {
    ctx_admin.set_ctx_data({
      title: "Projects Model",
      active_link: "/admin/models/projects",
    });
  }, []);
  useEffect(() => {
    if (is_success) {
      set_rows(data);
      set_snack({
        ...snack,
        id: "s-fetch",
        open: true,
        message: (
          <Alert elevation={6} severity="success">
            Success Fetch
          </Alert>
        ),
      });
    }
    if (is_error) {
      const message = handle_error_api(error);
      set_snack({
        ...snack,
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            {message}
          </Alert>
        ),
      });
    }
  }, [is_success, is_error, is_fetching]);
  useEffect(() => {
    if (is_success_update) {
      // requestIdleCallback(refetch);
      set_update_map([]);
      set_snack({
        ...snack,
        id: "s-update",
        open: true,
        message: (
          <Alert elevation={6} severity="success">
            Success Update
          </Alert>
        ),
      });
    }
    if (is_error_update) {
      const message = handle_error_api(error_update);
      set_snack({
        ...snack,
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            {message}
          </Alert>
        ),
      });
    }
  }, [is_success_update, is_error_update]);
  useEffect(() => {
    if (is_success_remove) {
      // requestIdleCallback(refetch);
      set_selection_model([]);
      set_snack({
        ...snack,
        id: "s-remove",
        open: true,
        message: (
          <Alert elevation={6} severity="success">
            Success Remove
          </Alert>
        ),
      });
    }
    if (is_error_remove) {
      const message = handle_error_api(error_remove);
      set_snack({
        ...snack,
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            {message}
          </Alert>
        ),
      });
    }
  }, [is_success_remove, is_error_remove]);

  function handle_error_api(error) {
    if (error.error) {
      return error.error;
    } else {
      if (error.status == 401) {
        ctx_auth.open_signin(true);
      }
      return error.data.message;
    }
  }
  function handle_add() {
    set_rows([
      ...rows,
      {
        id: "null",
        id_projects: "null",
        preparation: "null",
        base_building: "null",
        project_copy: "null",
        structure: "null",
        supervisor_instruction: "null",
        reported_at: "null",
      },
    ]);
  }
  function handle_remove() {
    if (!selection_model.length) {
      return set_snack({
        ...snack,
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            None Selected
          </Alert>
        ),
      });
    }
    remove({ model, data: selection_model, token: user.token });
  }
  function handle_apply() {
    update({ model, data: Object.values(update_map), token: user.token });
  }
  function handle_discharge() {
    set_update_map([]);
  }
  function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{ gap: 1 }}>
        {/* <GridToolbarDensitySelector color="inherit" size="medium" /> */}
        <GridToolbarColumnsButton  color="inherit" size="medium" />
        <GridToolbarFilterButton color="inherit" sx={{ fontSize: "14px" }} />
        {/* <Button
          size="medium"
          variant="text"
          color="inherit"
          startIcon={<AddIcon />}
          onClick={handle_add}
        >
          Add
        </Button> */}
        <Button
          size="medium"
          variant="text"
          color="inherit"
          startIcon={<DeleteOutlineIcon />}
          onClick={handle_remove}
        >
          Remove
        </Button>
        {!!update_map.length && (
          <>
            {" "}
            <Button
              size="medium"
              variant="text"
              color="inherit"
              startIcon={<DoneIcon />}
              onClick={handle_apply}
            >
              Apply
            </Button>
            <Button
              size="medium"
              variant="text"
              color="inherit"
              startIcon={<CloseIcon />}
              onClick={handle_discharge}
            >
              Discharge
            </Button>
          </>
        )}
        <Tooltip title="Sync">
          <Button
            size="medium"
            variant="text"
            color="inherit"
            startIcon={<CachedIcon />}
            sx={{
              display: "grid",
              placeContent: "center",
              placeItems: "center",
              minWidth: "auto",
              "& .MuiButton-startIcon": {
                margin: "0",
              },
            }}
            onClick={refetch}
          ></Button>
        </Tooltip>
        {/* <GridToolbarExport /> */}
        <Box flexGrow={1} />
        <GridToolbarQuickFilter variant="outlined" size="small" />
      </GridToolbarContainer>
    );
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
        sx={{ width: "100%", height: "100%" }}
      >
        <Paper variant="outlined">
          <DataGrid
            loading={is_loading || is_fetching || is_update || is_remove}
            checkboxSelection={selection_mode}
            disableSelectionOnClick
            initialState={{
              pagination: {
                pageSize: 5,
              },
            }}
            rows={rows}
            columns={columns}
            components={{ Toolbar: CustomToolbar }}
            rowsPerPageOptions={[5, 10, 20, 40]}
            selectionModel={selection_model}
            onSelectionModelChange={(newSelectionModel) => {
              set_selection_model(newSelectionModel);
            }}
            onCellEditStop={(params, event) => {
              if (params.reason === GridCellEditStopReasons.cellFocusOut) {
                event.defaultMuiPrevented = true;
              }
              if (params.id in update_map) {
                set_update_map({
                  ...update_map,
                  [params.id]: {
                    id: params.id,
                    value: Object.assign({}, update_map[params.id], {
                      [params.field]: params.value,
                    }),
                  },
                });
              } else {
                set_update_map({
                  ...update_map,
                  [params.id]: {
                    id: params.id,
                    value: Object.assign({}, params.row, {
                      [params.field]: params.value,
                    }),
                  },
                });
              }
            }}
          />
        </Paper>
      </Box>
      <Snackbar
        key={snack.id}
        open={snack.open}
        autoHideDuration={snack.timeout}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        onClose={() => set_snack({ ...snack, open: false })}
      >
        {snack.message}
      </Snackbar>
    </>
  );
}

Reports.getLayout = AdminShell;
