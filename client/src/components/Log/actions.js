import axios from "axios";
import { API } from "../../config";

export const POST_LOG = 'POST_LOG';
export const INFO_USER = 'INFO_USER';
export const DESLOG = 'DESLOG';
export const SET_PATIENT = 'SET_PATIENT';
export const SET_CITA = 'ACT_CITA';



export const postLogIn = (email)=>{
    return async (dispatch) => {
    const res = await axios({
            method: 'POST',
            url: `${API}/login`,
            data: {email}
        })
    dispatch({ type: POST_LOG, payload:  res.data })
}}

export const getInfo = (user)=>{
    return async (dispatch) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${API}/info`,
            data: user
        })
        dispatch({ type: INFO_USER, payload:  res.data })
    } catch (error) {
        console.error('No se pudo cargar el perfil:', error.message)
    }
}}

export const setPatient=(patient)=>(dispatch)=>{
    dispatch({ type: SET_PATIENT, payload:patient})
}

export const desLog=()=>(dispatch)=>{
    dispatch({ type: DESLOG})
}

export const setCita=(cita)=>(dispatch)=>{
    dispatch({ type: SET_CITA, payload:cita})
}

