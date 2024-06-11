import React, { useState, useEffect } from "react";
import { Card as BootstrapCard, Col } from "react-bootstrap";
import useCrud from "../hooks/useCrud";
import ProjectCard from "./ProjectCard";
import ViewListIcon from '@mui/icons-material/ViewList';

const DashboardBody = ({project}) => {
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

    const Card = ({ label, count, bg, icon }) => {
        return (
            <BootstrapCard className={` ${bg} w-100 h-32 p-3 shadow-md rounded d-flex align-items-center justify-between`}>
                <div className={`h-100 d-flex flex-column justify-between flex-1 ${bg}`}>
                    <p className={`text-base text-white`}> <ViewListIcon/> {label}</p>
                    <span className="text-2xl font-semibold text-white">{count}</span>
                </div>
                <div className={`w-10 h-10 rounded-circle d-flex align-items-center justify-center text-white`}>
                
                </div>
            </BootstrapCard>
        );
    };

    return (
        <div className="h-full pb-4">
            <div className="row row-cols-1 row-cols-md-4 g-4">
                <Col>
                    <Card icon={''} bg={'bg-primary'} label={'TOTAL'} count={tickets.length} />
                </Col>
                <Col>
                    <Card icon={''} bg={'bg-success'} label={'DONE'} count={tickets.filter(t=>t.status==='Done').length} />
                </Col>
                <Col>
                    <Card icon={''} bg={'bg-info'} label={'IN PROGRESS'} count={tickets.filter(t=>t.status!='Done' && t.status!='Created').length} />
                </Col>
                <Col>
                    <Card icon={''} bg={'bg-warning'} label={'PENDING'} count={tickets.filter(t=>t.status==='Created').length} />
                </Col>
            </div>

            <div>
                <div className="col">
                    <ProjectCard project={project}  tickets={tickets} />
                </div>
            </div>
        </div>
    );
};

export default DashboardBody;
