import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Checkbox from "@mui/material/Checkbox";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";

import Admin from "@/layout/Admin";
import Page from "@/layout/Page";
import { useGetAllQuery, useDeleteByIdMutation } from "@/store/projects";

export default function Projects(props) {
  const router = useRouter();
  const {
    data: projects = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch,
  } = useGetAllQuery();
  const [
    remove,
    {
      error: removingError,
      isLoading: isRemoving,
      isSuccess: isRemovingSuccess,
      isError: isRemovingError,
    },
  ] = useDeleteByIdMutation();
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snack, setSnack] = useState({
    id: "",
    open: false,
    message: <div></div>,
  });
  const handleCardClicked = (index, name) => () => {
    if (selectMode) {
      if (selected.includes(index)) {
        selected.splice(selected.indexOf(index), 1);
      } else {
        selected.push(index);
      }
      setSelected(Array.of(...selected));
    } else {
      router.push(`/admin/projects/${name}`);
    }
  };
  const handleCreateProject = () => {
    router.push("/admin/projects/Buat Proyek");
  };
  const handleDialogOpen = (event, reason) => {
    setDialogOpen(true);
  };
  const handleDialogClose = (event, reason) => {
    setDialogOpen(false);
  };
  const handleSnackClose = (event, reason) => {
    setSnack((prev) => ({ ...prev, open: false }));
  };
  const handleSelect = () => {
    setSelected([]);
    setSelectMode(!selectMode);
  };
  const handleDelete = async () => {
    handleDialogClose();
    for (const index of selected) {
      const project = projects[index];
      await remove({ id: project.id });
    }
    setSelected([]);
    setSelectMode(!selectMode);
  };
  const handleCancel = () => {
    setSelected([]);
    setSelectMode(!selectMode);
  };
  const handleDone = () => {
    setSelected([]);
    setSelectMode(!selectMode);
  };

  useEffect(() => {
    if (isRemovingError) {
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            {removingError.data
              ? removingError.data.message
              : removingError.message}
          </Alert>
        ),
      }));
    } else if (isRemovingSuccess) {
      refetch();
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="success">
            Success Remove {selected.length} Project.
          </Alert>
        ),
      }));
    }
  }, [isRemovingSuccess, isRemovingError]);

  return (
    <Page>
      <Admin pageTitle="Projects" loaderProgress={{ show: isRemoving }}>
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
          <Box
            display="flex"
            gap={{
              mobile: "16px",
              tablet: "32px",
            }}
          >
            <ButtonGroup
              variant="contained"
              disableElevation
              aria-label="outlined primary button group"
            >
              <Tooltip title="Create Project">
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
                  onClick={handleCreateProject}
                ></Button>
              </Tooltip>
              <Tooltip title="Selection Mode">
                <Button
                  startIcon={<CheckIcon />}
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
                  onClick={handleSelect}
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
            {selectMode && (
              <ButtonGroup
                variant="contained"
                disableElevation
                aria-label="outlined primary button group"
              >
                <Tooltip title="Delete Project">
                  <Button
                    startIcon={<DeleteOutlineIcon />}
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
                    onClick={handleDialogOpen}
                  ></Button>
                </Tooltip>
                <Tooltip title="Cancel">
                  <Button
                    startIcon={<ClearIcon />}
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
                    onClick={handleCancel}
                  ></Button>
                </Tooltip>
                <Tooltip title="Done">
                  <Button
                    startIcon={<DoneIcon />}
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
                    onClick={handleDone}
                  ></Button>
                </Tooltip>
              </ButtonGroup>
            )}
          </Box>
          <Box
            display="grid"
            gridTemplateColumns={{
              mobile: "1fr",
              tablet: "1fr 1fr",
              laptop: "1fr 1fr 1fr",
            }}
            gridTemplateRows="auto"
            gap={{
              mobile: "16px",
              tablet: "32px",
            }}
          >
            {isLoading &&
              [1, 2, 3].map((value) => (
                <Card key={value} variant="outlined">
                  <CardActionArea disableTouchRipple={true}>
                    <Skeleton animation="wave" variant="rectangular">
                      <CardMedia
                        component="img"
                        sx={{
                          width: "100%",
                          height: "auto",
                          aspectRatio: "4 / 3",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                        image="/proto-512.v2.svg"
                        alt="Placeholder"
                      />
                    </Skeleton>
                    <CardContent>
                      <Skeleton animation="wave" variant="text" width="100%">
                        <Typography
                          variant="overline"
                          component="div"
                          sx={{
                            textAlign: "left",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          .
                        </Typography>
                      </Skeleton>
                      <Skeleton animation="wave" variant="text" width="100%">
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{
                            height: "4rem",
                            textAlign: "left",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "2",
                            WebkitBoxOrient: "vertical",
                          }}
                          gutterBottom
                        >
                          .
                        </Typography>
                      </Skeleton>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            {projects.map((project, index) => (
              <Card variant="outlined" key={project.id}>
                <CardActionArea
                  onClick={handleCardClicked(index, project.name)}
                  disableRipple={isFetching}
                  sx={{ opacity: isFetching ? ".7" : "1" }}
                >
                  {selectMode && (
                    <Checkbox
                      sx={{ position: "absolute", right: 0, top: 0 }}
                      checked={selected.includes(index)}
                    />
                  )}
                  <CardMedia
                    component="img"
                    sx={{
                      width: "100%",
                      height: "auto",
                      aspectRatio: "4 / 3",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    image={project.image}
                    alt={project.name}
                  />
                  <CardContent>
                    <Typography
                      variant="overline"
                      component="div"
                      sx={{
                        textAlign: "left",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "1",
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {project.name_company}
                    </Typography>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        height: "4rem",
                        textAlign: "left",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                      }}
                      gutterBottom
                    >
                      {project.name}
                    </Typography>
                    <Box display="grid" gap="8px">
                      <LinearProgress
                        variant="determinate"
                        value={project.progress}
                      ></LinearProgress>
                      <Typography variant="body2">
                        Progress: {project.progress}%
                      </Typography>
                      <Typography variant="body2">
                        Status: {project.status}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Box>
      </Admin>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Hapus Proyek</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Apakah Anda yakin ingin menghapus {selected.length} Proyek?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>Ya</Button>
          <Button onClick={handleDialogClose} autoFocus color="error">
            Batal
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        key={snack.id}
        open={snack.open}
        autoHideDuration={6000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {snack.message}
      </Snackbar>
    </Page>
  );
}
