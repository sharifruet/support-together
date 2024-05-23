import  React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
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
import GlobalContext from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
import { useState , useEffect, useContext} from 'react';
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
  const [editfyito, setEditfyito] = useState([]);
  const [files, setFiles] = useState([]);
  const gContext = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFiles([...files, ...event.target.files]);
  };
  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };
  useEffect(() => {
    axios.get(`${TICKET_URL}/${tid}`, gContext.headerConfig())
    .then((response) => {
      setDatabyid(response.data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}, [show, tid]);

useEffect(() => {
  axios.get(TOPIC_URL, gContext.headerConfig())
  .then((response) => {
    setTopiclist(response.data);
    console.log(topiclist);
  });
}, [databyid]);

useEffect(() => {
  if (databyid) {
    setEdittitle(databyid.title);
    setEditrequisby(databyid.requestedBy);
    setEdittopicid(databyid.topicId);
    setEditdescription(databyid.description);
    setEditfyito(databyid.fyito);
  }
}, [databyid]);

  useEffect(() => {
    axios.get(TICKET_URL, gContext.headerConfig()).then((response) => {
      setTickets(response.data);
    });

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
     const formData = new FormData();
     files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
      axios.post('/uploads', formData, gContext.headerConfig() )
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      try {
          await axios.put(
          `${TICKET_URL}/${tid}`,
          JSON.stringify({ edittitle, editrequisby, edittopicid, editdescription, editfyito, tid }),
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
            <br/> 
            <TextField
                required
                id="fyito"
                name="fyito"
                label="FyiTo"
                fullWidth
                autoComplete="fyito"
                variant="standard"
                onChange={e => setEditfyito(e.target.value)}
                value={editfyito}
            />
            <br/><br/>
            <label>Attached your document : &nbsp;</label>
            <input type="file" multiple onChange={handleFileChange} />
            <ol>
              {Array.from(files).map((file, index) => (
                <li key={index}>
                  {file.name}
                  &nbsp; <HighlightOffIcon onClick={() => handleRemoveFile(index)}/>
                </li>
              ))}
            </ol>
           <br/>
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
                      <TableCell align="right"><i class="bi bi-pencil-square" role="button" onClick={() => handleShow(setTid(row.id))}></i></TableCell>
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