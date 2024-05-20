
import React from 'react';
import {useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SupportForm from '../component/supportform';
import TicketList from '../component/ticketlist';
import axios from "../api/axios";
const PROJECT_URL = "/projects";
const ORG_URL = "/organizations";


export default function ProjectList() {
    const [project, setProject] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [ticketlistvisible, setTicketlistvisible] = useState(false);
    const [organizations, setOrganizations] = useState([]);
    const toggleComponent = () => {
        setIsVisible(!isVisible);
        setTicketlistvisible(ticketlistvisible);
      };
    const toggleTicectlist = () => {
        setTicketlistvisible(!ticketlistvisible);
        setIsVisible(isVisible);
      };
      
    React.useEffect(() => {
      axios.get(PROJECT_URL).then((response) => {
        setProject(response.data);
      });

    }, []);

    React.useEffect(() => {
        axios.get(ORG_URL).then((response) => {
          setOrganizations(response.data);
        });
  
      }, [project]);

    const getOrg = (orgId)=>{
        console.log(project);
        return organizations.find(o=>o.id===orgId)
    }
  
    if (!project) return null;
    return (
        <div className='container'>
            <Grid container spacing={2}>
                <Grid xs={12}>
                    {ticketlistvisible && <TicketList />}
                    {isVisible && <SupportForm />}
                </Grid>
                {project.map((plist) =>
                    <Grid item xs={4}>
                        
                        <Card>
                            <br/>
                            <Typography sx={{ fontSize: 14 }}  gutterBottom>
                                Project: {plist.name}
                            </Typography>
                            <hr/>
                            <Typography sx={{ fontSize: 14 }}  gutterBottom>
                                Project Code: {plist.OrganizationId}
                            </Typography>
                            <p>Org Name: {getOrg(plist.OrganizationId)?.name}</p>
                            <CardActions>
                                <Button size="small" onClick={toggleComponent}>Create Ticket</Button>
                                <Button size="small" onClick={toggleTicectlist}> --- &nbsp; List <NotificationsActiveIcon/></Button>
                            </CardActions>
                        </Card> 
                    </Grid>
                )}
               
            </Grid>
        </div>
    );
  }

