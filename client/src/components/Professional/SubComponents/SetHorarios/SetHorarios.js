import es from "date-fns/locale/es";
import {
  Box,
  Typography,
  makeStyles,
  FormControl,
  MenuItem,
  TextField,
  Button,
} from "@material-ui/core";
import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { getInfo } from "../../../Log/actions";
import axios from "axios";
import { API } from "../../../../config";

const useStyle = makeStyles((theme) => ({
  text: {
    color: "#159DE9",
  },
  box: {
    padding: "10px",
    paddingLeft: "50px",
    paddingRight: "50px",
    marginLeft: "10px",
    marginRight: "10px",
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column",
    borderRadius: "10px",
    color: "#159DE9",
  },
}));

const dias = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

export default function SetHorario() {
  const classes = useStyle();
  const dispatch = useDispatch();
  const [turno, setTurno] = useState({
    dia: dias[0],
    horaInicio: new Date("December 17, 1995 13:00:00"),
    horaFin: new Date("December 17, 1995 14:00:00"),
  });
  const user = useSelector((store) => store.reducerLog.info);
  const log = useSelector((store) => store.reducerLog.user);

  const renderDeleteButton = (params) => {
    return (
      <div style={{ display: "flex", width: "130px", flexDirection: "row" , alignItems:"center", justifyContent:"space-around"}}>
        <div style={{}}>{params.value}</div>
        { params.value.length > 0?
        <button
          style={{
            height: "20px",
            width: "20px",
            color: "brown",
            backgroundColor: "transparent",
            border: "brown solid 1px",
            borderRadius: "30%",
            cursor:"pointer"
          }}
          onClick = {()=>{deleteData({day:params.field,value:params.value})}}
        >
          {" "}
          X{" "}
        </button> : ""}
      </div>
    );
  };

  const columns = [
    {
      field: "lunes",
      headerName: "Lunes",
      width: 150,
      renderCell: renderDeleteButton,
      disableClickEventBubbling: true,
    },
    {
      field: "martes",
      headerName: "Martes",
      width: 150,
      renderCell: renderDeleteButton,
      disableClickEventBubbling: true,
    },    {
      field: "miercoles",
      headerName: "Miercoles",
      width: 150,
      renderCell: renderDeleteButton,
      disableClickEventBubbling: true,
    },    {
      field: "jueves",
      headerName: "Jueves",
      width: 150,
      renderCell: renderDeleteButton,
      disableClickEventBubbling: true,
    },    {
      field: "viernes",
      headerName: "Viernes",
      width: 150,
      renderCell: renderDeleteButton,
      disableClickEventBubbling: true,
    },    {
      field: "sabado",
      headerName: "Sabado",
      width: 150,
      renderCell: renderDeleteButton,
      disableClickEventBubbling: true,
    },    {
      field: "domingo",
      headerName: "Domingo",
      width: 150,
      renderCell: renderDeleteButton,
      disableClickEventBubbling: true,
    },
  ];

  // Una fila por turno: la fila i tiene el i-ésimo horario (ordenado) de cada día.
  const rows = useMemo(() => {
    const horario = user.horario || {};
    const byDay = dias.map((dia) => [...(horario[dia] || [])].sort());
    const length = Math.max(0, ...byDay.map((hours) => hours.length));
    return Array.from({ length }, (_, i) => ({
      id: i,
      ...Object.fromEntries(dias.map((dia, j) => [dia, byDay[j][i] || ""])),
    }));
  }, [user.horario]);

  const deleteData = (toKill) => {
    const forSend = {
      [toKill.day]: (user.horario[toKill.day] || []).filter((hora) => hora !== toKill.value),
    };
    
    axios({
      method: "POST",
      url: `${API}/horarios`,
      data: {
        profesionalId: user.id,
        days: forSend,
      },
    }).then(() => {
      dispatch(getInfo(log));
    });
  } 

  const sendData = () => {
    let actDay = user.horario[turno.dia];
    actDay = actDay ? actDay : [];
    let forSend = {};
    const cleanStr =
      turno.horaInicio.toTimeString().substring(0, 5) +
      " - " +
      turno.horaFin.toTimeString().substring(0, 5);
    forSend[turno.dia] = [...actDay, cleanStr];
    axios({
      method: "POST",
      url: `${API}/horarios`,
      data: {
        profesionalId: user.id,
        days: forSend,
      },
    }).then(() => {
      dispatch(getInfo(log));
    });
  };

  return (
    <Box className={classes.box}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
        <Typography variant="h3">Set Horarios</Typography>
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            id="standard-select-currency"
            className={classes.label}
            inputProps={{ className: classes.input }}
            select
            label="Dia"
            value={turno.dia}
            onChange={(e) => {
              setTurno({ ...turno, dia: e.target.value });
            }}
          >
            {dias.map((dia, i) => (
              <MenuItem key={i} value={dia}>
                {dia.charAt(0).toUpperCase() + dia.slice(1)}
              </MenuItem>
            ))}
          </TextField>
          <KeyboardTimePicker
            margin="normal"
            id="time-picker"
            label="Horario de inicio"
            value={turno.horaInicio}
            onChange={(time) => {
              setTurno({ ...turno, horaInicio: time });
            }}
            KeyboardButtonProps={{
              "aria-label": "change time",
            }}
          />
          <KeyboardTimePicker
            margin="normal"
            id="time-picker2"
            label="Horario de finalizacion"
            value={turno.horaFin}
            onChange={(time) => {
              setTurno({ ...turno, horaFin: time });
            }}
            KeyboardButtonProps={{
              "aria-label": "change time",
            }}
          />
        </FormControl>
        <Button onClick={sendData}> Agregar Horario </Button>
      </MuiPickersUtilsProvider>
      <Typography variant="h6">Horarios</Typography>
      <Box>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            className={classes.grid}
            rows={rows}
            columns={columns}
            pageSize={20}
            disableSelectionOnClick
          />
        </div>
      </Box>
    </Box>
  );
}
