import { Box, makeStyles,Typography } from '@material-ui/core';
import Alert from "@material-ui/lab/Alert";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import { useHistory } from 'react-router-dom';
import { API } from "../../config";
import { getInfo } from '../Log/actions';

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
    textAlign:"center",
    position:'relative',
    left:"-10px",
    '@media (min-width:600px)': {
      left:"50%"
    },
  },
  box_container: {
    marginTop: theme.spacing(10),
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height:"100vh",
    '@media (min-width:600px)': {
      marginTop: theme.spacing(10),
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    },
  },
  box: {
    width: "300px",
    '@media (min-width:600px)': {
      width: "600px",
      margin: "10px"
    }
  },

}))


function PaymentsConfig() {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.reducerLog.info.id);
  const user = useSelector((state) => state.reducerLog.user);
  // "vinculando" | "ok" | "error"
  const [state, setState] = useState("vinculando");
  const classes = useStyle();

  // Mercado Pago vuelve acá con ?code=...; el servidor lo canjea por el token del profesional.
  // Se espera a tener el perfil cargado (id) para saber que hay sesión.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!id) return;
    if (!code) return setState("error");

    axios({ method: "POST", url: `${API}/profesionaltoken`, data: { code } })
      .then(() => {
        setState("ok");
        dispatch(getInfo(user));
      })
      .catch(() => setState("error"));
  }, [id, user, dispatch]);

  return (
    <Box className={classes.box_container}>
      <Box className={classes.box} marginBottom="10px">
        {state === "vinculando" && <Alert severity="info">Configurando su sistema de pagos...</Alert>}
        {state === "ok" && (
          <Alert severity="success">
            <Typography className={classes.text}>Se configuro su sistema de pagos</Typography>
          </Alert>
        )}
        {state === "error" && (
          <Alert severity="error">
            <Typography className={classes.text}>No se pudo configurar su sistema de pagos</Typography>
          </Alert>
        )}
      </Box>
    </Box>
  );
}

export default PaymentsConfig;
