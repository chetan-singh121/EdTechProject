import "./App.css";
import {Route,Routes, useNavigate} from "react-router-dom"
import Home from "./Pages/Home";
import Navbar from './components/common/Navbar'
import OpenRoute from "./components/core/Auth/OpenRoute"
import Login from "./Pages/Login"
import Signup from "./Pages/Signup"
import ForgotPassword from "./Pages/ForgotPassword";
import UpdatePassword from "./Pages/UpdatePassword";
import VerifyEmail from "./Pages/VerifyEmail";
import About from "./Pages/About"
import Contact from "./Pages/Contact";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from "./Pages/Error";
import Settings from "./components/core/Dashboard/Settings";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart/index"
import { ACCOUNT_TYPE } from "./utils/constants";
import { useDispatch, useSelector } from "react-redux";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";




function App() {

  const dispatch=useDispatch();
  const navigate=useNavigate();
  const{user}=useSelector((state)=> state.profile);
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex
    flex-col font-inter">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="about" element={ <About/>} />
        <Route path="contact" element={<Contact />} />


        <Route path="login" element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route path="signup" element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route path="forgot-password" element={
            <OpenRoute>
              <ForgotPassword/>
            </OpenRoute>
          }
        />

        <Route path="verify-email" element={
            <OpenRoute>
              <VerifyEmail/>
            </OpenRoute>
          }
        />
        
        <Route path="update-password/:id" element={
            <OpenRoute>
              <UpdatePassword/>
            </OpenRoute>
          }
        />

        <Route  element={
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile/>}/>
          <Route path="dashboard/Settings" element={<Settings />} />
          {
            user?.accountType===ACCOUNT_TYPE.STUDENT &&(
              <>
              <Route path="dashboard/enrolled-courses" element={<EnrolledCourses/>} />
              <Route path="dashboard/cart" element={<Cart/>} />

              </>
            )
          }
          {
            user?.accountType===ACCOUNT_TYPE.INSTRUCTOR &&(
              <>
              <Route path="dashboard/add-course" element={<AddCourse/>} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />


              {/* <Route path="dashboard/cart" element={<Cart/>} /> */}


              </>
            )
          }
          




        </Route>
        <Route path="*" element={<Error/>}/>

      </Routes>



    </div>
  );
}

export default App;
