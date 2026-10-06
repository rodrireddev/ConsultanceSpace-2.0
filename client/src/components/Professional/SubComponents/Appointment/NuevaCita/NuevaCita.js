import {
  Box,
  Typography,
  makeStyles,
  TextField,
  FormControl,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  MenuItem
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Appointment from "../Appointment";
import { useGoTo } from "../../../../Dashboard/ViewContext";
import { DAY_NAMES, formatDate } from "../../../../../utils/dates";
import { API } from "../../../../../config";

const useStyle = makeStyles((theme) => ({
  text: {
    color: "#159DE9",
  },
  box: {
    display: "flex",
    flexDirection: "column",
    borderRadius: "10px",
    color: "#159DE9",
    paddingLeft: '30px',
    paddingRight: '0',
  },
  componentContainer: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "200px",
    paddingTop: "20px",
  },
  appDate: {
    display: "flex",
  },
  app: {
    width: "100%",
  },
  labelTextField: {
    margin: "10px",
  },
  button: {
    marginTop: "10px",
  },
}));

export default function NuevaCita() {
  const classes = useStyle();
  const user = useSelector((store) => store.reducerLog.info);
  const patient = useSelector((store) => store.reducerLog.actPatient);
  const goTo = useGoTo();
  const [date, setDate] = useState(new Date());
  const [motivo, setMotivo] = useState("Consulta");
  const [open, setOpen] = useState(false);
  const [finalMsg, setFinalMsg] = useState("");
  const [selectedHorario, setSelectedHorario] = useState("");
  // Horas libres del profesional para la fecha elegida (null mientras se consulta)
  const [horarios, setHorarios] = useState(null);

  const validDate = date && !Number.isNaN(date.getTime());
  const day = validDate ? DAY_NAMES[date.getDay()] : null;

  useEffect(() => {
    setHorarios(null);
    setSelectedHorario("");
    if (!user.id || !validDate) return undefined;

    let cancelled = false;
    axios({
      method: "get",
      url: `${API}/horarios`,
      params: { day, profesionalId: user.id, date: formatDate(date) },
    })
      .then((response) => {
        if (!cancelled) setHorarios(response.data);
      })
      .catch(() => {
        if (!cancelled) setHorarios([]);
      });
    return () => {
      cancelled = true;
    };
  }, [user.id, day, date, validDate]);

  const HorarioSelect = () => {
    if (!horarios) return [];
    const disponibles = (user.horario && user.horario[day]) || [];
    return disponibles.map((hora) => (
      <MenuItem key={hora} value={hora} disabled={!horarios.includes(hora)}>
        {`${hora}${horarios.includes(hora) ? "" : " (YA RESERVADO)"}`}
      </MenuItem>
    ));
  };

  const sendMail = () =>
    axios({
      method: "POST",
      url: `${API}/sendEmail`,
      data: {
        profesional: true,
        patient: patient.usuarioEmail,
        subject: "Cita agendada por: " + user.fullName,
        text:
          "Hola " + patient.fullName + ", " + user.fullName +
          " ha agendado una cita para la fecha " + formatDate(date) +
          " en el horario " + selectedHorario,
      },
    });

  const sendData = () => {
    setOpen(false);
    axios({
      method: "POST",
      url: `${API}/cita`,
      data: {
        profesionalId: user.id,
        pacienteId: patient.id,
        date: formatDate(date) + ":" + selectedHorario,
        note: motivo,
      },
    })
      .then(() => {
        setFinalMsg("Cita creada");
        sendMail().catch(() => {});
      })
      .catch(() => setFinalMsg("Error"));
  };

  const handleMotivo = (e) => {
    if (e.target.value.length < 10) setMotivo(e.target.value);
  };

  const handleSubmit = () => {
    if (selectedHorario) setOpen(true);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Box className={classes.box}>
        <Typography variant="h3">Nueva Cita</Typography>
        <Box className={classes.appDate}>
          <Box className={classes.componentContainer}>
            <FormControl className={classes.form}>
              <TextField
                label="Paciente"
                id="name"
                className={classes.textField}
                variant="outlined"
                InputProps={{ className: classes.labelTextField }}
                name="name"
                onChange={(event) => {}}
                value={patient.fullName}
                autoComplete="off"
                disabled={true}
              />
              <TextField
                label="Motivo"
                id="name"
                className={classes.textField}
                variant="outlined"
                InputProps={{ className: classes.labelTextField }}
                name="name"
                onChange={(e) => {
                  handleMotivo(e);
                }}
                value={motivo}
                autoComplete="off"
              />
            </FormControl>
            <KeyboardDatePicker
              minDate={new Date()}
              name="date"
              margin="normal"
              id="date-picker-dialog"
              label="Dia"
              format="MM/dd/yyyy"
              value={date}
              onChange={setDate}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <TextField
              margin="normal"
              id="time-picker"
              label="Elegir Horario"
              className={classes.selectHorario}
              select
              value={selectedHorario}
              onChange={(e) => setSelectedHorario(e.target.value)}
            >
              {HorarioSelect()}
            </TextField>
            <Button onClick={handleSubmit} className={classes.button}>
              {" "}
              Crear cita
            </Button>
          </Box>
          <Box className={classes.app}>
            <Appointment withoutTitle={true} />
          </Box>
        </Box>
        <Dialog
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: {
              backgroundColor: "white",
              color: "#159DE9",
            },
          }}
        >
          <DialogTitle id="alert-dialog-title">{`¿Desea agendar ${motivo} con ${
            patient.fullName
          } el ${formatDate(date)} en el horario ${selectedHorario}?`}</DialogTitle>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
              }}
              color="secondary"
            >
              Cancelar
            </Button>
            <Button onClick={sendData} color="primary" autoFocus>
              Crear
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={finalMsg.length > 0}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: {
              backgroundColor: "white",
              color: "#159DE9",
            },
          }}
        >
          <DialogTitle id="alert-dialog-title">{`${finalMsg}`}</DialogTitle>
          <DialogActions>
            <Button
              onClick={() => {
                setFinalMsg("");
                goTo("citas");
              }}
              color="primary"
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MuiPickersUtilsProvider>
  );
}
