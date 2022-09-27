import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { styled, useTheme } from "@mui/material/styles";
import { Formik, Form, Field } from "formik";
import { format } from "date-fns";
import { id as idn } from "date-fns/locale";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import NoSsr from "@mui/material/NoSsr";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Select from "@mui/material/Select";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ViewAgendaOutlinedIcon from "@mui/icons-material/ViewAgendaOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import AdminShell from "@/layout/AdminShell";
import ContextAuthenticate from "@/context/authenticate";
import AdminContext from "@/context/admin";
import {
  useCreateMutation,
  useUpdateByIdMutation,
  useDeleteMutation,
} from "@/store/reports";
import { useGetByIdQuery } from "@/store/projects";
import { useEventSource, useGlobal } from "@/lib/helper-ui";

const StyledTreeItem = styled((props) => <TreeItem {...props} />)(
  ({ theme }) => ({
    "& .MuiTreeItem-content": {
      padding: "0 16px",
      fontWeight: "medium",
      height: "50px",
      gap: "4px",
      borderRadius: "4px",
    },
  })
);

export default function Reports(props) {
  const router = useRouter();
  const theme = useTheme();
  const { name, start = "", end = "" } = router.query;
  const ctx_auth = useContext(ContextAuthenticate);
  const ctx_admin = useContext(AdminContext);
  // @ts-ignore
  const user = useSelector((state) => state.user);
  const [start_date, set_start_date] = useState(new Date(+start));
  const [end_date, set_end_date] = useState(new Date(+end));
  const [log_id, set_log_id] = useState(0);
  const [logs, set_logs] = useState([]);
  const [dialogValue, setDialogValue] = useState({});
  const [snack, setSnack] = useState({
    id: 1111,
    open: false,
    timeout: 6000,
    message: <div></div>,
    vertical: "bottom",
    horizontal: "center",
  });
  const handleCloseSnack = () => {
    setSnack({
      id: 199,
      timeout: 5000,
      open: false,
      message: <div></div>,
      vertical: "bottom",
      horizontal: "center",
    });
  };
  if (!!name && !start && !end) {
    const date = new Date();
    router.replace({
      pathname: "/admin/logs/[name]",
      query: { name, start: date.getTime(), end: date.getTime() },
    });
  }
  const event_source = useEventSource(
    `/event/activity/${name}?start=${start}&end=${end}&token=${user.token}`,
    !start && !end
  );

  function handle_combine() {
    ctx_admin.set_loader(true);
    router.reload();
  }

  useEffect(() => {
    if (!name) {
      return;
    }
    ctx_admin.set_ctx_data({
      title: `${name} log`,
      active_link: `/admin/logs/${name}`,
    });
  }, [name]);
  useEffect(() => {
    event_source.open().then(() => {
      event_source.message((data, id) => {
        set_log_id(id);
      });
    });
  });
  useEffect(() => {
    set_logs([...logs, event_source.data()]);
  }, [log_id]);
  useEffect(() => {
    set_start_date(new Date(+start));
    set_end_date(new Date(+end));
  }, [start, end]);
  useEffect(() => {
    if (!name) {
      return;
    }
    router.replace({
      pathname: `/admin/logs/${name}`,
      search: `start=${start_date.getTime()}&end=${end_date.getTime()}`,
    });
  }, [start_date.toLocaleDateString(), end_date.toLocaleDateString()]);

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
        <Paper elevation={0}>
          <Box
            display="flex"
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={start_date}
                onChange={(newValue) => {
                  set_start_date(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={end_date}
                onChange={(newValue) => {
                  set_end_date(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <Button variant="contained" onClick={handle_combine}>
              Fetch
            </Button>
          </Box>
        </Paper>
        <Paper elevation={0} sx={{ overflowX: "scroll" }}>
          <Box
            // sx={{ overflowX: "scroll" }}
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
            <Box
              key={"data-log-" + log_id}
              sx={{ fontFamily: "monospace", whiteSpace: "pre" }}
            >
              {logs.map((value, index) => (
                <div
                  key={"log-" + index}
                  dangerouslySetInnerHTML={{ __html: value }}
                ></div>
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={false}
        // onClose={handleCloseDialogAdd}
      >
        <DialogTitle display="flex" alignItems="center">
          <Typography component="div" variant="h6" sx={{ flexGrow: 1 }}>
            {/* {dialogValue.id ? "Update" : "Create"} Report */}
          </Typography>
          <IconButton
            aria-label="close"
            // onClick={handleCloseDialogAdd}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers></DialogContent>
      </Dialog>
      <Dialog
        open={false}
        // onClose={handleCloseRemoveDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Remove Report</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* Are your sure want to Remove {removeList.length} Report? */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            // onClick={handleCloseRemoveDialog}
            color="error"
          >
            Cancel
          </Button>
          <Button
          // onClick={handleDelete}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        key={snack.id}
        anchorOrigin={{
          // @ts-ignore
          vertical: snack.vertical,
          // @ts-ignore
          horizontal: snack.horizontal,
        }}
        open={snack.open}
        autoHideDuration={snack.timeout}
        onClose={handleCloseSnack}
      >
        {snack.message}
      </Snackbar>
    </>
  );
}

Reports.getLayout = AdminShell;
