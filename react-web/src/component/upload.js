import React, { useContext } from "react"
import axios from "../api/axios";
import GlobalContext from "../GlobalContext";
const uploads = "/uploads";

export default function Upload({cb}) {
    const gContext = useContext(GlobalContext);
    const onChangeVal = (event) => {
       const file = event.target.files[0];
       const formData = new FormData();
        formData.append('file', file);
        try {
            axios.post(
            uploads,
            formData,
            gContext.headerConfig(),
            
            )
            .then(data => {
             // console.log('Success:', data.data);
              cb(data.data);
            })
            } catch (err) {
            if (!err?.response) {
                alert("No Server Response");
            } else if (err.response?.status === 401) {
                alert("Unauthorized");
            } else {
                alert("Failed Added");
            }
        }
       }
    return(
        <form>
            <input onChange={onChangeVal} type="file" className="form-control"/>
        </form>
        
    )
}