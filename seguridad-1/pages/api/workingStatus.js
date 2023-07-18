// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { databaseServiceFactory } from "../../services/databaseService";
import { HttpMethods } from './helpers/httpMethods.ts' 
const dbService = databaseServiceFactory();

const workingStatus = async (req, res) => {
    try{
        const body = req.body;
        if(!body.email)res.status(400).json({ data: 'missing email' })
        const user = await dbService.getUser(body.email);
        const user_id = user.id
        const checkIfCheckId = await dbService.checkIfUserCheckedIn(user_id);
        res.status(200).json({working: checkIfCheckId}); 
    }
    catch(error){
        console.log('error', error)
    }
}


export default async(req, res) =>{
    switch (req.method) {
        case HttpMethods.POST:
            workingStatus(req, res)
            break;
        case HttpMethods.GET:
        case HttpMethods.PUT:
        case HttpMethods.DELETE:
        default:
            return res.status(400).json({ data: 'request must be POST' })
    }
}
