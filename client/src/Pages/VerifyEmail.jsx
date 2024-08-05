import React, { useState,useEffect } from 'react'
import OTPInput from 'react-otp-input';
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import {  useSelector } from "react-redux";
import { sendOtp, signUp } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";


function VerifyEmail() {
    console.log("verify mail pr aaye");
    const{signupData,loading}=useSelector((state)=>state.auth);
    const[otp,setOtp]=useState("");
    const dispatch=useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Only allow access of this route when user has filled the signup form
        if (!signupData) {
            
            console.log("signupData nahi mila",signupData);
          navigate("/signup");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);


    const handleOnSubmit = (e) => {
        e.preventDefault();
        const {
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        } = signupData;

        dispatch(
            signUp(
              accountType,
              firstName,
              lastName,
              email,
              password,
              confirmPassword,
              otp,
              navigate
            )
          );

    }

  return (
    <div className='min-h-[calc(100vh-3.5rem)] grid place-items-center'>

        {
            loading?
            (<div className='spinner'></div>):(
                <div className="max-w-[500px] p-4 lg:p-8">
                    <h1>Verify Email</h1>
                    <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">
                     A Verification code has been sent to you. Enter the code below.
                    </p>
                    <form onSubmit={handleOnSubmit}>
                        <OTPInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderInput={(props)=>(
                                <input 
                                    {...props}
                                    placeholder='-'
                                    style={{
                                        boxShadow:"inset 0px -1px 0px rgba(255,255,255,0.18)"
                                    }}
                                    className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"

                                    />
                                    )}
                                    containerStyle={{
                                        justifyContent: "space-between",
                                        gap: "0 6px",
                                    }}

                            />

                        <button type='submit' className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900">
                            Verify Email
                        </button>
                             
                            

                    </form>
                    <div>
                        <div className="mt-6 flex items-center justify-between">
                          <Link to="/login">
                            <p className="flex items-center gap-x-2 text-richblack-5">
                                <BiArrowBack /> Back To Login
                            </p>
                          </Link>
                        </div>
                        <div>
                        <button
                            className="flex items-center text-blue-100 gap-x-2"
                            onClick={() => dispatch(sendOtp(signupData.email,navigate))}
                            >
                            <RxCountdownTimer />
                            Resend it
                        </button>

                        </div>
                    </div>
                </div>
            )
        }

    </div>
  )
}

export default VerifyEmail