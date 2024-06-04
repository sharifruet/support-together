import React, { useContext } from "react";
import ProjectTabs from '../components/tabcomponent';
import { Tab, Tabs } from "react-bootstrap";

import GlobalContext from "../GlobalContext";
import DashboardBody from "../components/dashboardbody";
const Dashboard = () => {
    const {projects} = useContext(GlobalContext);
    return (
        <div className="h-full pb-4">
            <Tabs id="dashboard-project-tab" className="mb-3">
                {projects.map((project) =>
                    <Tab key={project.id} eventKey={project.id} title={project.name}>
                        <DashboardBody project={project}/>
                    </Tab>
                )}
            </Tabs>
        </div>
    );
};

export default Dashboard;
