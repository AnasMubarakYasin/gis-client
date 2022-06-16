import Admin from "@/layout/Admin"
import Page from "@/layout/Page"

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { add } from '@/store/team'

import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-mui'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
// import TextField from '@mui/material/TextField'
// import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
// import ButtonGroup from '@mui/material/ButtonGroup'
import Input from '@mui/material/Input'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

// import AddIcon from '@mui/icons-material/Add'
// import CheckIcon from '@mui/icons-material/Check'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'

import { } from '@/store/team'

export default function TeamAdd(props) {
  const [image, setImage] = useState("")
  const [snack, setSnack] = useState({
    open: false, id: "", message: <div>message</div>,
  })
  const dispatch = useDispatch()
  const handleImage = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]))
  }
  const handleSnackClose = (event, reason) => {
    setSnack((prev) => ({ ...prev, open: false }))
  }

  return (
    <Page>
      <Admin pageTitle="Add Member">
        <Box
          display="grid"
          padding={{
            mobile: "16px",
            tablet: "32px",
          }}
          gap={{
            mobile: "16px",
            tablet: "32px",
          }}>
          <Paper variant="outlined">
            <Formik
              initialValues={{}}
              validate={(values) => {
                const errors = {};
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                const data = Object.assign({}, values, { image })
                dispatch(add(data))
                setSnack((prev) => ({
                  ...prev, open: true, message: (
                    <Alert severity="success">
                      Success Add Member
                    </Alert>
                  )
                }))
                // setSubmitting(false)
              }}
            >
              {({ isSubmitting, values, submitForm, handleBlur, handleChange }) => (
                <Form>
                  <Box
                    display="grid"
                    padding={{
                      mobile: "16px",
                      tablet: "32px",
                    }}
                    gap={{
                      mobile: "16px",
                      tablet: "32px",
                    }}>
                    <Box display="grid" sx={{ placeItems: "center" }}>
                      <label htmlFor="icon-button-file">
                        <Input
                          name="image"
                          accept="image/*"
                          id="icon-button-file"
                          type="file"
                          sx={{ display: "none" }}
                          onInput={handleImage}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.image} />
                        <IconButton color="primary" aria-label="upload picture" component="span" disabled={isSubmitting}>
                          <Avatar alt={"Profile"} src={image} sx={{ width: "80px", height: "80px" }}>
                            <PhotoCameraIcon sx={{ width: "44px", height: "44px" }} />
                          </Avatar>
                        </IconButton>
                      </label>
                    </Box>
                    <Box display="grid"
                      gridTemplateColumns={{
                        mobile: "1fr",
                        tablet: "1fr 1fr",
                      }}
                      gridTemplateRows="auto"
                      gap={{
                        mobile: "16px",
                        tablet: "32px",
                      }}>
                      <Field
                        component={TextField}
                        variant="outlined"
                        name="name"
                        type="text"
                        label="Name"
                        autoComplete="name"
                        required
                      />
                      <Field
                        component={TextField}
                        variant="outlined"
                        name="nik"
                        type="text"
                        label="NIK"
                        required
                      />
                      <Field
                        component={TextField}
                        variant="outlined"
                        name="handphone"
                        label="Handphone"
                        type="tel"
                        autoComplete="tel"
                        required
                      />
                      <Field
                        component={TextField}
                        variant="outlined"
                        name="email"
                        type="email"
                        label="Email"
                        autoComplete="email"
                        required
                      />
                      <Field
                        component={TextField}
                        variant="outlined"
                        name="address"
                        label="Address"
                        type="address"
                        autoComplete="address-level1 address-level2 address-level3 address-level4"
                        required
                      />
                      <Field
                        component={TextField}
                        variant="outlined"
                        name="job"
                        label="Job"
                        autoComplete="work"
                        required
                      />
                      <Field
                        component={TextField}
                        variant="outlined"
                        name="experience"
                        label="Experience"
                        multiline
                        minRows={3}
                        required
                      />

                    </Box>
                    <Box display="grid"
                      paddingX={{
                        mobile: "16px",
                        tablet: "30%",
                      }}>
                      <Button
                        variant="contained"
                        size="large"
                        disableElevation
                        disabled={isSubmitting}
                        onClick={submitForm}>Submit</Button>
                    </Box>
                  </Box>
                </Form>
              )}
            </Formik>
          </Paper>
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
  )
}
