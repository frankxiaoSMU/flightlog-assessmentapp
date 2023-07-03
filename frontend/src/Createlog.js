import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import swal from "sweetalert";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundSize: "cover",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
const token = localStorage.getItem("token");
async function makeNewLog(data) {
  return fetch("http://localhost:5000/flightLog", {
    method: "POST",
    headers: {
      "Authorization": token,
    },
    body: data,
  }).then((data) => data.json());
}

export default function Createlog() {
  const classes = useStyles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    const response = await makeNewLog(data);
    if (response["data"] !== undefined && response["data"] !== null) {
      swal("Success", response.message, "success", {
        buttons: false,
        timer: 2000,
      }).then((value) => {
        window.location.href = "/";
      });
    } else {
      swal("Failed", response.message, "error");
    }
  };

  return (
    <Grid container className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} md={7} className={classes.image} />{" "}
      <Grid item xs={12} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Add a new Flight Log{" "}
          </Typography>{" "}
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="flightID"
              name="flightID"
              label="Flight ID"
            />{" "}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="tailNumber"
              name="tailNumber"
              label="Tail Number"
            />{" "}
            <TextField
              id="takeoff"
              name="takeoff"
              margin="normal"
              label="Takeoff Time"
              type="datetime-local"
              defaultValue="2017-05-24T10:30"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />{" "}
            <TextField
              id="landing"
              name="landing"
              margin="normal"
              label="Landing Time"
              type="datetime-local"
              defaultValue="2017-05-24T10:30"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />{" "}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="Duration"
              name="Duration"
              label="Duration"
            />{" "}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Add{" "}
            </Button>{" "}
          </form>{" "}
        </div>{" "}
      </Grid>{" "}
    </Grid>
  );
}
