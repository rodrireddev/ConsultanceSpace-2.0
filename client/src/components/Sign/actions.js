import axios from "axios";
import { API } from "../../config";

export const POST_SIGN_IN = 'POST_SIGN_IN';
export const GET_COUNTRIES = 'GET_COUNTRIES';
export const POST_LOG = 'POST_LOG';
export const FLAG_LOG = 'FLAG_LOG';

export const postSignIn = (user)=>{
    return async (dispatch) => {
    const res = await axios({
            method: 'POST',
            url: `${API}/newUser`,
            data: user
        })
    dispatch({ type: POST_SIGN_IN, payload:  res.data })
}}

export const logWithGooggle = (email,tipo_usuario)=>{//este reducer modifica el log
    return (dispatch) => {
    dispatch({ type: POST_LOG, payload: {email,tipo_usuario} })
}}

export const setFlagLog = (status)=>{
    return {
        type: FLAG_LOG,
        payload: status,
      };
}


export const getCountries = () => {
    return async (dispatch) => {
        const { data } = await axios.get("https://restcountries.com/v3.1/region/americas?fields=name")
        const countries = data
            .map((country) => ({ name: country.name.common }))
            .sort((a, b) => a.name.localeCompare(b.name))
        dispatch({ type: GET_COUNTRIES, payload: countries })
        
    }
}