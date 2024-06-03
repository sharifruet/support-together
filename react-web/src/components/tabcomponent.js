import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import useProjectService from '../hooks/useProjectService';
import DashboardBody from '../components/dashboardbody';

export default function ProjectTabs() {
  const [value, setValue] = React.useState('1');
  const { getAllProjects } = useProjectService();
  const [projects, setProjects] = useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
    const fetchProjects = async () => {
        try {
            const data = await getAllProjects();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching project:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);
console.log(projects);
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
                {projects.map((project) =>
                    <Tab label={project.name} value={project.id} />
                )}
            </TabList>
        </Box>
        {projects.map((project) =>
            <TabPanel value={project.id}><DashboardBody project={project}/></TabPanel>
        )}
      </TabContext>
    </Box>
  );
}
