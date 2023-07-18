import axios from "axios";

const postCheckin = (body) =>{
    return new Promise(async (resolve, reject) => {
        try{
            const response  = await axios.post(`/api/checkIn`, body)
            resolve(response)
        }
        catch(e){
            reject(e)
        }
    })
}
export default postCheckin;