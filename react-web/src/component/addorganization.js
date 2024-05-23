import * as React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Card } from 'react-bootstrap';
import { TextareaAutosize } from '@mui/material';
import { useState } from 'react';
import axios from "../api/axios";
import GlobalContext from '../GlobalContext';
const ORG_URL = "/organizations";

const textareaStyle = {
  overflow: 'hidden', 
  minHeight: '50px',  
  width: '100%',  
  padding: '8px',  
  border: '1px solid #888',  
  borderRadius: '4px',  
  marginTop: '20px'
};
export default function Addorg() {

  let [ code, setCode ] = useState();
  let [ name, setName ] = useState();
  let [ address, setAddress] = useState();
  const gContext = React.useContext(GlobalContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post(
        ORG_URL,
        JSON.stringify({ code, name, address}),
        gContext.headerConfig()
      );
      alert('Data inserted successfully.');
      window.location.replace('/Admindashboard');
    } catch (err) {
      if (!err?.response) {
        alert("No Server Response");
      } else if (err.response?.status === 401) {
        alert("Unauthorized");
      } else {
        alert("Failed Added");
      }
    }
  };
  return (
    <React.Fragment>
      <Card style={{padding:'50px'}}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <h5>Add Organization</h5>
            <TextField
              required
              id="code"
              name="code"
              label="Code"
              fullWidth
              autoComplete="code"
              variant="standard"
              onChange={e => setCode(e.target.value)}
              value={code}
            />
             <TextField
              required
              id="name"
              name="name"
              label="Name"
              fullWidth
              autoComplete="name"
              variant="standard"
              onChange={e => setName(e.target.value)}
              value={name}
            />
            <TextareaAutosize 
              id="address"
              name="address"
              label="Address"
              fullWidth
              autoComplete="address"
              variant="standard"
              placeholder='Address...'
              style={textareaStyle}
              onChange={e => setAddress(e.target.value)}
              value={address}>
            </TextareaAutosize>
            <button type="submit" className='btn btn-primary' onClick={handleSubmit}>Submit</button>
          </Grid>
        </Grid>
      </Card>
    </React.Fragment>
  );
}
