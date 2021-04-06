import React, { useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";

//redux imports
import { useSelector, useDispatch } from "react-redux";
import { switchDetailsAction } from "../redux";

import PropertyDetails from "./../Property/PropertyCard/PropertyDetails";
//custom comps
import Divider from "@material-ui/core/Divider";
import loadable from "@loadable/component";
import Features from "../Property/Features";

//font awesome icons
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

import { useHistory } from "react-router-dom";

import ToolsBar, { Tool } from "../utils/ToolsBar";
import { db } from "../base";

const RequestForm = loadable(() => import("./RequestForm"));
const useStyles = makeStyles((theme) => ({
  root: {
    height: "calc(100vh - 64px)",
    overflow: "scroll",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.contrastText,
    borderRadius: 20,
    padding: 9,
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function RequestDet() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const showDetails = (show) =>
    dispatch({ type: "SHOWR_DETAILS", payload: show });

  const selectedRequest = useSelector((state) => state.request.selectedRequest);

  const deleteReq = async () => {
    const { app } = await import("./../base");

    app
      .firestore()
      .collection("requests")
      .doc(selectedRequest.id)
      .delete()
      .then(() => switchDetailsAction());
  };

  const check = async (checked) => {
    const { app } = await import("./../base");

    app.firestore().collection("requests").doc(selectedRequest.id).set(
      {
        bookmarked: checked,
      },
      { merge: true }
    );
    dispatch({
      type: "SET_SELECTED_REQUEST",
      payload: { ...selectedRequest, bookmarked: checked },
    });
  };

  const pushEditForm = () => {
    history.push({
      pathname: `/Home/reqform`,
      propData: selectedRequest,
    });
  };

  const tools = [
    <>
      <Hidden only={["md", "lg"]}>
        <Tool
          icon={faArrowLeft}
          label={"Volver"}
          onClick={() => showDetails(false)}
        />
        <Divider style={{ margin: 0 }} orientation="vertical" flexItem />
      </Hidden>
    </>,
    <Tool icon={faEdit} label={"Editar"} onClick={pushEditForm} />,
    <Tool
      icon={faBookmark}
      label={selectedRequest.bookmarked ? "Desmarcar" : "Marcar"}
      onClick={
        selectedRequest.bookmarked ? () => check(false) : () => check(true)
      }
    />,
    <Tool icon={faTrash} label={"Borrar"} onClick={deleteReq} />,
  ];

  useEffect(() => {
    var unregister = null;
    if (selectedRequest) {
      unregister = db
        .collection("requests")
        .doc(selectedRequest.id)
        .onSnapshot(
          (doc) => {
            dispatch({
              type: "SET_SELECTED_REQUEST",
              payload: { ...doc.data() },
            });
          },
          function (error) {
            console.log(error.message);
          }
        );
    }

    return unregister ? unregister : () => console.log("");
  }, [dispatch, selectedRequest]);

  return (
    <div
      style={{
        height: "calc(100vh - 180px)",
        overflow: "scroll",
      }}
      className="hidden-scroll"
    >
      <Grid className={classes.root}>
        {selectedRequest && (
          <Grid item sm={12} md={12} xs={12}>
            <ToolsBar tools={tools} />

            <div>
              <img
                alt="mapa del request"
                style={{ width: "100%", borderRadius: 20 }}
                src={selectedRequest.map?.snapUrl}
              ></img>
            </div>

            <Divider className={classes.margin} />

            <PropertyDetails propData={selectedRequest}></PropertyDetails>

            <Features propData={selectedRequest} />
          </Grid>
        )}
      </Grid>
    </div>
  );
}
