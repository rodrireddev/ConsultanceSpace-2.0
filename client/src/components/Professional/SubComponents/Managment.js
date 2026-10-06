import 'date-fns';
import es from "date-fns/locale/es";
import { Box, Typography, makeStyles, Grid, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAppointment } from "../actions";
import { DataGrid } from '@material-ui/data-grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const useStyle = makeStyles((theme) => ({
  title:{
    color: "#159DE9",
    marginTop:"5%"

  },
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
    "@media (max-width : 500px)": {
      width: "100%",
    },
  },
  label:{
    color: "#000000 !important  "
  }
}));

export default function Managment() {
  const classes = useStyle();

  const dispatch = useDispatch()
  const [initialDate, setInitialDate] = useState(new Date())
  const [finalDate, setFinalDate] = useState(new Date())
  const profesionalId = useSelector((state)=> state.reducerLog.info)
  const earnings = useSelector(state=> state.reducerSearchPatients.earnings)
  const get = true;

  const dateLinda = (date) => {
    const dateStr = date.toString().substr(0, 21);
    let month = date.getMonth() + 1;
    month = month > 9 ? month.toString() : "0" + month.toString();
    return (
      dateStr.substring(8, 10) + "/" + month + "/" + dateStr.substring(11, 15)
    );
  };
  

const sumarDias = (date) =>{
  var dateOffset = (24*60*60*1000) * 7; 
  var myDate = new Date(date);
  myDate.setTime(myDate.getTime() + dateOffset);
  return myDate;
}


  const handleDateChange = (date) => {
    setInitialDate(date)
    setFinalDate(sumarDias(date))
  }
 
 
  const data = [

    {name: "lunes",
    ingresos: 0},
    {name: "martes",
    ingresos: 0},
    {name: "miercoles",
    ingresos: 0},
    {name: "jueves",
    ingresos: 0},
    {name: "viernes",
    ingresos: 0},
    {name: "sabado",
    ingresos: 0},
    {name: "domingo",
    ingresos: 0}

  ];

  const dias = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
  ];


  useEffect(() => {
    dispatch(getAppointment(profesionalId.id, get ))
  }, [profesionalId.id, get, dispatch]);

  const weeklyEarnings = (name, ingresos)=>{
    let index = data.findIndex(data => data.name === name)
    if(index === -1) {
      data.push({name, ingresos, amt:ingresos*2})
    }
    else{
     data[index].ingresos = data[index].ingresos+ingresos
    }
  }

  function disableWeek(date) {
    return date.getDay() === 0 ||  date.getDay() === 2  || date.getDay() === 3  || date.getDay() === 4  || date.getDay() === 5  || date.getDay() === 6 ;
  }

  earnings && earnings.map(elemento =>{
    const day = elemento.date.substring(0,2);
    const month = elemento.date.substring(3,5);
    const year = elemento.date.substring(6,10);
    let date = dias[new Date(`${month} ${day}, ${year}`).getDay()]
    let ingresos = elemento.tratamientos.reduce((acc,cv)=>(acc + cv.price),0);
    const dates = new Date (month + "/" +  day  + "/" +  year)
    dates.setHours(0,0,0,0);
    initialDate.setHours(0,0,0,0);
    finalDate.setHours(0,0,0,0); 
      return (
        dates>=initialDate && dates<finalDate ?
      weeklyEarnings(date, ingresos)  : console.log("no hay registro")
      )
  })




  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'fullName',
      headerName: 'Nombre completo',
      width: 190,
      editable: true,
    },
    {
      field: 'dateOfPay',
      headerName: 'Fecha de pago',
      type: 'date',
      width: 180,
      editable: true,
    },
    {
      field: 'treatment',
      headerName: 'Tratamiento',
      width: 160,
    },
    {
      field: 'paymentValue',
      headerName: 'Valor de pago',
      width: 180,
    }
  ];
  

    const rows = [];
    earnings  &&
    earnings.forEach((cita) => {
      const day = cita.date.substring(0,2);
      const month = cita.date.substring(3,5);
      const year = cita.date.substring(6,10);
      const dates = new Date (month + "/" +  day  + "/" +  year)
      dates.setHours(0,0,0,0);
      initialDate.setHours(0,0,0,0);
      finalDate.setHours(0,0,0,0);
      if( cita.tratamientos.length>0 && dates>=initialDate && dates<finalDate  ){
        let array = {
          id: cita.id,
          fullName: cita.pacienteFullName,
          lastName:  cita.note,
          dateOfPay: cita.date.substring(0,10),
          treatment: cita.tratamientos ? cita.tratamientos.map((elemento)=>{ return elemento.treatmentName }) : "",
          paymentValue: cita.tratamientos ? cita.tratamientos.map((elemento)=>{ return elemento.price }) : "",
        }
        rows.push(array);
      }

    });

    

  return (
    <>
    <Box>
    <Typography variant="h4" className={classes.title}>
        Ingresos Diarios
      </Typography>
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
      <Grid container justifyContent="space-around" alignItems= "center">
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="dd/MMMM/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Fecha inicial"
          value={initialDate}
          onChange={handleDateChange}
          helperText = "Selecciona un inicio de semana"
          hintText="Solo elegir inicio de semana" shouldDisableDate={disableWeek}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
         <TextField disabled  inputProps={{ className: classes.label }} label="Fecha final" value={dateLinda(finalDate)} />
        </Grid>
        </MuiPickersUtilsProvider>
    </Box>
    <ResponsiveContainer width="95%" height="30%">
      <BarChart  margin={{ top: 5, right: 30, left: 20, bottom: 5 }} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="ingresos" fill="#2196f3" />
      </BarChart>
      </ResponsiveContainer>
    <div style={{ height: 400, width: '90%', marginLeft:"5%"}}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
      />
    </div>

    </>
  );
}
