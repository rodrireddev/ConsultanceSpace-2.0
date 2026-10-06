import es from "date-fns/locale/es";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { getAppointment, getProfessional } from "../../actions";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import {
  Container,
  makeStyles,
  Typography,
  TextField,
} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import DialogRequestButton from "../../../Templates/DialogRequestButton";
import { API } from "../../../../config";
import { DAY_NAMES, formatDate } from "../../../../utils/dates";

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: "5%",
    marginTop: "2%",
  },
  titleh4: {
    textAlign: "center",
  },

  button: {
    margin: theme.spacing(1),
  },
  label: {
    display: "inline-flex",
    padding: "0",
    position: "relative",
    minWidth: "0",
    verticalAlign: "top",
    flexDirection: "row",
    marginBottom: "8px",
    width: "100px",
  },
  title: {
    top: "10px",
  },
  input: {
    width: "100px",
  },
  selectHorario: {
    width: "150px",
  },
}));

export default function NewAppointment() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const professionals = useSelector(
    (store) => store.reducerPatient.professionals
  );
  const user = useSelector((store) => store.reducerLog.info);
  const appointment = useSelector((store) => store.reducerPatient.appointment);
  const pacienteId = user.id;
  const [professionalId, setProf] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHorario, setSelectedHorario] = useState("");
  // Horas libres del profesional elegido ese día (null mientras se consulta)
  const [horarios, setHorarios] = useState(null);
  const [note, setNote] = useState("");

  const professionalList = professionals.profesionals;
  const professional =
    professionalList && professionalList.find((p) => p.id === professionalId);
  const patientName = professionals.fullName;
  const loading = Boolean(professionalId) && horarios === null;

  // Se vuelve a consultar al cambiar profesional o fecha, y cuando se agenda una cita (appointment).
  useEffect(() => {
    setHorarios(null);
    setSelectedHorario("");
    if (!professionalId) return undefined;

    let cancelled = false;
    axios({
      method: "get",
      url: `${API}/horarios`,
      params: {
        day: DAY_NAMES[selectedDate.getDay()],
        profesionalId: professionalId,
        date: formatDate(selectedDate),
      },
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
  }, [professionalId, selectedDate, appointment]);

  const handleProfessionalChange = (e) => {
    setProf(e.target.value);
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleSubmit = () => {
    if (professionalId && selectedDate && note && selectedHorario && !loading) {
      return false;
    }
    return true;
  };
  useEffect(() => {
    if (pacienteId) dispatch(getProfessional(pacienteId));
  }, [dispatch, pacienteId]);

  const reLoad = () => {
    dispatch(getAppointment(pacienteId, true));
    sendMail();
  };
  const createAppointment = (profesionalId, pacienteId, date, note) => {
    return axios({
      method: "POST",
      url: `${API}/cita`,
      data: {
        profesionalId: profesionalId,
        pacienteId: pacienteId,
        date: date,
        note: note,
      },
    }).then((res) => (res.status === 200 ? true : false));
  };

  const sendMail = () => {
    return axios({
      method: "POST",
      url: `${API}/sendEmail`,
      data: {
        paciente: true,
        professional: professional && professional.usuarioEmail,
        subject: "Cita agendada por: " + patientName,
        text:
          "Hola " +
          (professional && professional.fullName) +
          "," +
          patientName +
          " ha agendado una cita para la fecha " +
          formatDate(selectedDate) +
          " a las " +
          selectedHorario +
          "hs",
      },
    });
  };

  const agendarButton = () => {
    const dateStr =
      formatDate(selectedDate) + " a las " + selectedHorario + "hs";
    const props = {
      title: "Agendar",
      buttonOk: "Agendar",
      onClick: () => {},
      disabled: handleSubmit(),
      req: () => {
        return createAppointment(
          professionalId,
          pacienteId,
          formatDate(selectedDate) + ":" + selectedHorario,
          note
        );
      },
      quest: `Desea agendar ${note} con ${professional ? professional.fullName : ""} para el ${dateStr}`,
      msgOk: "Cita Creada",
      msgFalse: "Error",
      redirect: reLoad,
    };
    return <DialogRequestButton props={props} />;
  };

  const HorarioSelect = () => {
    if (!professional || !horarios) return [];
    const disponibles = (professional.horario && professional.horario[DAY_NAMES[selectedDate.getDay()]]) || [];
    return disponibles.map((hora) => (
      <MenuItem key={hora} value={hora} disabled={!horarios.includes(hora)}>
        {`${hora}${horarios.includes(hora) ? "" : " (YA RESERVADO)"}`}
      </MenuItem>
    ));
  };

  return (
    <div>
      <Container className={classes.container}>
        <Typography variant="h5" component="h5" className={classes.titleh4}>
          Agendar una cita
        </Typography>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
          <Grid container justifyContent="space-around">
            <KeyboardDatePicker
              minDate={new Date()}
              margin="normal"
              id="date-picker-dialog"
              label="Elegir Fecha"
              format="dd/MMMM/yyyy"
              value={selectedDate}
              onChange={setSelectedDate}
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
            <TextField
              id="standard-basic"
              className={classes.label}
              inputProps={{ className: classes.input }}
              label="Motivo"
              value={note}
              onChange={handleNoteChange}
            />
            <TextField
              id="standard-select-currency"
              className={classes.label}
              inputProps={{ className: classes.input }}
              select
              label="Médico"
              value={professionalId}
              onChange={handleProfessionalChange}
            >
              {professionals.profesionals &&
                professionals.profesionals
                  .filter((option) => !option.profesionalPaciente.disable)
                  .map((pro) => (
                    <MenuItem key={pro.id} value={pro.id}>
                      {pro.fullName}
                    </MenuItem>
                  ))}
            </TextField>
            {agendarButton()}
          </Grid>
        </MuiPickersUtilsProvider>
      </Container>
    </div>
  );
}
