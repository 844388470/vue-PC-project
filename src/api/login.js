import axios from "axios"


export const login = (staff_no,password) => {
    return axios.post("/login",{staff_no,password})
}