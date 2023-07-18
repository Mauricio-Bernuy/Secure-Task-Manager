import axios from "axios";

const postCheckin = (body) =>{
    return new Promise(async (resolve, reject) => {
        try{
            const response  = await axios.post(`/api/workingStatus`, body)
            resolve(response)
        }
        catch(e){
            reject(e)
        }
    })
}
export default postCheckin;