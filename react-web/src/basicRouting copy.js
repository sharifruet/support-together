import { Route, Routes } from "react-router-dom";
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
import Organization from "./component/organizationlist";
import SideBar from "./component/SideBar";

const RouteComponent = (ctx) => {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/Home' element={<Home />} />
                <Route path='/about' element={<About />} />
                <Route path='/loginreg' element={<LogReg />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/Slider' element={<Slider />} />
                <Route path='/ForgotPass' element={<ForgotPass />} />
                <Route path='/Dashboard' element={<Dashboard />} />
                <Route path="dashboard" element={<SideBar />}>

                    <Route path='/dashboard/organization' element={<Organization />} />
                    <Route path='/dashboard/AdminDashboard' element={<AdminDashboard />} />
                </Route>
                <Route path='/Supportdashboard' element={<Supportdashboard />} />
                <Route path='/SupportForm' element={<SupportForm />} />
                <Route path='/ProjectListOrgwise/:id' element={<ProjectListOrgwise />} />
            </Routes>
        </div>
    )
}
export default RouteComponent