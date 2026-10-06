import { Box, Typography, makeStyles, Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPatient } from "../../../Log/actions";
import { useGoTo } from "../../../Dashboard/ViewContext";
import { getMyPatients } from "../../actions";
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
  grid: {
    color: "black",
  },
  container1: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
}));

export default function MyPatients() {
  const classes = useStyle();
  const patients = useSelector(
    (store) => store.reducerAddPatients.MyPatientsList
  );
  const reset = useSelector((store) => store.reducerAddPatients.reset);
  const user = useSelector((store) => store.reducerLog.user);
  const info = useSelector((store) => store.reducerLog.info);
  const dispatch = useDispatch();
  const goTo = useGoTo();
  const [select, setSelect] = useState([]);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    if (user.tipo_usuario === "profesional") dispatch(getMyPatients(user.email));
  }, [dispatch, user.tipo_usuario, user.email, reset]);

  const openPatient = (id, view) => {
    dispatch(setPatient(patients.find((p) => p.id === id)));
    goTo(view);
  };

  //button for columns
  const renderPatientButton = (params) => {
    return (
      <strong>
        <Button
          size="small"
          style={{ marginLeft: 16 }}
          disabled={disable}
          onClick={() => openPatient(params.id, "agendarCita")}
        >
          Reservar
        </Button>
      </strong>
    );
  };

  const renderPatientHistory = (params) => {
    return (
      <strong>
        <Button
          size="small"
          style={{ marginLeft: 16 }}
          disabled={disable}
          onClick={() => openPatient(params.id, "historiaClinica")}
        >
          Ver
        </Button>
      </strong>
    );
  };

  const columns = [
    {
      field: "b1",
      headerName: "Hacer Cita",
      width: 150,
      renderCell: renderPatientButton,
      disableClickEventBubbling: true,
    },
    {
      field: "b2",
      headerName: "Historia Clinica",
      width: 150,
      renderCell: renderPatientHistory,
      disableClickEventBubbling: true,
    },
    { field: "dni", headerName: "Cedula", width: 120 },
    {
      field: "name",
      headerName: "Nombre",
      width: 150,
      editable: true,
    },
    {
      field: "lastName",
      headerName: "Apellido",
      width: 150,
      editable: true,
    },
    {
      field: "phone",
      headerName: "Telefono",
      width: 150,
      editable: true,
    },
    {
      field: "birth",
      headerName: "Fecha de nacimiento",
      type: "date",
      width: 150,
      editable: true,
    },
    {
      field: "address",
      headerName: "Direccion",
      width: 150,
      editable: true,
    },
    {
      field: "country",
      headerName: "Pais",
      width: 150,
      editable: true,
    },
    {
      field: "email",
      headerName: "Correo electronico",
      width: 150,
      editable: true,
    },
  ];

  // const rows = [];
  const rows =
    patients &&
    patients
      .filter((p) => p.profesionalPaciente.disable === disable)
      .map((patient) => {
        return {
          id: patient.id,
          dni: patient.cedula,
          name: patient.nombre,
          lastName: patient.apellidos,
          phone: patient.telefono,
          birth: patient.fecha_de_nacimiento.substring(0, 10),
          address: patient.direccion,
          country: patient.pais,
          email: patient.usuarioEmail,
        };
      });

  const handleDelete = async (e) => {
    e.preventDefault();
    const data = {
      profesionalId: info.id,
      pacienteIds: select,
      disable: !disable,
    };
    axios({
      method: "POST",
      url: `${API}/disablePatients`,
      data: data,
    }).then(()=>{
    dispatch(getMyPatients(user.email));
    setDisable(!disable);
    setSelect([]);})
  };

  return (
    <Box className={classes.box}>
      <Typography variant="h3" color="blue">
        Mis Pacientes
      </Typography>
      <Box className={classes.container1}>
        <Box style={{display:"flex", alignItems:"flex-end"}}>
          <Typography variant="body1" color="blue">
            {disable
              ? "Usted esta viendo sus pacientes bloqueados"
              : "Usted esta viendo sus pacientes habilitados"}
          </Typography>
        </Box>{" "}
        <Button
          onClick={() => {
            setDisable(!disable);
          }}
          style={{ backgroundColor: disable ? "#159DE9" : "red" }}
        >
          {disable ? "Ver pacientes Habilitados" : "Ver pacientes Bloqueados"}
        </Button>
      </Box>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          className={classes.grid}
          rows={rows}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={(items) => setSelect(items)}
        />
      </div>
      {select.length > 0 && (
        <Box className={classes.btnBox}>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            onClick={handleDelete}
            style={{ backgroundColor: disable ? "green" : "red" , marginTop:"10px"}}
          >
            {disable ? "HABILITAR PACIENTES" : "BLOQUEAR PACIENTES"}
          </Button>
        </Box>
      )}
    </Box>
  );
}
