import { useState, useEffect, useRef, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { styled, useTheme, useMediaQuery } from "@mui/material";
import { useFormikContext, Formik, Form, Field } from "formik";
import { TextField as FormikTextField } from "formik-mui";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ButtonGroup from "@mui/material/ButtonGroup";
import Input from "@mui/material/Input";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import LinearProgress from "@mui/material/LinearProgress";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import EditIcon from "@mui/icons-material/Edit";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import RoomIcon from "@mui/icons-material/Room";

// import DialogPassword from "@/components/DialogPassword";
import AdminShell from "@/layout/AdminShell";
import ContextAuthenticate from "@/context/authenticate";
import AdminContext from "@/context/admin";
import { useGlobal } from "@/lib/helper-ui";
import {
  useGetByNameQuery,
  useGetByNameWithTasksQuery,
  useCreateMutation,
  useUpdateByIdMutation,
} from "@/store/projects";
import {
  useCreateMutation as useCreateMutationTasks,
  useUpdateMutation as useUpdateMutationTasks,
} from "@/store/tasks";
import { useGetAllQuery as useGetAllQuerySupervisors } from "@/store/supervisors";
// import Loading from "@/layout/Loading";

const DragDrop = (props) => {
  const { data } = props;
  const { list } = props;
  const ref = useRef(null);
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "task",
      hover: (item, monitor) => {
        const dragItem = monitor.getItem();
        if (dragItem) {
          props.onDropHover?.({ drag: dragItem, drop: data });
        }
      },
      drop: (item, monitor) => data,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [list]
  );
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: "task",
      item: data,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult();
        if (item && dropResult) {
          // @ts-ignore
          const opr = dropResult.dropEffect;
          // @ts-ignore
          delete dropResult.dropEffect;
          const evt = { drop: dropResult, drag: item, opr };
          props.onDragEnd?.(evt);
        }
      },
    }),
    [list]
  );

  drag(drop(ref));
  return props.children({ ref, isDragging, isOver, data });
};

const years = Array(+new Date().getFullYear().toString().substring(2))
  .fill(new Date().getFullYear())
  .reduce((prev, curr, index) => {
    prev.unshift(curr - index);
    return prev;
  }, []);

