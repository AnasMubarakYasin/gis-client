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
import { useForceUpdate } from "@/lib/helper-ui";

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
  const ctx_auth = useContext(ContextAuthenticate);
  const ctx_admin = useContext(AdminContext);
  // @ts-ignore
  const user = useSelector((state) => state.user);
  const { id } = router.query;
  const {
    data: project,
    error,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch,
    // @ts-ignore
  } = useGetByIdQuery(
    { id, includes: ["supervisor", "reports"], token: user.token },
    { skip: !id }
  );
  const [
    create,
    {
      error: errorCreate,
      isLoading: isCreating,
      isSuccess: isSuccessCreating,
      isError: isErrorCreating,
    },
  ] = useCreateMutation();
  const [
    update,
    {
      error: errorUpdate,
      isLoading: isUpdating,
      isSuccess: isSuccessUpdating,
      isError: isErrorUpdating,
    },
  ] = useUpdateByIdMutation();
  const [
    remove,
    {
      error: errorRemove,
      isLoading: isRemoving,
      isSuccess: isSuccessRemoving,
      isError: isErrorRemoving,
    },
  ] = useDeleteMutation();

  const [removeMode, setRemoveMode] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [viewMode, setViewMode] = useState("Grid");
  const [removeList, setRemoveList] = useState([]);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [buttonToggleGroup, setButtonToggleGroup] = useState([]);
  const [reports, setReports] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);
  const [dialogValue, setDialogValue] = useState({
    id: undefined,
    reported_at: format(new Date(), "eeee / dd MMMM yyyy", { locale: idn }),
    preparation: "",
    base_building: "",
    structure: "",
    supervisor_instruction: "",
    worthiness: "",
    condition: "",
    project_copy: project,
  });
  const [snack, setSnack] = useState({
    id: 1111,
    open: false,
    timeout: 6000,
    message: <div></div>,
    vertical: "bottom",
    horizontal: "center",
  });
  const is_root = user.account.role == "root";
  const is_admin = user.account.role == "admin";
  const is_supervisor = user.account.role == "supervisor";
  // @ts-ignore
  const is_development = project?.status == "Pembangunan";
  // @ts-ignore
  const is_maintenance = project?.status == "Perawatan";
  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };
  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };
  const handleCreateOrUpdate = async (values, { setSubmitting }) => {
    const data = Object.assign({}, values, {
      // @ts-ignore
      id_projects: project.id,
      project_copy: project,
      reported_at: format(Date.now(), "yyyy-MM-dd"),
    });
    const token = user.token;
    if (dialogValue.id) {
      delete data.project_copy;
      delete data.reported_at;
      console.log(data);
      update({ id: dialogValue.id, data, token });
    } else {
      create({ data, token });
    }
    setSubmitting(false);
  };
  const handleDelete = () => {
    // @ts-ignore
    const data = removeList.map((index) => project.reports[index]);
    remove({ data, token: user.token });
  };
  const handleEnableRemoveMode = () => {
    setRemoveMode(true);
    setRemoveList([]);
    setSelected([]);
  };
  const handleDisableRemoveMode = () => {
    setRemoveMode(false);
    setRemoveList([]);
    setSelected([]);
    setButtonToggleGroup([]);
  };
  const handleRemoveSelection = (index) => () => {
    const copy = Array.of(...removeList);
    if (copy.includes(index)) {
      setRemoveList(copy.filter((item) => item != index));
    } else {
      copy.push(index);
      setRemoveList(copy);
    }
  };
  const handleRemoveDone = () => {
    handleOpenDialogRemove();
  };
  const handleRemoveCancel = () => {
    handleDisableRemoveMode();
  };
  // @ts-ignore
  const handleRemoveDialogconfirm = () => {};
  const handleUpdateUndo = () => {};
  const handleRemoveUndo = () => {};
  const handleOpenDialogRemove = () => {
    setOpenRemoveDialog(true);
  };
  const handleCloseRemoveDialog = () => {
    setOpenRemoveDialog(false);
  };
  const handleOpenDialogAdd = (index, nodeId) => {
    if (removeMode) {
      handleRemoveSelection(index)();
      const copy = Array.of(...selected);
      if (copy.includes(nodeId)) {
        setSelected(copy.filter((item) => item != nodeId));
      } else {
        copy.push(nodeId);
        setSelected(copy);
      }
      return;
    }
    setOpenDialogAdd(true);
    setSelected([nodeId]);
    if (typeof index == "number") {
      // @ts-ignore
      const report = project.reports[index];
      if (report) {
        setDialogValue(report);
      }
    }
  };
  const handleCloseDialogAdd = () => {
    setOpenDialogAdd(false);
    resetDialogAdd();
  };
  const resetDialogAdd = () => {
    setButtonToggleGroup([]);
    setDialogValue({
      id: undefined,
      reported_at: format(new Date(), "eeee / dd MMMM yyyy", { locale: idn }),
      preparation: "",
      base_building: "",
      structure: "",
      supervisor_instruction: "",
      worthiness: "",
      condition: "",
      project_copy: {},
    });
    setOpenDialogAdd(false);
  };
  const resetDialogRemove = () => {
    handleDisableRemoveMode();
    setOpenRemoveDialog(false);
  };
  // const handleOpenSnack = (message) => {
  //   setSnack({ open: true, message, vertical: "bottom", horizontal: "center" });
  // };
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
  const handleReportClick = (index, nodeId) => (event) => {
    handleOpenDialogAdd(index, nodeId);
  };
  const handleButtonToggleGroup = (event, formats) => {
    setButtonToggleGroup(([prev]) => {
      const value = formats.pop();
      if (value == "Remove") {
        handleEnableRemoveMode();
      } else if (value == "Add") {
        // @ts-ignore
        if (project && project.reports.length) {
          // @ts-ignore
          const reports = project.reports.slice().sort((a, b) => {
            if (a.reported_at < b.reported_at) {
              return -1;
            }
            if (a.reported_at > b.reported_at) {
              return 1;
            }
            return 0;
          });
          const report = reports.pop();
          const today = format(Date.now(), "yyyy-MM-dd");
          console.log(new Date(report.reported_at), new Date(today));
          if (new Date(report.reported_at) >= new Date(today)) {
            setSnack({
              ...snack,
              open: true,
              message: (
                <Alert elevation={6} severity="warning">
                  Tidak dapat membuat 2 Laporan dalam sehari
                </Alert>
              ),
            });
            return [];
          }
        }
        handleOpenDialogAdd();
      } else if (value == "List") {
        setViewMode("Grid");
        return [];
      } else if (value == "Grid") {
        setViewMode("List");
        return [];
      }
      if (prev) {
        return [prev];
      } else {
        return [value];
      }
    });
  };
  function treeDate() {
    const result = {};
    let index = 0;
    // @ts-ignore
    for (const item of project.reports) {
      let prev = [];
      for (const func of ["getFullYear", "getMonth", "getDate"]) {
        const value = new Date(item.reported_at)[func]();
        prev.push(value);
        switch (func) {
          case "getFullYear":
            if (value in result) {
              continue;
            } else {
              result[value] = { text: `Tahun ${value}`, childs: {}, index };
            }
            break;
          case "getMonth":
            if (value in result[prev[0]].childs) {
              continue;
            } else {
              result[prev[0]].childs[value] = {
                text: `Bulan ${value + 1}`,
                childs: {},
                index,
              };
            }
            break;
          case "getDate":
            if (value in result[prev[0]].childs[prev[1]].childs) {
              continue;
            } else {
              result[prev[0]].childs[prev[1]].childs[value] = {
                text: `Tanggal ${value}`,
                childs: {},
                index,
              };
            }
            break;
          default:
            throw new Error("something wrong");
        }
      }
      index++;
    }
    return result;
  }
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

  useEffect(() => {
    ctx_admin.set_ctx_data({
      // @ts-ignore
      title: "Laporan " + (project?.name ?? ""),
      active_link: "/admin/reports",
    });
    // @ts-ignore
  }, [project?.name]);
  useEffect(() => {
    ctx_admin.set_loader(isFetching || isCreating || isUpdating || isRemoving);
  }, [isFetching, isCreating, isUpdating, isRemoving]);
  useEffect(() => {
    if (isSuccess) {
      setReports(Object.values(treeDate()));
      setSnack({
        ...snack,
        open: true,
        message: (
          <Alert elevation={6} severity="success">
            Success Fetch
          </Alert>
        ),
      });
    }
    if (isError) {
      const message = convertAndHandleErrorApi(error);
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
  }, [isSuccess, isError, isFetching]);
  useEffect(() => {
    if (isSuccessCreating) {
      refetch();
      resetDialogAdd();
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="success">
            Success Create
          </Alert>
        ),
      }));
    }
    if (isErrorCreating) {
      const message = convertAndHandleErrorApi(errorCreate);
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
  }, [isSuccessCreating, isErrorCreating]);
  useEffect(() => {
    if (isSuccessUpdating) {
      refetch();
      resetDialogAdd();
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="success">
            Success Update
          </Alert>
        ),
      }));
    }
    if (isErrorUpdating) {
      const message = convertAndHandleErrorApi(errorUpdate);
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
  }, [isSuccessUpdating, isErrorUpdating]);
  useEffect(() => {
    if (isSuccessRemoving) {
      refetch();
      resetDialogRemove();
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="success">
            Success Remove
          </Alert>
        ),
      }));
    }
    if (isErrorRemoving) {
      const message = convertAndHandleErrorApi(errorRemove);
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
  }, [isSuccessRemoving, isErrorRemoving]);

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
        <Box
          display="flex"
          gap={{
            xs: 2,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 8,
          }}
        >
          <Paper elevation={0}>
            <ToggleButtonGroup
              value={buttonToggleGroup}
              onChange={handleButtonToggleGroup}
              aria-label="Operation Controll"
            >
              <ToggleButton value="Add" aria-label="Add Report">
                <Tooltip title="Add Report">
                  <AddIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="Remove" aria-label="Remove Report">
                <Tooltip title="Remove Report">
                  <RemoveIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="Search" aria-label="Search Report">
                <Tooltip title="Search Report">
                  <SearchIcon />
                </Tooltip>
              </ToggleButton>
              {/* <ToggleButton value={viewMode} aria-label="View Mode">
                <Tooltip title="View Mode">
                  <>
                    {viewMode == "Grid" && <GridViewOutlinedIcon />}
                    {viewMode == "List" && <ViewAgendaOutlinedIcon />}
                  </>
                </Tooltip>
              </ToggleButton> */}
              <ToggleButton value="More" aria-label="More Options">
                <Tooltip title="More Options">
                  <MoreVertIcon />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Paper>
          {removeMode && (
            <Paper elevation={0}>
              <ToggleButtonGroup aria-label="Remove Operation Confirm">
                <ToggleButton
                  value="Done"
                  aria-label="Done Remove"
                  onClick={handleRemoveDone}
                >
                  <Tooltip title="Done Remove">
                    <DoneIcon />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton
                  value="Clear"
                  aria-label="Clear Remove"
                  onClick={handleRemoveCancel}
                >
                  <Tooltip title="Clear Remove">
                    <ClearIcon />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>
          )}
        </Box>
        <Paper
          variant="outlined"
          sx={{ px: { xs: 2, sm: 2, md: 4, lg: 4, xl: 8 }, py: 2 }}
        >
          <TreeView
            aria-label="file system navigator"
            // expanded={expanded}
            selected={selected}
            // onNodeToggle={handleToggle}
            // onNodeSelect={handleSelect}
            multiSelect
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            // defaultEndIcon={<CheckIcon />}
          >
            {reports.map((value) => (
              <StyledTreeItem
                key={value.text}
                nodeId={value.text}
                label={value.text}
              >
                {value.childs &&
                  Object.values(value.childs).map((value2) => (
                    <StyledTreeItem
                      key={value.text + value2.text}
                      nodeId={value.text + value2.text}
                      label={value2.text}
                    >
                      {value2.childs &&
                        Object.values(value2.childs).map((value3) => (
                          <StyledTreeItem
                            key={value.text + value2.text + value3.text}
                            nodeId={value.text + value2.text + value3.text}
                            label={value3.text}
                            onClick={handleReportClick(
                              value3.index,
                              value.text + value2.text + value3.text
                            )}
                            icon={
                              removeMode && (
                                <Checkbox
                                  size="small"
                                  checked={removeList.includes(value3.index)}
                                  // sx={{ position: "absolute", right: 0, top: 0 }}
                                  onChange={handleRemoveSelection(value3.index)}
                                />
                              )
                            }
                          ></StyledTreeItem>
                        ))}
                    </StyledTreeItem>
                  ))}
              </StyledTreeItem>
            ))}
          </TreeView>
        </Paper>
      </Box>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openDialogAdd}
        onClose={handleCloseDialogAdd}
      >
        <DialogTitle display="flex" alignItems="center">
          <Typography component="div" variant="h6" sx={{ flexGrow: 1 }}>
            {dialogValue.id ? "Update" : "Create"} Report
          </Typography>
          <IconButton aria-label="close" onClick={handleCloseDialogAdd}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Formik initialValues={dialogValue} onSubmit={handleCreateOrUpdate}>
            {({
              values,
              errors,
              isSubmitting,
              setFieldValue,
              handleSubmit,
            }) => (
              <Form autoComplete="off" onSubmit={handleSubmit}>
                <Box display="grid" gap={2}>
                  <TextField
                    required
                    label="Kegiatan"
                    // @ts-ignore
                    value={project.activity}
                    disabled={isSubmitting}
                  ></TextField>
                  <TextField
                    required
                    label="Pekerjaan"
                    // @ts-ignore
                    value={project.name}
                    disabled={isSubmitting}
                  ></TextField>
                  <TextField
                    required
                    label="Konsultan Pengawas"
                    // @ts-ignore
                    value={project.name_company}
                    disabled={isSubmitting}
                  ></TextField>
                  <TextField
                    required
                    label="Pekerjaan"
                    // @ts-ignore
                    value={project.name}
                    disabled={isSubmitting}
                  ></TextField>
                  <TextField
                    required
                    label="Pengawas Lapangan"
                    // @ts-ignore
                    value={project.supervisor.username}
                    disabled={isSubmitting}
                  ></TextField>
                  <TextField
                    required
                    label="Hari/Tanggal"
                    value={values.reported_at}
                    disabled={isSubmitting}
                  ></TextField>
                  {is_development ? (
                    <>
                      <TextField
                        required
                        label="Pekerjaan Persiapan"
                        name="preparation"
                        value={values.preparation}
                        disabled={isSubmitting}
                        multiline
                        minRows={2}
                        onChange={(evt) =>
                          setFieldValue("preparation", evt.target.value)
                        }
                      ></TextField>
                      <TextField
                        required
                        label="Pekerjaan Bangunan Dasar"
                        name="structure"
                        value={values.structure}
                        disabled={isSubmitting}
                        multiline
                        minRows={2}
                        onChange={(evt) =>
                          setFieldValue("structure", evt.target.value)
                        }
                      ></TextField>
                      <TextField
                        required
                        label="Pekerjaan Struktur"
                        name="base_building"
                        value={values.base_building}
                        disabled={isSubmitting}
                        multiline
                        minRows={2}
                        onChange={(evt) =>
                          setFieldValue("base_building", evt.target.value)
                        }
                      ></TextField>
                      <TextField
                        required
                        label="Instruksi Dari Pengawasan Dinas"
                        name="supervisor_instruction"
                        value={values.supervisor_instruction}
                        disabled={isSubmitting}
                        multiline
                        minRows={2}
                        onChange={(evt) =>
                          setFieldValue(
                            "supervisor_instruction",
                            evt.target.value
                          )
                        }
                      ></TextField>
                    </>
                  ) : (
                    <>
                      <TextField
                        required
                        label="Kelayakan"
                        name="worthiness"
                        type="number"
                        value={values.worthiness}
                        disabled={isSubmitting}
                        onChange={(evt) =>
                          setFieldValue("worthiness", evt.target.value)
                        }
                      ></TextField>
                      <TextField
                        required
                        label="Kondisi"
                        name="condition"
                        value={values.condition}
                        disabled={isSubmitting}
                        multiline
                        minRows={2}
                        onChange={(evt) =>
                          setFieldValue("condition", evt.target.value)
                        }
                      ></TextField>
                    </>
                  )}
                  {(is_root || is_supervisor || is_root || is_admin) && (
                    <Button
                      disableElevation
                      type="submit"
                      size="large"
                      disabled={isSubmitting}
                      variant="contained"
                    >
                      {dialogValue.id ? "Perbaharui" : "Buat"}
                    </Button>
                  )}
                </Box>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openRemoveDialog}
        onClose={handleCloseRemoveDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Remove Report</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are your sure want to Remove {removeList.length} Report?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRemoveDialog} color="error">
            Cancel
          </Button>
          <Button onClick={handleDelete}>Yes</Button>
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
