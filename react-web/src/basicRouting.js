import { Route, Routes, Navigate } from "react-router-dom";
import Home from './page/home';
import About from './page/about';
import Login from "./page/Login";
import Signup from "./page/signup";
import ForgotPass from "./page/forgotPass";
import Dashboard from "./page/Dashboard";
import AdminDashboard from "./page/admindashboard";
import SideBar from "./components/SideBar";
import Organizations from "./components/organizations/Organizations";
import Projects from "./components/projects/Projects";
import Topics from "./components/topics/Topics";
import SupportTeams from "./components/supportTeams/SupportTeams";
import EmailTemplates from "./components/emails/EmailTemplates";
import ProtectedRoute from "./components/ProtectedRoute";
import ChangePassword from "./page/ChangePassword";
import Tickets from "./components/tickets/Tickets";
import Ticket from "./page/Ticket";
import ProfileUpdate from "./page/ProfileUpdate";
import CreateTicket from "./components/tickets/CreateTicket";
import SupportTeamSchedules from "./components/supportSchedules/SupportSchedules"

const RouteComponent = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to="/home" />} />
            <Route path='home' element={<Home />} />
            <Route path='about' element={<About />} />
            <Route path='login' element={<Login />} />
            <Route path='forgotPass' element={<ForgotPass />} />

            {/* Logged in users route */}
            <Route element={<ProtectedRoute roles={['Customer', 'Admin', 'Support']} />}>
                <Route path='profileUpdate' element={<ProfileUpdate />} />
            </Route>
            {/* Routes that should be wrapped by the SideBar component */}
            <Route element={<SideBar />}>
                <Route element={<ProtectedRoute roles={['Admin', 'Support', 'Customer']} />}>
                    <Route path='dashboard' element={<Dashboard />} />
                    <Route path='changePassword' element={<ChangePassword />} />
                    <Route path='tickets' element={<Tickets />} />
                    <Route path='createTicket' element={<CreateTicket />} />
                    <Route path='ticket/:code' element={<Ticket />} />
                </Route>
                <Route element={<ProtectedRoute roles={['Admin', 'Support']} />}>
                </Route>
                <Route element={<ProtectedRoute roles={['Admin']} />}>
                    <Route path='adminDashboard' element={<AdminDashboard />} />
                    <Route path='emailTemplates' element={<EmailTemplates />} />
                    <Route path='organizations' element={<Organizations />} />
                    <Route path='projects' element={<Projects />} />
                    <Route path='topics' element={<Topics />} />
                    <Route path='SupportTeams' element={<SupportTeams />} />
                    <Route path='supportTeamSchedule' element={<SupportTeamSchedules />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default RouteComponent;
