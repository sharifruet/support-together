import { Route, Routes } from "react-router-dom";
import Home from './page/home';
import About from './page/about';
import LogReg from "./page/loginreg";
import Signup from "./page/signup";
import Slider from "./layout/slider";
import ForgotPass from "./page/forgatePass";
import Dashboard from "./page/dashboard";
import SupportForm from "./component/supportform";
const RouteComponent = () =>{
    return(
        <div>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/Home' element={<Home/>}/>
                <Route path='/about' element={<About/>}/>
                <Route path='/loginreg' element={<LogReg/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/Slider' element={<Slider/>}/>
                <Route path='/ForgotPass' element={<ForgotPass/>}/>
                <Route path='/Dashboard' element={<Dashboard/>}/>
                <Route path='/SupportForm' element={<SupportForm/>}/>
            </Routes>
        </div>
    )
}
export default RouteComponent