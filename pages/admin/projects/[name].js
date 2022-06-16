import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { styled, useTheme } from "@mui/material/styles";
import { Formik, Form, Field } from "formik";
import { TextField as FormikTextField } from "formik-mui";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
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

import Admin from "@/layout/Admin";
import Page from "@/layout/Page";
import {
  useGetByNameQuery,
  useGetByNameWithTasksQuery,
  useCreateMutation,
  useUpdateByIdMutation,
} from "@/store/projects";
import { useUpdateByIdMutation as useUpdateTasksByIdMutation } from "@/store/tasks";

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
          const opr = dropResult.dropEffect;
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
  const { name } = router.query;
  const {
    data: project = { tasks: [] },
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useGetByNameWithTasksQuery({ name });
  const [tasksUpdate, { isLoading: isTasksUpdating }] =
    useUpdateTasksByIdMutation();
  const [create, { isLoading: isCreating }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateByIdMutation();
  const [tasks, setTasks] = useState([]);
  const [created, setCreated] = useState(false);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const [progress, setProgress] = useState({ done: 0, of: 0, percent: 0 });
  const [isAddTask, setIsAddTask] = useState("");
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
        contract_date: values.contract_date.toString(),
      });
      if (created) {
        await update({
          id: project.id,
          data,
          file,
        }).unwrap();

        message = (
          <Alert elevation={6} severity="success">
            Success Update
          </Alert>
        );
      } else {
        await create({ data, file }).unwrap();

        message = (
          <Alert elevation={6} severity="success">
            Success Create
          </Alert>
        );
      }
      // TODO remove log
      console.log(data);
    } catch (error) {
      message = (
        <Alert elevation={6} severity="error">
          {error.message}
        </Alert>
      );
    } finally {
      setSnack((prev) => ({
        ...prev,
        open: true,
        message,
      }));
      setSubmitting(false);

      !created &&
        setTimeout(() => {
          router.push("/admin/projects");
        }, 1500);
    }
  };
  const handleTasksUpdate = async () => {
    let message;
    try {
      if (!project.id) {
        throw new Error("Create Project First");
      }
      const res = await tasksUpdate({ id: project.id, data: tasks });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      message = (
        <Alert elevation={6} severity="success">
          Success Update
        </Alert>
      );
    } catch (error) {
      message = (
        <Alert elevation={6} severity="error">
          {error.message}
        </Alert>
      );
    } finally {
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
  const handleAddTask = (values, { setSubmitting }) => {
    setIsAddTask(false);
    setTasks(
      Array.of(
        {
          id: tasks.length + 1,
          note: values.note,
          done: false,
        },
        ...tasks
      )
    );
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
      copy.done = !task.done;

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
    const prevTask = tasks[nextTask];
    tasks[nextTask] = tasks[currTask];
    tasks[currTask] = prevTask;
    setTasks(Array.of(...tasks));
  };
  const handleSnackClose = (event, reason) => {
    setSnack((prev) => ({ ...prev, open: false }));
  };

  useEffect(
    function () {
      setCreated(!!project.id);
    },
    [project]
  );
  useEffect(
    function () {
      if (isSuccess) {
        setImage(project.image);
        calculateProgress();
        setTasks(Array.of(...project.tasks));
      }
    },
    [isSuccess]
  );
  useEffect(() => {
    calculateProgress();
  }, [tasks]);

  return (
    <Page>
      <Admin
        pageTitle={created ? project.name : "Create Project"}
        loaderProgress={{ show: isCreating || isUpdating || isTasksUpdating }}
      >
        <Box
          display="grid"
          padding={{
            mobile: "16px",
            tablet: "32px",
          }}
          gap={{
            mobile: "16px",
            tablet: "32px",
          }}
        >
          <Paper variant="outlined">
            {isLoading ? (
              <Box
                display="grid"
                padding={{
                  mobile: "16px",
                  tablet: "32px",
                }}
                gap={{
                  mobile: "16px",
                  tablet: "32px",
                }}
              >
                <Box display="grid" sx={{ placeItems: "center" }}>
                  <Box
                    component="label"
                    htmlFor="input-image"
                    sx={{
                      width: {
                        mobile: "100%",
                        tablet: "400px",
                        desktop: "500px",
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
                    mobile: "1fr",
                    tablet: "1fr 1fr",
                  }}
                  gridTemplateRows="auto"
                  gap={{
                    mobile: "16px",
                    tablet: "32px",
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
                    tablet: "10%",
                    laptop: "30%",
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
                    contract_date: "",
                    activity: "",
                    obstacles: "",
                    status: "",
                    progress: "",
                    fiscal_year: "",
                    fund_source: "",
                    status: "",
                    fiscal_year: "",
                    contract_date: null,
                  },
                  project
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
                        mobile: "16px",
                        tablet: "32px",
                      }}
                      gap={{
                        mobile: "16px",
                        tablet: "32px",
                      }}
                    >
                      <Box display="grid" sx={{ placeItems: "center" }}>
                        <Box
                          component="label"
                          htmlFor="input-image"
                          sx={{
                            width: {
                              mobile: "100%",
                              tablet: "400px",
                              desktop: "500px",
                            },
                          }}
                        >
                          <Input
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
                          {errors.image}
                        </FormHelperText>
                      </Box>
                      <Box
                        display="grid"
                        gridTemplateColumns={{
                          mobile: "1fr",
                          tablet: "1fr 1fr",
                        }}
                        gridTemplateRows="auto"
                        gap={{
                          mobile: "16px",
                          tablet: "32px",
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
                      </Box>
                      <Box
                        display="grid"
                        paddingX={{
                          tablet: "10%",
                          laptop: "30%",
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
                  mobile: "8px",
                  laptop: "16px",
                }}
              >
                {isAddTask && (
                  <Paper variant="outlined">
                    <Formik
                      initialValues={{ note: "" }}
                      onSubmit={handleAddTask}
                    >
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
                          <Typography
                            variant="subtitle1"
                            sx={{ flexGrow: "1" }}
                          >
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
                  <DndProvider backend={HTML5Backend}>
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
                  tablet: "10%",
                  laptop: "30%",
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
                    disabled={isTasksUpdating}
                    onClick={handleTasksUpdate}
                  >
                    Perbarui
                  </Button>
                )}
              </Box>
              {/* <Formik initialValues={{ note: "" }} onSubmit={handleAddTask}>
              {({
                values,
                errors,
                isSubmitting,
                setFieldValue,
                handleSubmit,
              }) => (
                <Form autoComplete="off" onSubmit={handleSubmit}>
                  
                </Form>
              )}
            </Formik> */}
            </Box>
          )}
        </Box>
      </Admin>
      <Snackbar
        key={snack.id}
        open={snack.open}
        autoHideDuration={5000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {snack.message}
      </Snackbar>
    </Page>
  );
}
