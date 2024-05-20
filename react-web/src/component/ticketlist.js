import  React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { TextareaAutosize } from '@mui/material';
import TableHead from '@mui/material/TableHead';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from 'react';
import { useEffect } from 'react';
import axios from "../api/axios";
const TICKET_URL = "/tickets";
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

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [tid, setTid] = useState();
  const [databyid, setDatabyid] = useState();
  const [edittitle, setEdittitle] = useState();
  const [editrequisby, setEditrequisby] = useState();
  const [edittopicid, setEdittopicid] = useState();
  const [editdescription, setEditdescription ] = useState();
  const [topiclist, setTopiclist] = useState();

  useEffect(() => {
    axios.get(`${TICKET_URL}/${tid}`)
    .then((response) => {
      setDatabyid(response.data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}, [show, tid]);

useEffect(() => {
  axios.get(TOPIC_URL).then((response) => {
    setTopiclist(response.data);
    console.log(topiclist);
  });

},[databyid]);

useEffect(() => {
  if (databyid) {
    setEdittitle(databyid.title);
    setEditrequisby(databyid.requestedBy);
    setEdittopicid(databyid.topicId);
    setEditdescription(databyid.description);
  }
}, [databyid]);

  useEffect(() => {
    axios.get(TICKET_URL).then((response) => {
      setTickets(response.data);
    });

  }, []);

  return (
    <>
    <Modal show={show} onHide={handleClose} style={{marginTop:'40px'}}>
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
              onChange={e => setEdittitle(e.target.value)}
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
              onChange={e => setEdittitle(e.target.value)}
              value={edittitle}
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
              onChange={e => setEditrequisby(e.target.value)}
              value={editrequisby}
            />
             <FormControl variant="standard" sx={{ minWidth: 330 }}>
              <InputLabel id="demo-simple-select-standard-label">Select Topic *</InputLabel>
              <Select label="Topic" name="topicId" id="topicId"
                onChange={e => setEdittopicid(e.target.value)}>
                {topiclist?.map((tlist) => <MenuItem value={tlist.id}>{tlist.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextareaAutosize 
              id="description"
              name="description"
              label="Description"
              fullWidth
              autoComplete="description"
              variant="standard"
              placeholder='Description...'
              style={textareaStyle}
              onChange={e => setEditdescription(e.target.value)}
              value={editdescription}>
            </TextareaAutosize>
            <br/><br/>
            <Button variant="primary">
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
      <Box sx={{ width: '100%' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((row, index) => {
                  return (
                    <TableRow>
                      <TableCell align="left">{row.title}</TableCell>
                      <TableCell align="right"><i role="button" onClick={() => handleShow(setTid(row.id))} className="bi bi-pencil-square"></i></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
      </Box>
    </>
  );
}