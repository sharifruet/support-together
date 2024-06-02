import React, { useContext } from 'react';
import {useState} from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import axios from "../api/axios";
import GlobalContext from '../GlobalContext';
const PROJECT_URL = "/projects";
const ORG_URL = "/organizations";



export default function ProjectListOrgwise() {
    const [project, setProject] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const gContext = useContext(GlobalContext);
  
    React.useEffect(() => {
      axios.get(PROJECT_URL, gContext.headerConfig()).then((response) => {
        setProject(response.data);
      });

    }, []);

    React.useEffect(() => {
        axios.get(ORG_URL, gContext.headerConfig()).then((response) => {
          setOrganizations(response.data);
        });
  
      }, [project]);

    const getOrg = (orgId)=>{
        //console.log(project);
        return organizations.find(o=>o.id===orgId)
    }
  
    if (!project) return null;
    return (
        <div className='container'>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button>Add Project</Button>
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
                        </Card> 
                    </Grid>
                )}
            </Grid>
        </div>
    );
  }

