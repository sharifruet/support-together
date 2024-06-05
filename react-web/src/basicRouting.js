import { Route, Routes, Navigate } from "react-router-dom";
import Home from './page/home';
import About from './page/about';
import Login from "./page/Login";
import Signup from "./page/signup";
import Slider from "./layout/slider";
import ForgotPass from "./page/forgotPass";
import Dashboard from "./page/Dashboard";
import AdminDashboard from "./page/admindashboard";
import Supportdashboard from "./page/supportdashboard";
import SupportForm from "./components/supportform";
import ProjectListOrgwise from "./components/projectlistorgwise";
import SideBar from "./components/SideBar";
import Organizations from "./components/organizations/Organizations";
import Projects from "./components/projects/Projects";
import Topics from "./components/topics/Topics";
import Supportteam from "./components/supportteam/Supportteam";
import EmailTemplates from "./components/emails/EmailTemplates";
import ProtectedRoute from "./components/ProtectedRoute";
import ChangePassword from "./page/ChangePassword";
import Tickets from "./components/tickets/Tickets";
import Ticket from "./page/Ticket";
import ProfileUpdate from "./page/ProfileUpdate";
import CreateTicket from "./components/tickets/CreateTicket";

const RouteComponent = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to="/home" />} />
            <Route path='/home' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/slider' element={<Slider />} />
            <Route path='forgotPass' element={<ForgotPass />} />
            <Route path='/ticket/:code' element={<Ticket/>} />
           

            {/* Routes that should be wrapped by the SideBar component */}
            <Route element={<ProtectedRoute roles={['Customer', 'Admin', 'Support']} />}>
                <Route path='profileUpdate' element={<ProfileUpdate />} />
            </Route>
            <Route path='dashboard' element={<SideBar />}>
                <Route index element={<Dashboard />} />
                <Route path='changePassword' element={<ChangePassword />} />
                <Route path='tickets' element={<Tickets />} />
                <Route path='createTicket' element={<CreateTicket />} />

                <Route element={<ProtectedRoute roles={['Admin']} />}>
                    <Route path='adminDashboard' element={<AdminDashboard />} />
                    <Route path='emailTemplates' element={<EmailTemplates />} />
                    <Route path='organizations' element={<Organizations />} />
                    <Route path='projects' element={<Projects />} />
                    <Route path='topics' element={<Topics />} />
                    <Route path='supportteam' element={<Supportteam />} />
                </Route>
                <Route element={<ProtectedRoute roles={['Support']} />}>
                    <Route path='supportdashboard' element={<Supportdashboard />} />
                    <Route path='supportform' element={<SupportForm />} />
                </Route>
                <Route element={<ProtectedRoute roles={['Customer', 'Admin', 'Support']} />}>
                    <Route path='projectlistorgwise/:id' element={<ProjectListOrgwise />} />
                    
                </Route>
            </Route>
        </Routes>
    );
};

export default RouteComponent;
