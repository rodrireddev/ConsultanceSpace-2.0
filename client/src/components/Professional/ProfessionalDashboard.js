import { Box, Container, makeStyles,Typography } from "@material-ui/core";
import NavPanel from "./NavPanel/NavPanel";
import React, { Suspense, useState } from 'react'
import { useSelector } from "react-redux";
import { views } from "./views";
import useProfileInfo from "../Dashboard/useProfileInfo";
import Loading from "../Dashboard/Loading";
import { ViewProvider } from "../Dashboard/ViewContext";
import { isExpired } from "../../utils/dates";
import Alert from "@material-ui/lab/Alert";
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import Profile from '../Header/Buttons/Profile';


const useStyle=makeStyles(theme=>({
    menu:{
        margin: theme.spacing(1),
        minWidth:'84px'
    },
    bar:{
        background:"white",
        borderRadius:"5px"
    },
    toolbar:{
        flexDirection:'row-reverse',
        justifyContent:'space-between',
        '@media (max-width:600px)':{
        flexDirection:'column-reverse'
    }
    },
    text:{
        color:"#159DE9",
    },
    nav:{
        display:'flex'
    },
    container:{
        marginTop:theme.spacing(9),
        display: 'flex',
        zIndex: '3',
        // background: 'green',
        padding: "0",
        "@media (max-width:600px)": {
            marginTop: '110px'
        },
        "@media (max-width:360px)": {
            marginTop: '120px'
        },
    },
    iconActive:{
        display: 'none',
        "@media (max-width:900px)": {
            color: "#159DE9",
            background: 'rgb(232, 240, 254)',
            margin: '0',
            padding: "0 10px 2px 10px",
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            display: 'flex',
            justifyContent: 'flexStart',
            position: 'absolute',
            cursor: 'pointer',
            width: '50px',
            transition: '3s ease all'
        },
    },
    icon:{
        display: 'none',
        "@media (max-width:900px)": {
            color: "#159DE9",
            margin: '0',
            padding: "0 10px 2px 10px",
            display: 'flex',
            justifyContent: 'flexStart',
            position: 'absolute',
            cursor: 'pointer',
            transition: '1s ease all'
        },
    },
    box:{
        marginTop:theme.spacing(1),
        marginBottom:theme.spacing(8),
        display:'flex',
        //background: 'red',
        paddingRight: '0',
        paddingLeft: '0px',
        flexDirection:'column',
        flex: '3',
        
    },
    banner:{
        display: 'flex',
        //background: 'green',
        margin: '0'
    },
    title:{
        width: '100%',
        textAlign: 'center',
        color:"#159DE9",
        fontFamily:"lato",
        fontSize:"25px",
    },
    field:{
        padding: '0'
    },
    link:{
        background:'none',
        border:'none',
        padding:0,
        color:'inherit',
        textDecoration:'underline',
        cursor:'pointer',
        font:'inherit',
    },
    alert:{
        margin:"10px",
        minWidth:"200px",
        borderRadius:"5px"
    }
    
    
}))


export default function Dashboard(){
    const classes=useStyle();
    useProfileInfo();
    const [view, setView] = useState("welcome");
    const [showMenu, setShowMenu] = useState(false);
    const [editprofile, setEditProfile] = useState(false);
    const info = useSelector((store) => store.reducerLog.info);

    // Con la suscripción vencida solo se puede ver la pantalla de suscripción.
    const blocked = Boolean(info.subscripcion && isExpired(info.subscripcion));
    const View = views[blocked ? "suscripcion" : view];

    const goTo = (key) => {
        setView(key);
        setShowMenu(false);
    };

    function handleEdit() {
        setEditProfile(!editprofile)
    }

    const especialidad = info.especialidads;
    return(
        <ViewProvider value={{ goTo }}>
        <Container className ={classes.container}>
            <NavPanel onSelect={goTo} showMenu={showMenu} blocked={blocked}/>
            <Box className={classes.box}>
                <Box className = {classes.banner}>
                    <Box className={showMenu? classes.iconActive : classes.icon}>
                        {
                            showMenu ? 
                                <CloseIcon onClick ={() => setShowMenu(!showMenu)}/> 
                                : 
                                <MenuIcon onClick ={() => setShowMenu(!showMenu)}/>
                        }
                    </Box>
                    <Box className={classes.title}>
                    {especialidad&&especialidad.length>0
                    ? especialidad.map((spect) => spect.nombre).join(" ")
                    :
                    <>
                        <Alert className={classes.alert} severity="warning">
                            <Typography className={classes.text}>
                                Por favor configure su especialidad en la sección Mi Perfil para que los pacientes puedan buscarlo por su especialidad <button type="button" className={classes.link} onClick={handleEdit}>Aquí</button>
                            </Typography>
                        </Alert>
                        {editprofile && <Profile handleEdit={handleEdit}/>}
                    </>}
                    {!info.mpLinked&&
                        <Alert className={classes.alert}  severity="warning">
                             <Typography className={classes.text}>
                                Por favor configure su sistema de pagos en configuración <button type="button" className={classes.link} onClick={() => goTo("configuracion")}>Aquí</button>
                            </Typography>
                        </Alert>}
                    </Box>
                    
                </Box>
                <Box className ={classes.field}>
                    <Suspense fallback={<Loading />}>
                        <View />
                    </Suspense>
                </Box>
            </Box>
        </Container>
        </ViewProvider>
    )
}
