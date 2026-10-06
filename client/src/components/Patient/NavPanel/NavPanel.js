import { Box, Button, makeStyles } from "@material-ui/core";
import { menu } from "../views";

const useStyle = makeStyles((theme) => ({
  magin: {
    margin: theme.spacing(2),
  },
  menuButton: {
    margin: theme.spacing(1),
    minWidth: "84px",
  },
  bar: {
    background: "white",
    borderRadius: "5px",
  },
  toolbar: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    "@media (max-width:600px)": {
      flexDirection: "column-reverse",
    },
  },
  text: {
    color: "#159DE9",
  },
  nav: {
    display: "flex",
  },
  boxActive: {
    backgroundColor: "rgb(232, 240, 254)",
    padding: "10px",
    paddingTop: "20px",
    paddingLeft: "50px",
    paddingRight: "50px",
    marginLeft: "0",
    marginRight: "10px",
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column",
    borderRadius: "10px",
    minHeight: "120vh",
    alignContent: "center",
    "@media (max-width:900px)": {
      borderTopLeftRadius: '0px',
      borderTopRightRadius: '10px',
      borderBottomLeftRadius: '10px',
      borderBottomRightRadius: '10px',
      position: 'absolute',
      left: '6px',
      zIndex: '2',
      transition: '1s ease all'
    },
  },
  box: {
    backgroundColor: "rgb(232, 240, 254)",
    padding: "10px",
    paddingTop: "20px",
    paddingLeft: "50px",
    paddingRight: "50px",
    marginLeft: "0",
    marginRight: "10px",
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column",
    borderRadius: "10px",
    minHeight: "80vh",
    alignContent: "center",
    "@media (max-width:900px)": {
      borderTopLeftRadius: '0px',
      borderTopRightRadius: '10px',
      borderBottomLeftRadius: '10px',
      borderBottomRightRadius: '10px',
      position: 'absolute',
      left: '-300px',
      zIndex: '2',
      transition: '1s ease all'
    },
  },
  btn: {
    marginTop: "25px",
    marginBottom: "25px",
    minWidth:"100px",
    minHeight:"60px"
  },
}));
// Muestra los botones del menú; la vista activa la maneja el dashboard.
export default function NavPanel({ onSelect, showMenu }) {
  const classes = useStyle();
  return (
    <Box className={showMenu ? classes.boxActive : classes.box}>
      {menu.map(({ key, label }) => (
        <Button key={key} className={classes.btn} onClick={() => onSelect(key)}>
          {label}
        </Button>
      ))}
    </Box>
  );
}
