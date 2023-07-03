import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { Button } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import swal from "sweetalert";
import Signin from "./Signin";
import Createlog from "./Createlog";
import Editlog from "./Editlog";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
}));

const token = localStorage.getItem("token");
async function deleteFlight(flightID) {
  return fetch("http://localhost:5000/flightLog/" + flightID, {
    method: "DELETE",
    headers: {
      "Authorization": token,
    },
  }).then((response) => response.json());
}

export default function Homepage() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [flightlog, setFlightLog] = useState([]);

  const fetchData = async () => {
    return fetch("http://localhost:5000/flightLog", {
      method: "GET",
      headers: {
        "Authorization": token,
      },
    })
      .then((response) => response.json())
      .then((data) => setFlightLog(data.data));
  };

  useEffect(() => {
    fetchData();
    if (token === "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }, []);

  const handleDelete = async (e, flightID) => {
    e.preventDefault();
    const response = await deleteFlight(flightID);
    if (response) {
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

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreate = () => {
    window.location.href = "/createlog";
  };

  const handleEdit = (e, flightID) => {
    localStorage.setItem("editFlightID", flightID);
    window.location.href = "/editlog";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            Flight Logs{" "}
          </Typography>{" "}
          <div>
            <Button onClick={handleLogout} color="inherit">
              {" "}
              Logout{" "}
            </Button>{" "}
            <IconButton onClick={handleMenu} color="inherit">
              {" "}
            </IconButton>{" "}
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}> Logout </MenuItem>{" "}
            </Menu>{" "}
          </div>{" "}
        </Toolbar>{" "}
      </AppBar>{" "}
      <TableContainer component={Paper}>
        {" "}
        <Table>
          {" "}
          <TableHead>
            <TableRow>
              <TableCell> Flight ID </TableCell>{" "}
              <TableCell> Tail Number </TableCell>{" "}
              <TableCell> Take Off </TableCell> <TableCell> Landing </TableCell>{" "}
              <TableCell> Duration </TableCell> <TableCell> Edit </TableCell>{" "}
              <TableCell> Delete </TableCell>{" "}
            </TableRow>{" "}
          </TableHead>{" "}
          <TableBody>
            {" "}
            {flightlog.map((row) => (
              <TableRow key={row.number}>
                <TableCell key="{row.flightID}" component="th" scope="row">
                  {" "}
                  {row.flightID}{" "}
                </TableCell>{" "}
                <TableCell key="{row.tailNumber}"> {row.tailNumber} </TableCell>{" "}
                <TableCell key="{row.takeoff}"> {row.takeoff} </TableCell>{" "}
                <TableCell key="{row.landing}"> {row.landing} </TableCell>{" "}
                <TableCell key="{row.Duration}"> {row.Duration} </TableCell>{" "}
                <TableCell key="edit">
                  {" "}
                  <Button
                    key="{row.flightID}"
                    variant="outlined"
                    color="primary"
                    onClick={(event) => handleEdit(event, row.flightID)}
                  >
                    {" "}
                    Edit{" "}
                  </Button>{" "}
                </TableCell>{" "}
                <TableCell key="delete">
                  {" "}
                  <Button
                    key="{row.flightID}"
                    onClick={(event) => handleDelete(event, row.flightID)}
                    variant="outlined"
                    color="secondary"
                  >
                    {" "}
                    Delete{" "}
                  </Button>{" "}
                </TableCell>{" "}
              </TableRow>
            ))}{" "}
          </TableBody>{" "}
        </Table>{" "}
      </TableContainer>{" "}
      <Button variant="outlined" color="inherit" onClick={handleCreate}>
        {" "}
        Add Flight Log{" "}
      </Button>{" "}
    </div>
  );
}
