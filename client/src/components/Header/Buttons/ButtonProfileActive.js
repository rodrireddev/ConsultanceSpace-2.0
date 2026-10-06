import { Button, Box } from '@material-ui/core/'
import { makeStyles } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { useUser } from "reactfire";
import Profile from './Profile';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import ButtonLogout from './ButtonLogout';
import useProfileInfo from '../../Dashboard/useProfileInfo';
import notpick from './notpick.png'
const useStyle = makeStyles(theme => ({
    btn: {
        margin: theme.spacing(1),
        minWidth: '84px'
    },
    head: {

        backgroundColor: blue[500],
        margin: "5px"

    },
    menu: {
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        right: "0px",
        top: "85px",
        minWidth: "190px",
        maxWidth: "190px",
        padding: "10px",
        marginLeft: "15px",
        marginRight: "15px",
        backgroundColor: "rgb(232, 240, 254)",
        borderRadius: "10px",
        transitionDuration: "3s",
        "@media (max-width:900px)": {
            top:"110px",
        }

    },
    pick: {
        height: "90px",
        width: "90px",
        borderRadius: "50%"
    },
    text: {
        padding: "1px",
        fontSize: "10px"
    }
}))
export default function ButtonProfileActive({ onClick, setProfile }) {
    const [editprofile, setEditProfile] = useState(false);
    const info = useSelector(state => state.reducerLog.info)
    const classes = useStyle();
    useProfileInfo();
    const user = useUser();
    
    function handleEdit() {
        setEditProfile(!editprofile)
    }

    function checkpick() {
        if (user.data) {
            if (user.data.photoURL) return user.data.photoURL
            else return notpick
        }
    }
    
    return (
        <>
            <Button onClick={(event) => onClick(event)} type="button" variant='contained' className={classes.btn} >
                Mi Perfil
            </Button>
            <Box className={classes.menu}>
                <Button className={classes.head}>
                    <img className={classes.pick} src={checkpick()} alt="desconocido"></img>
                </Button>
                <Button className={classes.head}>
                    {info && info.fullName}
                </Button>
                <Button className={classes.head}>
                    <div className={classes.text}>
                        {user.data && user.data.email}
                    </div>
                </Button>
                <Button className={classes.head} onClick={() => handleEdit()}>
                    <div className={classes.text}>
                        {editprofile ? "Cerrar" : "Editar"}
                    </div>
                </Button>
                {editprofile && <Profile handleEdit={handleEdit}/>}
                <ButtonLogout setProfile={setProfile} ></ButtonLogout>
            </Box>
        </>
    )
}