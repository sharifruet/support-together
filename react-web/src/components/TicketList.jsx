import React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { Card } from 'react-bootstrap';
import TableRow from '@mui/material/TableRow';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { TextareaAutosize, colors } from '@mui/material';
import TableHead from '@mui/material/TableHead';
import "bootstrap-icons/font/bootstrap-icons.css";
import Upload from './upload';
import GlobalContext from '../GlobalContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from "../api/axios";
import { BASE_URL, PRIORITY_LIST, PRIORITY_COLOR } from '../conf';
import moment from 'moment';
const TICKET_URL = "/tickets";
const ProjWiseTICKET_URL = "/tickets/project";
const TOPIC_URL = "/topics";

//const rows = [];
const textareaStyle = {
  overflow: 'hidden',
  minHeight: '100px',
  width: '100%',
  padding: '8px',
  border: '1px solid #888',
  borderRadius: '4px',
  marginTop: '20px'
};
const imgStyle = {
  overflow: 'hidden',
  minHeight: '90px',
  width: '80px',
  border: '1px solid #888',
};
const tHeader = {
  backgroundColor: '#ddd',
  borderRadius: '5px',
};
const inputArr = [
  {
    type: "text",
    id: 1,
    value: ""
  }
];

const TicketList = ({ project, tickets }) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [tid, setTid] = useState();
  const [dataById, setDataById] = useState();
  const [title, setTitle] = useState();
  const [priority, setPriority] = useState();
  const [requestedBy, setRequestedBy] = useState();
  const [topicId, setTopicId] = useState();
  const [description, setDescription] = useState();
  const [topicList, setTopicList] = useState();
  const [fyiTo, setFyiTo] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [files, setFiles] = useState([]);
  const [arr, setArr] = useState([inputArr]);
  const gContext = useContext(GlobalContext);
  const navigate = useNavigate();
  const [filePath, setFilePath] = useState([]);

  const handleFileChange = (event) => {
    setFiles([...files, ...event.target.files]);
  };
  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };
  useEffect(() => {
    if (tid) {
      axios.get(`${TICKET_URL}/${tid}`, gContext.headerConfig())
        .then((response) => {
          setDataById(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [show, tid]);

  useEffect(() => {
    axios.get(TOPIC_URL, gContext.headerConfig())
      .then((response) => {
        setTopicList(response.data);
      });
  }, [dataById]);

  useEffect(() => {
    if (dataById) {
      setTitle(dataById.title);
      setRequestedBy(dataById.requestedBy);
      setTopicId(dataById.topicId);
      setDescription(dataById.description);
      setFyiTo(dataById.fyiTo);
      setPriority(dataById.priority);
    }
  }, [dataById]);

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
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    axios.post('/uploads', formData, gContext.headerConfig())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    try {
      await axios.put(
        `${TICKET_URL}/${tid}`,
        JSON.stringify({ title, requestedBy, topicId, description, fyiTo, priority, attachments, tid }),
        gContext.headerConfig()
      );
      alert('Data update successfully.');
      navigate("/Dashboard");
    } catch (err) {
      if (!err?.response) {
        alert("No Server Response");
      } else if (err.response?.status === 401) {
        alert("Unauthorized");
      } else {
        alert("Failed Updated");
      }
    }
  };
  const cb = (d) => {
    setAttachments([...attachments, d.fileName]);
    setFilePath(...filePath, d.filePath);
  }
  return (
    <>
      <Modal show={show} onHide={handleClose} style={{ marginTop: '40px' }}>
        <Modal.Header closeButton>
          <Modal.Title>Update Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                hidden
                id="id"
                name="id"
                onChange={e => setTitle(e.target.value)}
                value={tid}
              />
              <TextField
                required
                id="title"
                name="title"
                label="Title"
                fullWidth
                autoComplete="title"
                variant="standard"
                focused
                onChange={e => setTitle(e.target.value)}
                value={title}
              />
              <TextField
                required
                id="requestedBy"
                name="requestedBy"
                label="RequestedBy"
                fullWidth
                focused
                autoComplete="requestedBy"
                variant="standard"
                onChange={e => setRequestedBy(e.target.value)}
                value={requestedBy}
              />
              <FormControl variant="standard" sx={{ minWidth: 330 }}>
                <InputLabel id="demo-simple-select-standard-label">Select Topic *</InputLabel>
                <Select label="Topic" name="topicId" id="topicId"
                  onChange={e => setTopicId(e.target.value)}>
                  {topicList?.map((topic) => <MenuItem key={topic.id} value={topic.id}>{topic.name}</MenuItem>)}
                </Select>
              </FormControl>
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
            <Grid item xs={12}>
              <TextField
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
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={10}>
              <label>FyiTo : &nbsp;</label>
              {arr.map((item, i) => {
                return (
                  <input
                    key={i}
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
            <Grid item sm={2}><br /><br /><button className="form-control add" onClick={addInput} type="button">+</button></Grid>
            <Grid item xs={12}>
              <label>Attached your document : &nbsp;</label>
              <br />
              <Upload cb={cb} />
              {filePath && <Card style={imgStyle}>
                <img src={`${BASE_URL}/${filePath}`} />
              </Card>}
              <br />
              <Button variant="primary" onClick={handleSubmit} className='btn-sm'>
                UPDATE
              </Button>
            </Grid>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {project.name}
      <Box sx={{ width: '100%' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={tHeader}>
                <TableCell>Title</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                {/* <TableCell align="right">Action</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="left"> <Link to={`/ticket/${row.code}`}>[{row.code}]</Link> {row.title}</TableCell>
                    <TableCell align="left">{moment(row.createdAt).format('ddd, D MMMM, YYYY hh:mm A')}</TableCell>
                    <TableCell align="left"><span className={`badge rounded-pill text-bg-primary ${PRIORITY_COLOR[row.priority]}`}>{PRIORITY_LIST[row.priority]}</span></TableCell>
                    <TableCell align="left">{row.status}</TableCell>
                    {/* <TableCell align="right"><i role="button" onClick={() => handleShow(setTid(row.id))} className="bi bi-pencil-square"></i></TableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};
export default TicketList;