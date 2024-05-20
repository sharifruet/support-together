
import React, { useContext, useEffect } from 'react';
import {useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SupportForm from '../component/supportform';
import TicketList from '../component/ticketlist';
import GlobalContext from '../GlobalContext';

//import axios from "../api/axios";
//const PROJECT_URL = "/projects";
//const ORG_URL = "/organizations";


export default function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [ticketlistvisible, setTicketlistvisible] = useState(false);
    const [organizations, setOrganizations] = useState([]);
    const gContext = useContext(GlobalContext);

    const toggleComponent = () => {
        setIsVisible(!isVisible);
        setTicketlistvisible(ticketlistvisible);
      };
    const toggleTicectlist = () => {
        setTicketlistvisible(!ticketlistvisible);
        setIsVisible(isVisible);
      };

    useEffect(() => {
      setProjects(gContext.projects);
    }, []);
    /*
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
 */
    const getOrg = (orgId)=>{
        return gContext.organizations.find(o=>o.id===orgId)
    }
   

    console.log(gContext.projects);
  
    if (!gContext.projects) return null;
    return (
        <div className='container'>
            <Grid container spacing={2}>
                <Grid>
                    {ticketlistvisible && <TicketList />}
                    {isVisible && <SupportForm />}
                </Grid>
                {gContext.projects.map((project) =>
                    <Grid key={project.id} item xs={4}>
                        
                        <Card>
                            <br/>
                            <Typography sx={{ fontSize: 14 }}  gutterBottom>
                                Project-code: {project.code} [{getOrg(project.id).name}] <br/>
                                Name: {project.name} 
                            </Typography>
                            <hr/>
                            <Typography sx={{ fontSize: 14 }}  gutterBottom>
                                Project Code: {project.OrganizationId}
                            </Typography>
                            
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

