import { Route, Routes, Navigate } from "react-router-dom";
import Home from './page/home';
import About from './page/about';
import LogReg from "./page/loginreg";
import Signup from "./page/signup";
import Slider from "./layout/slider";
import ForgotPass from "./page/forgatePass";
import Dashboard from "./page/dashboard";
import AdminDashboard from "./page/AdminDashboard";
import Supportdashboard from "./page/supportdashboard";
import SupportForm from "./component/supportform";
import ProjectListOrgwise from "./component/projectlistorgwise";
// import Organization from "./component/organizationlist";
import SideBar from "./component/SideBar";
import Organizations from "./component/organizations/Organizations";
import Projects from "./component/projects/Projects";
import Topics from "./component/topics/Topics";
import EmailTemplates from "./component/emails/EmailTemplates";

const RouteComponent = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to="/home" />} />
            <Route path='/home' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/loginreg' element={<LogReg />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/slider' element={<Slider />} />
            <Route path='/forgotpass' element={<ForgotPass />} />

            {/* Routes that should be wrapped by the SideBar component */}
            <Route path='dashboard' element={<SideBar />}>
                {/* <Route index element={<Dashboard />} /> */}
                <Route path='emailTemplates' element={<EmailTemplates />} />
                <Route path='organizations' element={<Organizations />} />
                <Route path='projects' element={<Projects />} />
                <Route path='topics' element={<Topics />} />
                <Route path='adminDashboard' element={<AdminDashboard />} />
                <Route path='supportdashboard' element={<Supportdashboard />} />
                <Route path='supportform' element={<SupportForm />} />
                <Route path='projectlistorgwise/:id' element={<ProjectListOrgwise />} />
            </Route>
        </Routes>
    );
};

export default RouteComponent;
