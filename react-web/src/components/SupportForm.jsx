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
  marginTop: '20px',
  marginBottom: '20px'
};
const imgStyle = {
  overflow: 'hidden',
  height: '100px',
  width: '190px',
}
const inputArr = [
  {
    type: "text",
    id: 1,
    value: ""
  }
];
const fyiToStyle =
{
  paddingLeft: "15px"
}

const formTitle = {
  border: "1px solid #ddd",
  padding: "10px"
}

export default function SupportForm({ project }) {

  let [title, setTitle] = useState();
  let [topicId, setTopic] = useState();
  let [priority, setPriority] = useState();
  let [description, setDescription] = useState();
  let [requestedBy, setRequestedBy] = useState();
  let [topicList, setTopicList] = useState();
  let [fyiTo, setFyiTo] = useState([]);
  let [filePath, setFilePath] = useState([]);
  let [attachments, setAttachments] = useState([]);
  const [arr, setArr] = useState([inputArr]);
  const gContext = useContext(GlobalContext);
  const navigate = useNavigate();
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
      setTopicList(response.data);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        TICKET_URL,
        JSON.stringify({ topicId, title, description, priority, requestedBy, attachments, fyiTo }),
        gContext.headerConfig()
      );
      alert('Data inserted successfully.');
      navigate("/tickets");
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
  const cb = (d) => {
    setAttachments([...attachments, d.fileName]);
    setFilePath(...filePath, d.filePath);
  }
  if (!topicList) return null;
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item sm={2}></Grid>
        <Grid item sm={8}>
          <Card style={{ padding: '50px' }}>
            <Grid item sm={12} style={formTitle}><h5>Create a new ticket</h5></Grid>
            <Grid container spacing={2}>
              <Grid sm={12}><br /><b>Project Name</b>: {project?.name}</Grid>
              <Grid item sm={12}>
                <br /><br />
                <TextField
                  required
                  id="title"
                  name="title"
                  label="Title"
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
                  autoComplete="requestedBy"
                  variant="standard"
                  onChange={e => setRequestedBy(e.target.value)}
                  value={requestedBy}
                /><br /><br />
                <FormControl variant="standard" sx={{ minWidth: '100%' }}>
                  <InputLabel id="demo-simple-select-standard-label">Select Topic *</InputLabel>
                  <Select label="Topic" name="topicId" id="topicId"
                    onChange={e => setTopic(e.target.value)}>
                    {topicList.map((topic, index) => <MenuItem key={index} value={topic.id}>{topic.name}</MenuItem>)}
                  </Select>
                </FormControl>
                <br />
                <FormControl variant="standard" sx={{ minWidth: '30%', float: 'left' }}>
                  <InputLabel id="demo-simple-select-standard-label">Select Priority *</InputLabel>
                  <Select label="Priority" name="priority" id="priority"
                    onChange={e => setPriority(e.target.value)}>
                    <MenuItem value={'P3'}>Minor</MenuItem>
                    <MenuItem value={'P2'}>Major</MenuItem>
                    <MenuItem value={'P1'}>Critical</MenuItem>
                  </Select>
                </FormControl>
                <br /><br />
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
                  value={description}
                />
              </Grid>
              <Grid sm={11} style={fyiToStyle}>
                {arr.map((item, i) => {
                  return (
                    <input
                      key={i}
                      onChange={handleChange}
                      value={item.value}
                      id={i}
                      type={item.type}
                      size="10"
                      placeholder='CC...'
                      className='form-control'
                    />
                  );
                })}
              </Grid>
              <Grid sm={1}><button className="btn btn-info add" onClick={addInput} type="button">+</button></Grid>
              <Grid sm={7} style={fyiToStyle}>
                <br />
                <label>Attached your document : &nbsp;</label>
                <Upload cb={cb} />
              </Grid>
              <Grid sm={1}></Grid>
              <Grid sm={4}>
                <br />
                {filePath && <Card style={imgStyle}>
                  <img src={'https://support.i2gether.com/api/' + filePath} />
                </Card>}
              </Grid>
              <Grid item sm={12}>
                <hr />
                <Button variant="contained" onClick={handleSubmit}><strong>Submit</strong></Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item sm={2}></Grid>
      </Grid>
    </React.Fragment>
  );
}