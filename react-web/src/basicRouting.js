import { Route, Routes, Navigate } from "react-router-dom";
import Home from './page/home';
import About from './page/about';
import Login from "./page/Login";
import Signup from "./page/signup";
import Slider from "./layout/slider";
import ForgotPass from "./page/forgotPass";
import Dashboard from "./page/dashboard";
import AdminDashboard from "./page/admindashboard";
import Supportdashboard from "./page/supportdashboard";
import SupportForm from "./component/supportform";
import ProjectListOrgwise from "./component/projectlistorgwise";
import SideBar from "./component/SideBar";
import Organizations from "./component/organizations/Organizations";
import Projects from "./component/projects/Projects";
import Topics from "./component/topics/Topics";
import EmailTemplates from "./component/emails/EmailTemplates";
import ProtectedRoute from "./component/ProtectedRoute";

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

            {/* Routes that should be wrapped by the SideBar component */}
            <Route path='dashboard' element={<SideBar />}>
                <Route index element={<Dashboard />} />
                <Route element={<ProtectedRoute roles={['Admin']} />}>
                    <Route path='adminDashboard' element={<AdminDashboard />} />
                    <Route path='emailTemplates' element={<EmailTemplates />} />
                    <Route path='organizations' element={<Organizations />} />
                    <Route path='projects' element={<Projects />} />
                    <Route path='topics' element={<Topics />} />
                </Route>
                <Route element={<ProtectedRoute roles={['Support']} />}>
                    <Route path='supportdashboard' element={<Supportdashboard />} />
                    <Route path='supportform' element={<SupportForm />} />
                </Route>
                <Route element={<ProtectedRoute roles={['Customer', 'Admin', 'Support']} />}>
                    {/* <Route path='organizations' element={<Organizations />} /> */}
                    
                    <Route path='projectlistorgwise/:id' element={<ProjectListOrgwise />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default RouteComponent;
