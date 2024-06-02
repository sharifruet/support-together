import React, { useState, useContext } from "react";
import {
    MdAttachFile,
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { formatDate } from "../utils";
import ProjectDialog from "./ProjectDialog";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import UserInfo from "./UserInfo";
import { IoMdAdd } from "react-icons/io";
import GlobalContext from "../GlobalContext";
import SupportForm from "../components/supportform";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import TicketList from '../components/ticketlist';


const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
};

const ProjectCard = ({ project }) => {
    const { user } = useContext(GlobalContext); 
    const {organizations} = useContext(GlobalContext);
    const {topics} = useContext(GlobalContext);
    const [open, setOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const isRoleAllowed = (role) => {
        const roles = user?.roles?.map(userRole => userRole?.role);
        return roles?.includes(role);
    };
    const toggleComponent = () => {
        setIsVisible(!isVisible);
    };
    return (
        <>
            <div style={{ width: "100%" }} className="bg-white shadow p-4 rounded">
                {isVisible && <SupportForm project={project}/>}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div
                        style={{
                            display: "flex",
                            flex: 1,
                            gap: ".5rem",
                            alignItems: "center",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                        }}
                    >
                        <span>
                           <BusinessCenterIcon />
                        </span>
                        <span style={{ fontSize: "1.25rem", textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#000" }}>
                        {/* [{organizations.find(o=>o.id===project.OrganizationId).name}]  */}
                        <br/></span>
                    </div>
                    {isRoleAllowed("Admin") && <ProjectDialog project={project} />}
                </div>

                <>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                        <div
                            style={{
                                width: "1rem",
                                height: "1rem",
                                borderRadius: "50%",
                            }}
                        />
                        <h4 style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#000" }}>{project?.name}</h4>
                    </div>
                </>

                <div style={{ width: "100%", marginTop: "0.5rem" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ display: "flex", gap: "0.25rem", alignItems: "center", fontSize: "0.875rem", color: "#6b7280" }}>
                           <a href="/dashboard/tickets"><FaList /></a> 
                            <span>{project?.subTasks?.length}</span>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                        {project?.team?.map((m, index) => (
                            <div
                                key={index}
                                style={{
                                    width: "1.75rem",
                                    height: "1.75rem",
                                    borderRadius: "50%",
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.875rem",
                                    marginRight: "-0.25rem",
                                }}
                            >
                                <UserInfo user={m} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* sub tasks */}
                {project?.subTasks?.length > 0 ? (
                    <div style={{ padding: "0.75rem 0", borderTop: "1px solid #e5e7eb" }}>
                        <h5 style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#000" }}>
                            {project?.subTasks[0].title}
                        </h5>

                        <div style={{ padding: "1rem 0", display: "flex", gap: "0.5rem" }}>
                            <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                                {formatDate(new Date(project?.subTasks[0]?.date))}
                            </span>
                            <span style={{ backgroundColor: "rgba(59, 130, 246, 0.1)", padding: "0.25rem 0.75rem", borderRadius: "9999px", color: "#2563eb", fontSize: "0.875rem", fontWeight: "500" }}>
                                {project?.subTasks[0].tag}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div style={{ padding: "0.75rem 0", borderTop: "1px solid #e5e7eb" }}>
                        <TicketList project={project}/>
                    </div>
                )}

                <div style={{ width: "100%", paddingBottom: "0.5rem" }}>
                    <button className="btn btn-primary" onClick={toggleComponent}>Create Ticket</button>
                </div>
            </div>
        </>
    );
};

export default ProjectCard;
