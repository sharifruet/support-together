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
const imgstyle = {
  overflow: 'hidden', 
  minHeight: '90px',  
  width: '80px',
  border: '1px solid #888',  
}
const inputArr = [
  {
    type: "text",
    id: 1,
    value: ""
  }
];
export default function SupportForm() {

  let [ title, setTitle ] = useState();
  let [ topicId, setTopic ] = useState();
  let [ priority, setPriority ] = useState();
  let [ description, setDescription ] = useState();
  let [ requestedBy, setRequestedBy ] = useState();
  let [ topiclist, setTopiclist] = useState();
  let [ fyiTo, setFyiTo] = useState([]);
  let [filepth, setFilepth] = useState([]);
  let [attachments, setAttachments] = useState([]);
  const [arr, setArr] = useState([inputArr]);
  const gContext = useContext(GlobalContext);
  const navigate = useNavigate();

  // const handleRemoveFile = (index) => {
  //   const newFiles = [...files];
  //   newFiles.splice(index, 1);
  //   setFiles(newFiles);
  // };
  const addInput = () => {
    setArr(s => {
      return [
        ...s,
        {
          type: "text",
          value: ""
        }
      ];
    });
    setFyiTo([...fyiTo, '']);
  };
  React.useEffect(() => {
    axios.get(TOPIC_URL, gContext.headerConfig()).then((response) => {
      setTopiclist(response.data);
    });

  }, []);
  const handleChange = e => {
    e.preventDefault();

    const index = e.target.id;
    setArr(s => {
      const newArr = s.slice();
      newArr[index].value = e.target.value;
      const currentValues = newArr.map(field => field.value);
      setFyiTo(currentValues);
      return newArr;
    });
  };
  //console.log(fyiTo);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post(
        TICKET_URL, 
        JSON.stringify({ topicId, title, description, priority, requestedBy, attachments, fyiTo }),
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
    setAttachments([...attachments,d.fileName]);
    setFilepth(...filepth, d.filePath);
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
              onChange={e => setRequestedBy(e.target.value)}
              value={requestedBy}
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
          <Grid item sm={5}>
              {arr.map((item, i) => {
                return (
                  <input
                    onChange={handleChange}
                    value={item.value}
                    id={i}
                    type={item.type}
                    size="10"
                    placeholder='ex@ex.com'
                    className='form-control'
                  />
                );
              })}
          </Grid>
          
          <Grid sm={1}><br/><button className="form-control add"  onClick={addInput} type="button">+</button></Grid>
          <Grid item sm={6}>
            <br/>
            <label>Attached your document : &nbsp;</label>
            <Upload cb={cb}/>
          </Grid>
          <Grid sm={6}></Grid>
          <Grid sm={6}>
            {filepth && <Card style={imgstyle}>
              <img src={'https://support.i2gether.com/api/'+filepth}/>
            </Card> }
          </Grid>
          <Grid item sm={12}>
              <Button type="submit" variant="outlined"  onClick={handleSubmit}>Submit</Button>
          </Grid>
        </Grid>
      </Card>
    </React.Fragment>
  );
}
