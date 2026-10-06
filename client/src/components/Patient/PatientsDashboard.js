import {Container, Box, makeStyles } from "@material-ui/core";
import NavPanel from "./NavPanel/NavPanel";
import React, { Suspense, useState } from 'react'
import { useSelector } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import { views } from "./views";
import useProfileInfo from "../Dashboard/useProfileInfo";
import Loading from "../Dashboard/Loading";
import { ViewProvider } from "../Dashboard/ViewContext";
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
    container:{
        marginTop: theme.spacing(9),
        "@media (max-width: 600px)":{
            marginTop: '110px'
        }
    },
    text:{
        color:"#159DE9",
    },
    nav:{
        display:'flex'
    },
    icon:{
        display: 'none',
        "@media (max-width:900px)": {
            color: "#159DE9",
            margin: '0',
            padding: "0 10px 0px 10px",
            display: 'flex',
            justifyContent: 'flexStart',
            position: 'relative'
        },
    },
    iconActive:{
        display: 'none',
        "@media (max-width:900px)": {
            color: "#159DE9",
            background: 'rgb(232, 240, 254)',
            margin: '0',
            padding: "0 10px 0px 10px",
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            display: 'flex',
            position: 'relative',
            justifyContent: 'flexStart',
            width: '50px',
            transition: '3s ease all'
        },
    },
    box:{
        marginBottom:theme.spacing(8),
        display:'flex',
        flexDirection:'row'
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
        display:"flex",
        padding: '10px',
        //background: 'green',
        margin: '10px ',
        justifyContent:"flex-end",
        marginRight:"40vh",
        marginLeft:"40vh",
        "@media (max-width:900px)": {
            marginRight:"10vh",
            marginLeft:"10vh"
    }
}

}))


export default function PatientsDashboard(){
    const classes=useStyle();
    useProfileInfo();
    const [view, setView] = useState("welcome");
    const [showMenu, setShowMenu] = useState(false);
    const userInfo = useSelector((store) => store.reducerLog.info);
    const [editprofile, setEditProfile] = useState(false);
    const View = views[view];

    const goTo = (key) => {
        setView(key);
        setShowMenu(false);
    };

    function handleEdit() {
        setEditProfile(!editprofile)
    }
    return(
        <ViewProvider value={{ goTo }}>
        <Container className ={classes.container} >
            <Box className= { showMenu? classes.iconActive : classes.icon }>
                        {
                            showMenu ? 
                                <CloseIcon onClick ={() => setShowMenu(!showMenu)}/> 
                                : 
                                <MenuIcon onClick ={() => setShowMenu(!showMenu)}/>
                        }
            </Box>
            <Box className={classes.alert}>
                {
                    userInfo.estado_civil && userInfo.genero ? 
                    null 
                        : 
                    (<>
                        <Alert  severity="warning">
                            Por favor configure su estado civil y su genero en la sección Mi Perfil <button type="button" className={classes.link} onClick={handleEdit}>Aquí</button>
                        </Alert>
                        {editprofile && <Profile handleEdit={handleEdit}/>}
                    </>)
                }
            </Box>
            <Box className={classes.box}>
                <NavPanel onSelect={goTo} showMenu={showMenu}/>
                <Box width="100%">
                    <Suspense fallback={<Loading />}>
                        <View />
                    </Suspense>
                </Box>
            </Box>
        </Container>
        </ViewProvider>
    )
}