export default function ProjectsDetail(props) {
  const router = useRouter();
  const theme = useTheme();
  const { name } = router.query;
  const ctx_auth = useContext(ContextAuthenticate);
  const ctx_admin = useContext(AdminContext);
  // @ts-ignore
  const user = useSelector((state) => state.user);
  // const dispatch = useDispatch();
  const [get_temp_project, set_temp_project] = useGlobal("project");
  const [get_temp_file, set_temp_file] = useGlobal("project-file");
  const {
    data: project = { tasks: [] },
    error: errorProject,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch,
  } = useGetByNameWithTasksQuery(
    { name, token: user.token },
    { skip: name == "Buat Proyek" }
  );
  const {
    data: supervisors = [],
    error: supervisors_error,
    isLoading: is_loading_supervisors,
    isFetching: is_fetching_supervisors,
    isSuccess: is_success_supervisors,
    isError: is_error_supervisors,
    // refetch,
  } = useGetAllQuerySupervisors(
    { token: user.token },
    { skip: user.account.role != "admin" }
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
      isLoading: isUpdating,
      isSuccess: isSuccessUpdating,
      isError: isErrorUpdating,
      error: errorUpdate,
    },
  ] = useUpdateByIdMutation();
  const [
    update_tasks,
    {
      isLoading: is_loading_update_tasks,
      isSuccess: is_success_update_tasks,
      isError: is_error_update_tasks,
      error: error_tasks,
    },
  ] = useUpdateMutationTasks();
  const [
    create_tasks,
    {
      data: data_create_tasks,
      error: error_create_tasks,
      isLoading: is_loading_create_tasks,
      isSuccess: is_success_create_tasks,
      isError: is_error_create_tasks,
    },
  ] = useCreateMutationTasks();
  // const { values = {} } = useFormikContext();
  const [tasks, setTasks] = useState([]);
  // const [supervisors, set_supervisors] = useState([]);
  const [created, setCreated] = useState(false);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const [progress, setProgress] = useState({ done: 0, of: 0, percent: 0 });
  const [isAddTask, setIsAddTask] = useState(false);
  const mdUp = useMediaQuery(theme.breakpoints.up(theme.breakpoints.values.md));
  const [snack, setSnack] = useState({
    id: "",
    open: false,
    message: <div></div>,
  });
  const calculateProgress = () => {
    let done = 0;
    for (const task of tasks) {
      task.done && (done += 1);
    }
    setProgress({
      done,
      of: tasks.length,
      percent: (done / tasks.length) * 100,
    });
  };
  const handleImage = (event) => {
    setFile(event.target.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
  };
  const handleValidate = (values) => {
    const errors = {};
    if (!values.image) {
      errors.image = "Image Required";
    }
    return errors;
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    let message;
    try {
      const data = Object.assign({}, values, {
        name: values.name.trim(),
        image,
        fiscal_year: values.fiscal_year + "",
        contract_date: values.contract_date.toString(),
        coordinate:
          typeof values.coordinate === "string"
            ? values.coordinate.split(",").map((coord) => +coord)
            : values.coordinate,
      });
      if (created) {
        delete data.tasks;
        await update({
          // @ts-ignore
          id: project.id,
          data,
          file,
          token: user.token,
        });
      } else {
        delete data.tasks;
        data.id_admins = user.account.id;
        await create({ data, file, token: user.token });
      }
    } catch (error) {
      message = (
        <Alert elevation={6} severity="error">
          {error.message}
        </Alert>
      );
      setSnack((prev) => ({
        ...prev,
        open: true,
        message,
      }));
    } finally {
      setSubmitting(false);
    }
  };
  const handleTasksUpdate = async () => {
    let message;
    try {
      // @ts-ignore
      if (!project.id) {
        throw new Error("Create Project First");
      }
      const data = [];
      let count = 1;
      for (const task of tasks) {
        const copy = Object.assign({}, task);
        copy.order = count++;
        data.push(copy);
      }
      await update_tasks({ data, token: user.token });
    } catch (error) {
      message = (
        <Alert elevation={6} severity="error">
          {error.message}
        </Alert>
      );
      setSnack((prev) => ({
        ...prev,
        open: true,
        message,
      }));
    }
  };
  const handleIsAddTask = (event) => {
    setIsAddTask(!isAddTask);
  };
  // const handleCloseAddTask = (values) => {};
  const handleAddTask = async (values, { setSubmitting }) => {
    const data = Object.assign(
      // @ts-ignore
      { id_projects: project.id, order: 1, done: false },
      values
    );
    await create_tasks({ data, token: user.token });
  };
  const handleTaskEdit = (index) => (event) => {
    const copy = Array.of(...tasks);
    const task = copy[index];
    if (task) {
      copy.splice(
        index,
        1,
        Object.assign({}, task, { note: event.target.value })
      );
      // copy.done = !task.done;
      setTasks(copy);
    }
  };
  const handleTaskDone = (index) => (event) => {
    const copy = Array.of(...tasks);
    const task = copy[index];
    if (task) {
      copy.splice(index, 1, Object.assign({}, task, { done: !task.done }));
      setTasks(copy);
    }
  };
  const handleTaskSwitch = ({ drag, drop }) => {
    const currTask = tasks.findIndex((task) => task.id == drag.id);
    const nextTask = tasks.findIndex((task) => task.id == drop.id);
    const prevTask = Object.assign({}, tasks[nextTask]);
    const nextOrder = tasks[nextTask].order;
    tasks[nextTask] = Object.assign({}, tasks[currTask]);
    tasks[currTask] = prevTask;
    tasks[nextTask].order = prevTask.order;
    prevTask.order = nextOrder;
    setTasks(Array.of(...tasks));
  };
  const handleSnackClose = (event, reason) => {
    setSnack((prev) => ({ ...prev, open: false }));
  };
  const handleSelectMap = (values) => {
    return () => {
      set_temp_project(values);
      set_temp_file({ image, file });
      router.push("/admin/projects/pin");
    };
  };

  useEffect(() => {
    ctx_admin.set_loader(isCreating || isUpdating || is_loading_update_tasks);
  }, [isCreating, isUpdating, is_loading_update_tasks]);
  useEffect(function () {
    ctx_admin.set_ctx_data({
      // @ts-ignore
      title: created ? project.name : "Create Project",
      active_link: "/admin/projects",
    });
    const temp_file = get_temp_file();
    if (temp_file) {
      setFile(temp_file.file);
      setImage(temp_file.image);
    }
  });
  useEffect(() => {
    calculateProgress();
  }, [tasks]);
  useEffect(() => {
    if (isSuccess) {
      // @ts-ignore
      const exists = !!project?.id;
      setCreated(exists);
      ctx_admin.set_ctx_data({
        // @ts-ignore
        title: exists ? project.name : "Create Project",
        active_link: "/admin/projects",
      });
      if (project) {
        if (!image) {
          // @ts-ignore
          setImage(project.image);
        }
        if (!tasks.length) {
          // @ts-ignore
          setTasks(Array.of(...project.tasks));
        }
      }
      setSnack((prev) => ({ ...prev, id: "get", open: false }));
    }
    if (isError) {
      // @ts-ignore
      if (errorProject.status == 401) {
        ctx_auth.open_signin(true);
      }
      setSnack((prev) => ({
        id: "get",
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            {
              // @ts-ignore
              errorProject.data.message
            }
          </Alert>
        ),
      }));
    }
  }, [isSuccess, isError]);
  useEffect(() => {
    if (isSuccessCreating) {
      set_temp_project(null);
      set_temp_file(null);
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="success">
            Success Create
          </Alert>
        ),
      }));
      setTimeout(() => {
        router.push("/admin/projects");
      }, 1000);
    }
    if (isErrorCreating) {
      // @ts-ignore
      if (errorCreate.status == 401) {
        ctx_auth.open_signin(true);
      }
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            {
              // @ts-ignore
              errorCreate.data.message
            }
          </Alert>
        ),
      }));
    }
  }, [isSuccessCreating, isErrorCreating]);
  useEffect(() => {
    if (isSuccessUpdating) {
      set_temp_project(null);
      set_temp_file(null);
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
      // @ts-ignore
      if (errorUpdate.status == 401) {
        ctx_auth.open_signin(true);
      }
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            {
              // @ts-ignore
              errorUpdate.data.message
            }
          </Alert>
        ),
      }));
    }
  }, [isSuccessUpdating, isErrorUpdating]);
  useEffect(() => {
    if (is_success_create_tasks) {
      setIsAddTask(false);
      setTasks(
        Array.of(data_create_tasks, ...tasks).sort((a, b) => a.order - b.order)
      );
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="success">
            Success Create Task
          </Alert>
        ),
      }));
    }
    if (is_error_create_tasks) {
      // @ts-ignore
      if (error_create_tasks.status == 401) {
        ctx_auth.open_signin(true);
      }
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            {
              // @ts-ignore
              error_create_tasks.data.message
            }
          </Alert>
        ),
      }));
    }
  }, [is_success_create_tasks, is_error_create_tasks]);
  useEffect(() => {
    if (is_success_update_tasks) {
      refetch();
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="success">
            Success Update Tasks
          </Alert>
        ),
      }));
    }
    if (is_error_update_tasks) {
      // @ts-ignore
      if (error_tasks.status == 401) {
        ctx_auth.open_signin(true);
      }
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            {
              // @ts-ignore
              error_tasks.data.message
            }
          </Alert>
        ),
      }));
    }
  }, [is_success_update_tasks, is_error_update_tasks]);

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
          {isLoading ? (
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
              <Box display="grid" sx={{ placeItems: "center" }}>
                <Box
                  component="label"
                  htmlFor="input-image"
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "400px",
                      xl: "500px",
                    },
                  }}
                >
                  <Skeleton animation="wave" variant="rectangular">
                    <Avatar
                      variant="rounded"
                      alt="Placeholder"
                      src="/proto-512.v2.svg"
                      sx={{
                        width: "100%",
                        height: "auto",
                        aspectRatio: "4 / 3",
                        objectFit: "contain",
                        objectPosition: "center",
                      }}
                    ></Avatar>
                  </Skeleton>
                </Box>
              </Box>
              <Box
                display="grid"
                gridTemplateColumns={{
                  xs: "1fr",
                  sm: "1fr 1fr",
                }}
                gridTemplateRows="auto"
                gap={{
                  xs: "16px",
                  sm: "32px",
                }}
              >
                {[1, 2].map((value) => (
                  <Skeleton
                    key={value}
                    animation="wave"
                    variant="rectangular"
                    width="100%"
                  >
                    <TextField></TextField>
                  </Skeleton>
                ))}
                {[3, 4].map((value) => (
                  <Skeleton
                    key={value}
                    animation="wave"
                    variant="rectangular"
                    width="100%"
                  >
                    <TextField multiline minRows={3}></TextField>
                  </Skeleton>
                ))}
                {[5, 6, 7, 8].map((value) => (
                  <Skeleton
                    key={value}
                    animation="wave"
                    variant="rectangular"
                    width="100%"
                  >
                    <TextField></TextField>
                  </Skeleton>
                ))}
              </Box>
              <Box
                display="grid"
                paddingX={{
                  sm: "10%",
                  md: "30%",
                }}
              >
                <Skeleton animation="wave" variant="rectangular" width="100%">
                  <Button variant="contained" size="large">
                    .
                  </Button>
                </Skeleton>
              </Box>
            </Box>
          ) : (
            <Formik
              initialValues={Object.assign(
                {
                  image: "",
                  name: "",
                  name_company: "",
                  contract_number: "",
                  contract_date: null,
                  activity: "",
                  obstacles: "",
                  status: "",
                  progress: "",
                  fiscal_year: "",
                  fund_source: "",
                  coordinate: "",
                  id_supervisors: undefined,
                },
                project,
                get_temp_project()
              )}
              validate={handleValidate}
              onSubmit={handleSubmit}
            >
              {({
                isSubmitting,
                values,
                errors,
                setFieldValue,
                handleSubmit,
              }) => (
                <Form autoComplete="off" onSubmit={handleSubmit}>
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
                    <Box display="grid" sx={{ placeItems: "center" }}>
                      <Box
                        component="label"
                        htmlFor="input-image"
                        sx={{
                          width: {
                            xs: "100%",
                            sm: "400px",
                            xl: "500px",
                          },
                        }}
                      >
                        <Input
                          // @ts-ignore
                          accept="image/*"
                          id="input-image"
                          name="image"
                          type="file"
                          sx={{ display: "none" }}
                          onChange={(e) => {
                            handleImage(e);
                            setFieldValue("image", e.target.value);
                          }}
                          disabled={isSubmitting}
                        />
                        <Button
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                          disabled={isSubmitting}
                          sx={{ width: "100%" }}
                        >
                          <Avatar
                            id="output-image"
                            variant="rounded"
                            // @ts-ignore
                            alt={name}
                            src={image}
                            sx={{
                              width: "100%",
                              height: "auto",
                              aspectRatio: "4 / 3",
                              objectFit: "contain",
                              objectPosition: "center",
                              opacity: isSubmitting ? ".7" : "1",
                            }}
                          >
                            <PhotoCameraIcon
                              sx={{ width: "44px", height: "44px" }}
                            />
                          </Avatar>
                        </Button>
                      </Box>
                      <FormHelperText error={!!errors.image}>
                        {errors.image ? errors.image + "" : ""}
                      </FormHelperText>
                    </Box>
                    <Box
                      display="grid"
                      gridTemplateColumns={{
                        xs: "1fr",
                        sm: "1fr 1fr",
                      }}
                      gridTemplateRows="auto"
                      gap={{
                        xs: "16px",
                        sm: "32px",
                      }}
                    >
                      <Field
                        component={FormikTextField}
                        variant="outlined"
                        name="name"
                        type="text"
                        label="Nama Proyek"
                        required
                      />
                      <Field
                        component={FormikTextField}
                        variant="outlined"
                        name="name_company"
                        type="text"
                        label="Nama Perusahaan"
                        required
                      />
                      <Field
                        component={FormikTextField}
                        variant="outlined"
                        name="contract_number"
                        type="number"
                        label="Nomor Kontrak"
                        required
                      />
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Tanggal Kontrak"
                          value={values.contract_date}
                          onChange={(newValue) =>
                            setFieldValue("contract_date", newValue)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="contract_date"
                              required
                              disabled={isSubmitting}
                            />
                          )}
                        />
                      </LocalizationProvider>
                      <Field
                        component={FormikTextField}
                        variant="outlined"
                        name="activity"
                        type="text"
                        label="Kegiatan"
                        multiline
                        minRows={3}
                        required
                      />
                      <Field
                        component={FormikTextField}
                        variant="outlined"
                        name="obstacles"
                        type="text"
                        label="Kendala"
                        multiline
                        minRows={3}
                        required
                      />
                      <FormControl fullWidth>
                        <InputLabel id="status" required>
                          Status
                        </InputLabel>
                        <Select
                          labelId="status"
                          id="status"
                          name="status"
                          label="Status"
                          value={values.status}
                          onChange={(event) =>
                            setFieldValue("status", event.target.value)
                          }
                          disabled={isSubmitting}
                          required
                        >
                          <MenuItem key="Pembangunan" value="Pembangunan">
                            Pembangunan
                          </MenuItem>
                          <MenuItem key="Perawatan" value="Perawatan">
                            Perawatan
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <Field
                        component={FormikTextField}
                        variant="outlined"
                        name="progress"
                        type="number"
                        label="Progress"
                        required
                        readOnly
                      />
                      <Field
                        component={FormikTextField}
                        variant="outlined"
                        name="fund_source"
                        type="text"
                        label="Sumber Dana"
                        required
                      />
                      <FormControl fullWidth>
                        <InputLabel id="fiscal_year" required>
                          Tahun Anggaran
                        </InputLabel>
                        <Select
                          labelId="fiscal_year"
                          name="fiscal_year"
                          label="Tahun Anggaran"
                          value={values.fiscal_year}
                          onChange={(event) =>
                            setFieldValue("fiscal_year", event.target.value)
                          }
                          disabled={isSubmitting}
                          required
                        >
                          {years.map((value) => (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl variant="outlined">
                        <InputLabel htmlFor="coordinate" required>
                          Kordinat
                        </InputLabel>
                        <OutlinedInput
                          id="coordinate"
                          label="Kordinat"
                          name="coordinate"
                          type="text"
                          value={values.coordinate}
                          error={!!errors.coordinate}
                          disabled={isSubmitting}
                          onChange={(evt) =>
                            setFieldValue("coordinate", evt.target.value)
                          }
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="pin coordinate"
                                onClick={handleSelectMap(values)}
                                // onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                <RoomIcon />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                        <FormHelperText>
                          {errors.coordinate ? errors.coordinate + "" : ""}
                        </FormHelperText>
                      </FormControl>
                      {user.account.role == "admin" && (
                        <FormControl fullWidth>
                          <InputLabel id="id_supervisors">Pengawas</InputLabel>
                          <Select
                            labelId="id_supervisors"
                            id="id_supervisors"
                            name="id_supervisors"
                            label="Pengawas"
                            value={values.id_supervisors}
                            onChange={(event) =>
                              setFieldValue(
                                "id_supervisors",
                                event.target.value
                              )
                            }
                            disabled={isSubmitting}
                          >
                            {supervisors.map((item) => (
                              <MenuItem key={item.username} value={item.id}>
                                {item.username}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </Box>
                    <Box
                      display="grid"
                      paddingX={{
                        sm: "10%",
                        md: "30%",
                      }}
                    >
                      <Button
                        id="submit-btn"
                        variant="contained"
                        size="large"
                        disableElevation
                        disabled={isSubmitting}
                        type="submit"
                      >
                        {created ? "Perbarui" : "Buat"}
                      </Button>
                    </Box>
                  </Box>
                </Form>
              )}
            </Formik>
          )}
        </Paper>
        {created && (
          <Box display="grid" gap="16px">
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h4">Proses</Typography>
              <ButtonGroup
                variant="contained"
                disableElevation
                aria-label="outlined primary button group"
              >
                <Tooltip title="Create Task">
                  <Button
                    startIcon={<AddIcon />}
                    sx={{
                      display: "grid",
                      placeContent: "center",
                      placeItems: "center",
                      minWidth: "auto",
                      padding: "12px",
                      "& .MuiButton-startIcon": {
                        margin: "0",
                      },
                    }}
                    onClick={handleIsAddTask}
                  ></Button>
                </Tooltip>
                <Tooltip title="More Option">
                  <Button
                    startIcon={<MoreVertIcon />}
                    sx={{
                      display: "grid",
                      placeContent: "center",
                      placeItems: "center",
                      minWidth: "auto",
                      padding: "12px",
                      "& .MuiButton-startIcon": {
                        margin: "0",
                      },
                    }}
                  ></Button>
                </Tooltip>
              </ButtonGroup>
            </Box>
            {isLoading ? (
              <Box display="flex" gap="8px" alignItems="center">
                <Skeleton animation="wave" variant="rectangular" width="100%">
                  <Box>
                    <Typography variant="subtitle2">.</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={100}
                      sx={{
                        width: "100%",
                        height: "8px",
                        borderRadius: "4px",
                      }}
                    ></LinearProgress>
                  </Box>
                </Skeleton>
              </Box>
            ) : (
              <Box display="flex" gap="8px" alignItems="center">
                <Typography variant="subtitle2">
                  {`${progress.done} / ${progress.of} ( ${Math.round(
                    progress.percent || 0
                  )}% )`}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress.percent}
                  sx={{ height: "8px", borderRadius: "4px", flexGrow: 1 }}
                ></LinearProgress>
              </Box>
            )}
            <Box
              display="flex"
              flexDirection="column"
              gap={{
                xs: "8px",
                md: "16px",
              }}
            >
              {isAddTask && (
                <Paper variant="outlined">
                  <Formik initialValues={{ note: "" }} onSubmit={handleAddTask}>
                    {({
                      values,
                      errors,
                      isSubmitting,
                      setFieldValue,
                      handleSubmit,
                    }) => (
                      <Form autoComplete="off" onSubmit={handleSubmit}>
                        <Box display="grid" gap="16px" padding="16px">
                          <TextField
                            autoFocus={true}
                            label="Note"
                            name="note"
                            multiline
                            minRows={1}
                            value={values.note}
                            error={!!errors.note}
                            // @ts-ignore
                            helperText={errors.note}
                            disabled={isSubmitting}
                            onChange={(evt) =>
                              setFieldValue("note", evt.target.value)
                            }
                          ></TextField>
                          <Box display="flex" gap="16px">
                            <Button
                              fullWidth
                              variant="contained"
                              color="primary"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              Add
                            </Button>
                            <Button
                              fullWidth
                              variant="outlined"
                              color="error"
                              disabled={isSubmitting}
                              onClick={handleIsAddTask}
                            >
                              Cancel
                            </Button>
                          </Box>
                        </Box>
                      </Form>
                    )}
                  </Formik>
                </Paper>
              )}
              {isLoading ? (
                [10, 11, 12].map((value) => (
                  <Skeleton
                    key={value}
                    animation="wave"
                    variant="rectangular"
                    width="100%"
                  >
                    <Paper variant="outlined" sx={{ padding: "8px 16px" }}>
                      <Box display="flex" gap="16px" alignItems="center">
                        <Typography variant="subtitle1" sx={{ flexGrow: "1" }}>
                          .
                        </Typography>
                        <Tooltip title="More Option">
                          <Button
                            startIcon={<MoreVertIcon />}
                            sx={{
                              display: "grid",
                              placeContent: "center",
                              placeItems: "center",
                              minWidth: "auto",
                              padding: "12px",
                              "& .MuiButton-startIcon": {
                                margin: "0",
                              },
                            }}
                          ></Button>
                        </Tooltip>
                      </Box>
                      <Box></Box>
                    </Paper>
                  </Skeleton>
                ))
              ) : (
                <DndProvider backend={mdUp ? HTML5Backend : TouchBackend}>
                  {tasks.map((data, index) => (
                    <DragDrop
                      key={data.id}
                      data={data}
                      list={tasks}
                      onDropHover={handleTaskSwitch}
                    >
                      {({ ref, isDragging }) => (
                        <Paper
                          ref={ref}
                          variant="outlined"
                          sx={{
                            padding: "8px 16px",
                            visibility: isDragging ? "hidden" : "visible",
                          }}
                        >
                          <Box display="flex" gap="" alignItems="center">
                            <Box display="flex" gap="" alignItems="center">
                              <Button
                                size="small"
                                color="primary"
                                disableTouchRipple
                                startIcon={
                                  <DragIndicatorIcon></DragIndicatorIcon>
                                }
                                sx={{
                                  display: "grid",
                                  placeContent: "center",
                                  placeItems: "center",
                                  minWidth: "auto",
                                  padding: "12px 4px",
                                  "& .MuiButton-startIcon": {
                                    margin: "0",
                                  },
                                }}
                              ></Button>
                              <Checkbox
                                checked={data.done}
                                onClick={handleTaskDone(index)}
                              ></Checkbox>
                            </Box>
                            <TextField
                              size="small"
                              value={data.note}
                              multiline
                              minRows={1}
                              fullWidth={true}
                              disabled={data.done}
                              onChange={handleTaskEdit(index)}
                            ></TextField>
                            <Tooltip title="More Option">
                              <Button
                                size="small"
                                startIcon={<MoreVertIcon />}
                                sx={{
                                  display: "grid",
                                  placeContent: "center",
                                  placeItems: "center",
                                  minWidth: "auto",
                                  padding: "12px",
                                  "& .MuiButton-startIcon": {
                                    margin: "0",
                                  },
                                }}
                              ></Button>
                            </Tooltip>
                          </Box>
                        </Paper>
                      )}
                    </DragDrop>
                  ))}
                </DndProvider>
              )}
            </Box>
            <Box
              display="grid"
              paddingX={{
                sm: "10%",
                md: "30%",
              }}
            >
              {isLoading ? (
                <Skeleton animation="wave" variant="rectangular" width="100%">
                  <Button variant="contained" size="large">
                    .
                  </Button>
                </Skeleton>
              ) : (
                <Button
                  id="submit-btn"
                  variant="contained"
                  size="large"
                  disableElevation
                  disabled={is_loading_update_tasks}
                  onClick={handleTasksUpdate}
                >
                  Perbarui
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Box>
      {/* <DialogPassword
        open={openDialogPass}
        onSubmit={handleAuth}
        onClose={() => setOpenDialogPass(false)}
        // values={{}}
        errors={isErrorSignin ? { password: errorSignin.data.message } : {}}
      ></DialogPassword> */}
      <Snackbar
        key={snack.id}
        open={snack.open}
        autoHideDuration={5000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {snack.message}
      </Snackbar>
    </>
  );
}

ProjectsDetail.getLayout = AdminShell;
