import * as React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Card } from 'react-bootstrap';
import { useState, useContext } from 'react';
import axios from "../api/axios";
import { TextareaAutosize } from '@mui/material';
import GlobalContext from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
import Upload from './upload';
const TICKET_URL = "/tickets"; 
const TOPIC_URL = "/topics";

const textareaStyle = {
  overflow: 'hidden', 
  minHeight: '100px',  
  width: '100%',  
  padding: '8px',  
  border: '1px solid #888',  
  borderRadius: '4px',  
  marginTop: '20px'
};

export default function SupportForm() {

  let [ title, setTitle ] = useState();
  let [ topicId, setTopic ] = useState();
  let [ priority, setPriority ] = useState();
  let [ description, setDescription ] = useState();
  let [ requestedBy, setRequestedBy ] = useState();
  let [ topiclist, setTopiclist] = useState();
  let [ fyito, setFyito] = useState([]);
  let [filepth, setFilepth] = useState();
  const gContext = useContext(GlobalContext);
  const navigate = useNavigate();

  // const handleRemoveFile = (index) => {
  //   const newFiles = [...files];
  //   newFiles.splice(index, 1);
  //   setFiles(newFiles);
  // };
  React.useEffect(() => {
    axios.get(TOPIC_URL, gContext.headerConfig()).then((response) => {
      setTopiclist(response.data);
    });

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post(
        TICKET_URL, 
        JSON.stringify({ title, topicId, priority, description, requestedBy, fyito }),
        gContext.headerConfig()
      );
      alert('Data inserted successfully.');
      navigate("/Dashboard");
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

  const cb = (d)=>{
    setFilepth(d.filePath);
  }
  if (!topiclist) return null;
  return (
    <React.Fragment>
      <Card style={{padding:'50px'}}>
        <Grid container spacing={2}>
          <Grid item sm={6}>
            <TextField
              required
              id="title"
              name="title"
              label="Title"
              fullWidth
              autoComplete="title"
              variant="standard"
              onChange={e => setTitle(e.target.value)}
              value={title}
            />
             <TextField
              required
              id="requestedBy"
              name="requestedBy"
              label="RequestedBy"
              fullWidth
              autoComplete="requestedBy"
              variant="standard"
              onChange={e => setRequestedBy('Harun')}
            />
          </Grid>
          <Grid item sm={6}></Grid>
          <Grid item sm={6} >
            <FormControl variant="standard" sx={{ minWidth: 330 }}>
              <InputLabel id="demo-simple-select-standard-label">Select Topic *</InputLabel>
              <Select label="Topic" name="topicId" id="topicId"
                onChange={e => setTopic(e.target.value)}>
                {topiclist.map((tlist) => <MenuItem value={tlist.id}>{tlist.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={6}></Grid>
          <Grid item sm={6}>
              <FormControl variant="standard" sx={{ minWidth: 330 }}>
                  <InputLabel id="demo-simple-select-standard-label">Select Priority *</InputLabel>
                  <Select label="Priority" name="priority" id="priority"
                  onChange={e => setPriority(e.target.value)}>
                      <MenuItem value={'P1'}>P1</MenuItem>
                      <MenuItem value={'P2'}>P2</MenuItem>
                      <MenuItem value={'P3'}>P3</MenuItem>
                      <MenuItem value={'P4'}>P4</MenuItem>
                      <MenuItem value={'P5'}>P5</MenuItem>
                  </Select>
              </FormControl>
          </Grid>
          <Grid item sm={12}>
            <TextareaAutosize 
            id="description"
            name="description"
            label="Description"
            fullWidth
            autoComplete="description"
            variant="standard"
            placeholder='Description...'
            style={textareaStyle}
            onChange={e => setDescription(e.target.value)}
            value={description}>
            </TextareaAutosize>
            <br/>
          </Grid>
          <Grid item sm={12}>
            <TextField
                required
                id="fyito"
                name="fyito"
                label="FyiTo"
                fullWidth
                autoComplete="fyito"
                variant="standard"
                onChange={e => setFyito(e.target.value)}
                value={fyito}
              />
          </Grid>
          <Grid item sm={6}>
            <br/>
            <label>Attached your document : &nbsp;</label>
            <Upload cb={cb}/>
            {/* <ol>
            {files.map((file, index) => (
              <li key={index}>
                {file.name}
                &nbsp; <HighlightOffIcon onClick={() => handleRemoveFile(index)}/>
              </li>
            ))}
          </ol> */}
          </Grid>
          <Grid sm={6}>
            {filepth && <img src={'https://support.i2gether.com/'+filepth} alt="Uploaded content"/>}
          </Grid>
          <Grid item sm={12}>
              <Button type="submit" variant="outlined"  onClick={handleSubmit}>Submit</Button>
          </Grid>
        </Grid>
      </Card>
    </React.Fragment>
  );
}
