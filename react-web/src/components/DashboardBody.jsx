import React, { useState, useEffect } from "react";
import useCrud from "../hooks/useCrud";
import ProjectCard from "./ProjectCard";
import ViewListIcon from '@mui/icons-material/ViewList';
import DoneIcon from '@mui/icons-material/Done';
import InProgressIcon from '@mui/icons-material/Autorenew';
import PendingIcon from '@mui/icons-material/HourglassEmpty';

const DashboardBody = ({ project }) => {
    const { getById } = useCrud();
    const [tickets, setTickets] = useState([]);
    const ticketUrl = "/tickets/project";

    const fetchTicketsByProjectId = async () => {
        try {
            const data = await getById(ticketUrl, project.id);
            setTickets(data);
        } catch (error) {
            console.error('Error fetching project:', error);
        }
    };

    useEffect(() => {
        fetchTicketsByProjectId();
    }, []);

    const Card = ({ icon: IconComponent, bg, label, count }) => (
        <div className={`card text-center ${bg} shadow`}>
            <div className="card-body text-white">
                <p className="card-text text-white">
                    {IconComponent && <IconComponent className="me-2" />} {label}
                </p>
                <span className="card-title fs-4 fw-semibold">
                    {count}
                </span>
            </div>
        </div>
    );

    return (
        <div className="h-100 pb-4">
            <div className="row row-cols-1 row-cols-md-4 g-4">
                <div className="col">
                    <Card icon={ViewListIcon} bg={'bg-primary'} label={'TOTAL'} count={tickets.length} />
                </div>
                <div className="col">
                    <Card icon={DoneIcon} bg={'bg-success'} label={'DONE'} count={tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length} />
                </div>
                <div className="col">
                    <Card icon={InProgressIcon} bg={'bg-info'} label={'IN PROGRESS'} count={tickets.filter(t => t.status !== 'Resolved' || t.status !== 'Closed' || t.status !== 'Assigned' || t.status !== 'Created').length} />
                </div>
                <div className="col">
                    <Card icon={PendingIcon} bg={'bg-warning'} label={'PENDING'} count={tickets.filter(t => t.status === 'Created').length} />
                </div>
            </div>
            <div className="mt-4">
                <div className="col">
                    <ProjectCard project={project} tickets={tickets} />
                </div>
            </div>
        </div>
    );
};

export default DashboardBody;
