import axios from "axios";

const postCheckout = (body) =>{
    return new Promise(async (resolve, reject) => {
        try{
            const response  = await axios.post(`/api/checkOut`, body)
            resolve(response)
        }
        catch(e){
            reject(e)
        }
    })
}
export default postCheckout;