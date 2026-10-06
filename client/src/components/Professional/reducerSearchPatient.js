import { GET_PATIENT, GET_APPOINTMENTS } from "./actions";

const initialState={
    patients:[],
    earnings:[],
}

export default function reducerSearchPatients (state=initialState, action){
    switch (action.type) {
        case GET_PATIENT:
            return {
                ...state,
                patients: action.payload
            }
        case GET_APPOINTMENTS:
            return {
                ...state,
                earnings: action.payload
            }
        default:
            return state
    }

}