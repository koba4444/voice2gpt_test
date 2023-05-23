import {unlink} from 'fs';

export async function removeFile(path){
    try{
        await fs.unlink(path)
    } catch(e) {console.log("error while removing file", e.message);}
}