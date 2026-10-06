import { Box, makeStyles } from '@material-ui/core';
import Alert from "@material-ui/lab/Alert";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInfo } from '../Log/actions';
//import { useDispatch, useSelector } from 'react-redux';
//import { useHistory } from 'react-router-dom';
import { API } from "../../config";
//import { getInfo } from '../Log/actions';

const useStyle = makeStyles(theme => ({
  magin: {
    margin: theme.spacing(2),
  },
  menuButton: {
    margin: theme.spacing(1),

  },
  fledDirection: {
    flexDirection: 'row-reverse',
  },
  bar: {
    background: "white",
    borderRadius: "5px"
  },
  text: {
    color: "#159DE9",
    marginRight: theme.spacing(100),
    marginLeft: theme.spacing(5)
  },
  box_container: {
    marginTop: theme.spacing(10),
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    '@media (min-width:600px)': {
      marginTop: theme.spacing(10),
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    },
  },
  box: {
    height:"400px",
    width: "300px",
    marginTop:"20vh",
    '@media (min-width:600px)': {
      width: "600px",
      margin: "10px",
      marginTop:"35vh",
      
    }
  },

}))


function Subscripcion() {
  const classes = useStyle();
  // "confirmando" | "ok" | "error" | "sin-pago"
  const [state, setState] = useState("confirmando");
  const dispatch = useDispatch();
  const user = useSelector((store) => store.reducerLog.user);

  // Mercado Pago vuelve a esta página con ?payment_id=...&status=approved.
  // Se espera a que haya sesión (user.email) para poder confirmar el pago con el servidor,
  // que lo consulta a Mercado Pago: el cliente no puede acreditarse días por su cuenta.
  const paymentId = new URLSearchParams(window.location.search).get("payment_id");
  useEffect(() => {
    if (!paymentId) return setState("sin-pago");
    if (!user.email) return;

    axios({ method: "POST", url: `${API}/addSub`, data: { paymentId } })
      .then(() => {
        setState("ok");
        dispatch(getInfo(user));
      })
      .catch(() => setState("error"));
  }, [paymentId, user, dispatch]);

  return (
    <Box className={classes.box_container}>
      <Box className={classes.box} marginBottom="10px">
        {state === "confirmando" && <Alert severity="info">Confirmando el pago...</Alert>}
        {state === "ok" && <Alert severity="success">Se han añadido 30 dias a su subscripcion</Alert>}
        {state === "error" && (
          <Alert severity="error">No pudimos confirmar el pago. Si ya pagaste, la suscripción se acreditará en unos minutos.</Alert>
        )}
        {state === "sin-pago" && <Alert severity="warning">No se encontró ningún pago para confirmar.</Alert>}
      </Box>
    </Box>
  );
}

export default Subscripcion;
