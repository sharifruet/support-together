import React, { useState, useEffect, useContext } from "react";
import { summary } from "../assets/data";
import { Card as BootstrapCard } from "react-bootstrap";
import useCrud from "../hooks/useCrud";
import ProjectCard from "../components/ProjectCard";
import TicketList from '../components/ticketlist';

const DashboardBody = ({project}) => {
    const { getAll } = useCrud();
    const [tickets, setTickets] = useState([]);
    const ticketUrl = "/tickets/project"
    const fetchProjects = async () => {
        try {
            const data = await getAll(ticketUrl);
            setTickets(data);
        } catch (error) {
            console.error('Error fetching project:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

//console.log(tickets);

    const totals = summary.tasks;

    const stats = [
        {
            _id: "1",
            label: "TOTAL TICKETS",
            total: summary?.totalTasks || 0,
            bg: "bg-primary",
        },
        {
            _id: "2",
            label: "COMPLETED TICKETS",
            total: totals["completed"] || 0,
            bg: "bg-success",
        },
        {
            _id: "3",
            label: "PROGRESS TICKETS",
            total: totals["in progress"] || 0,
            bg: "bg-warning",
        },
        {
            _id: "4",
            label: "PENDING TICKETS",
            total: totals["todo"],
            bg: "bg-danger",
        },
    ];

    const cardWidth = {
        1: 'row-cols-md-1 w-100 row-cols-1 row-cols-sm-2 py-4 row g-4',
        2: 'row-cols-md-2 w-100 row-cols-1 row-cols-sm-2 py-4 row g-4',
    }

    const Card = ({ label, count, bg, icon }) => {
        return (
            <BootstrapCard className="w-100 h-32 bg-white p-3 shadow-md rounded d-flex align-items-center justify-between">
                <div className="h-100 d-flex flex-column justify-between flex-1">
                    <p className="text-base text-muted">{label}</p>
                    <span className="text-2xl font-semibold">{count}</span>
                </div>
                <div className={`w-10 h-10 rounded-circle d-flex align-items-center justify-center text-white ${bg}`}>
                    {icon}
                </div>
            </BootstrapCard>
        );
    };

    return (
        <div className="h-full pb-4">
            <div className="row row-cols-1 row-cols-md-4 g-4">
                {stats.map(({ icon, bg, label, total }, index) => (
                    <div className="col" key={index}>
                        <Card icon={icon} bg={bg} label={label} count={total} />
                    </div>
                ))}
            </div>

            <div>
                <div className="col">
                    <ProjectCard project={project} />
                </div>
            </div>
        </div>
    );
};

export default DashboardBody;
