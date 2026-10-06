import { Box, Typography, makeStyles, } from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Citas from "./Citas/Citas";
import axios from "axios";
import { API } from "../../../../config";
const useStyle = makeStyles((theme) => ({
    text: {
      color: "#159DE9",
      marginLeft:"8vh"
    },
    box: {
      display: "flex",
      flexDirection: "column",
      borderRadius: "10px",
      color: "#159DE9",
    },
  }));

export default function Appointment({withoutTitle}){

    const classes = useStyle();
    const profesionalId = useSelector((store) => store.reducerLog.info.id);
    const [citas, setCitas] = useState([])
    const loadData = useCallback(async () => {
      if (!profesionalId) return;
      const res = await axios({
        method: 'POST',
        url: `${API}/cita`,
        data: { profesionalId, get: true }
      });
      setCitas(res.data);
    }, [profesionalId]);

    useEffect(() => { loadData() }, [loadData]);
    return(
        <Box className={classes.box}>
            {withoutTitle? null : <Typography className={classes.text} variant='h3'>Citas</Typography>}
            <Citas citas={citas} reLoad={loadData}/>
        </Box>
    )
}