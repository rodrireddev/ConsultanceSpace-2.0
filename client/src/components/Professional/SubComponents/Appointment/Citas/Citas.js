import {
  Box,
  makeStyles,
  Button,
} from "@material-ui/core";
import { useMemo, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
import DialogRequestButton from "../../../../Templates/DialogRequestButton";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { useDispatch, useSelector } from "react-redux";
import { setCita, setPatient } from "../../../../Log/actions";
import { useGoTo } from "../../../../Dashboard/ViewContext";
import { DAY_NAMES, formatDate } from "../../../../../utils/dates";
import { API } from "../../../../../config";

const sortModel = [{ field: "horario", sort: "asc" }];

const useStyle = makeStyles((theme) => ({
  text: {
    color: "#159DE9",
  },
  box: {
    padding: "10px",
    paddingLeft: "50px",
    paddingRight: "50px",
    display: "flex",
    flexDirection: "column",
    borderRadius: "10px",
    color: "#159DE9",
  },
  button: {
    color: "brown",
    borderColor: "brown",
  },
}));

export default function Citas({ citas, reLoad }) {
  const classes = useStyle();
  const user = useSelector((store) => store.reducerLog.info);
  const dispatch = useDispatch();
  const goTo = useGoTo();

  const [input, setInput] = useState({ date: new Date() });
  const handleInput = (e) => {
    setInput({
      date:e,
    });
  };

  // citas del día elegido; el formato de cita.date es "01/09/2021:16:00 - 17:00"
  const actCitas = useMemo(() => {
    const day = formatDate(input.date);
    return citas.filter((c) => c.date.substring(0, 10) === day);
  }, [input.date, citas]);
  const [actCita, setActCita] = useState({
    pacienteFullName: "",
    date: "",
    note: "",
  });

  const renderCompleteButton = (params) => {
    if(typeof params.id === 'string'){return "-"}
    return (
      <strong>
        <Button
          style={{ marginLeft: 16 }}
          onClick={() => {
            dispatch(setCita(actCitas.find((c)=>(c.id === params.id))));
            goTo("finalizarCita");
          }}
        >
          Completar
        </Button>
      </strong>
    );
  };

  // Busca al paciente de la cita y abre su historia clínica.
  const openFicha = async (cita) => {
    dispatch(setCita(cita));
    const res = await axios({
      method: "GET",
      url: `${API}/patients`,
      params: { nombre: cita.pacienteFullName },
    });
    dispatch(setPatient(res.data.find((p) => p.id === cita.pacienteId) || res.data[0]));
    goTo("historiaClinica");
  };

  const renderPatientButton = (params) => {
    if(typeof params.id === 'string'){return "-"}
    return (
      <strong>
        <Button
          size="small"
          style={{ marginLeft: 16 }}
          onClick={() => openFicha(actCitas.find((c) => c.id === params.id))}
        >
          Ficha
        </Button>
      </strong>
    );
  };



  const renderDeleteButton = (params) => {
    if(typeof params.id === 'string'){return "-"}
    const props = {
      styles: {
        color: "brown",
        borderColor: "brown",
      },
      title: <DeleteIcon />,
      buttonOk: "Eliminar",
      onClick: () => {
        setActCita(actCitas.find((c) => c.id === params.id));
      },
      req: sendData,
      quest: `Desea eliminar ${actCita.note} con ${actCita.pacienteFullName} agendada para el ${actCita.date.substring(0,10)} en el horario ${actCita.date.substring(11,24)}`,
      msgOk: "Cita eliminada",
      msgFalse: "Error",
      redirect: reLoad,
    };
    return (
      <strong>
        <DialogRequestButton props={props} />
      </strong>
    );
  };

  const columns = [
    { field: "horario", headerName: "Horario", width: 170 },
    { field: "pacienteName", headerName: "Paciente", width: 170 },
    { field: "note", headerName: "Motivo", width: 170 },
    {
      field: "b1",
      headerName: "Ver paciente",
      width: 150,
      renderCell: renderPatientButton,
      disableClickEventBubbling: true,
    },
    {
      field: "b2",
      headerName: "Completar cita",
      width: 150,
      renderCell: renderCompleteButton,
      disableClickEventBubbling: true,
    },
    {
      field: "b3",
      headerName: "Eliminar",
      width: 150,
      renderCell: renderDeleteButton,
      disableClickEventBubbling: true,
    },
  ];

  const sendMail = ( patientName, idPatient, professionalName, date) => {
    return axios({
      method: "POST",
      url: `${API}/sendEmail`,
      data:{
        profesional: true,
        idPatient: idPatient,
        subject: "Cita cancelada por: " + professionalName,
        text: "Hola " + patientName + ", " + professionalName + " ha cancelado la cita para la fecha " + date.substring(0,10) +
        " en el horario " +
        date.substring(11,26)
      }
    })
  }

  const sendData = () => {
    return axios({
      method: "DELETE",
      url: `${API}/cita`,
      data: {
        id: actCita.id,
      },
    }).then((res) => {
      if (res.status === 200) {
      sendMail(actCita.pacienteFullName, actCita.pacienteId, user.fullName, actCita.date )};
      return res.status === 200 ? true : false;
    });
  };
  const rows = useMemo(() => {
    const horas = (user.horario && user.horario[DAY_NAMES[input.date.getDay()]]) || [];
    const taken = actCitas.map((cita) => cita.date.substring(11, 26));
    const free = horas.filter((hora) => !taken.includes(hora));
    return [
      ...free.map((hora, i) => ({
        id: "F" + i,
        horario: hora + " (LIBRE)",
        pacienteName: "-",
        note: "-",
      })),
      ...actCitas.map((c) => ({
        id: c.id,
        horario: c.date.substring(11, 26),
        pacienteName: c.pacienteFullName,
        note: c.note,
      })),
    ];
  }, [user.horario, input.date, actCitas]);

  // forGrid
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <Box className={classes.box}>
      <form className={classes.container} noValidate>
      <KeyboardDatePicker
              name="date"
              margin="normal"
              id="date-picker-dialog"
              label="Dia"
              format="MM/dd/yyyy"
              value={input.date}
              onChange={handleInput}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
      </form>
      <Box>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            className={classes.grid}
            sortModel={sortModel}
            rows={rows}
            columns={columns}
            pageSize={20}
            disableSelectionOnClick
          />
        </div>
      </Box>
    </Box>
    </MuiPickersUtilsProvider>
  );
}
