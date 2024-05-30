
import React, { useContext, useEffect } from 'react';
import {useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SupportForm from '../component/supportform';
import TicketList from '../component/ticketlist';
import GlobalContext from '../GlobalContext';

export default function ProjectList() {

    const [isVisible, setIsVisible] = useState(false);

    const {projects, organizations} = useContext(GlobalContext);

    const toggleComponent = () => {
        setIsVisible(!isVisible);
      };
  
    if (!projects || !organizations) return null;
    return (
        <div className='container'>
            <Grid container spacing={2}>
                <Grid>
                    {isVisible && <SupportForm />}
                </Grid>
                {projects.map((project) =>
                    <Grid key={project.id} item xs={6}>
                        <Card>
                            <br/>
                            <Typography sx={{ fontSize: 14 }}  gutterBottom>
                                Project-code: {project.code} [{organizations.find(o=>o.id===project.OrganizationId).name}] <br/>
                                Name: {project.name} 
                            </Typography>
                            <hr/>
                            <Typography sx={{ fontSize: 14 }}  gutterBottom>
                                <Button size="small" variant="outlined" onClick={toggleComponent}>Create Ticket</Button>
                            </Typography>
                            <CardActions>
                              <TicketList />
                            </CardActions>
                        </Card> 
                    </Grid>
                )}
               
            </Grid>
        </div>
    );
  }

