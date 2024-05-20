
import React from 'react';
import { Link } from 'react-router-dom';
import {useState} from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import axios from "../api/axios";
const ORG_URL = "/organizations";
export default function OrgtList() {
    const [organizations, setOrganizations] = useState([]);
    React.useEffect(() => {
        axios.get(ORG_URL).then((response) => {
          setOrganizations(response.data);
        });
      }, []);
    return (
        <div className='container'>
            <Grid container spacing={2}>
                <Grid xs={12}>
                </Grid>
                {organizations.map((org) =>
                    <Grid item xs={4}>
                        <Card>
                            <br/>
                            <Typography sx={{ fontSize: 14 }}  gutterBottom>
                                Organization: {org.name}
                            </Typography>
                            <hr/>
                            <Typography sx={{ fontSize: 14 }}  gutterBottom>
                                Org Code:{org.code}
                            </Typography>
                            <Typography sx={{ fontSize: 14 }}  gutterBottom>
                              <Button variant="outlined"   size="small"><Link to={`/ProjectListOrgwise/${org.id}`}>Project List</Link></Button>
                            </Typography>
                            <Typography sx={{ fontSize: 14 }}  gutterBottom>
                              <Button variant="outlined" size="small"> Topic List</Button>
                            </Typography>
                            <Typography sx={{ fontSize: 14 }}  gutterBottom>
                              <Button variant="outlined" size="small">User List</Button>
                            </Typography>
                            <br/>
                        </Card> 
                    </Grid>
                )}
            </Grid>
        </div>
    );
  }

