 import React, { useEffect } from 'react'
 import logo from "../../assets/Logo/Logo-Full-Light.png"
 import { Link, matchPath } from 'react-router-dom'
 import {NavbarLinks} from "../../data/navbar-links"
 import { useLocation } from 'react-router-dom'
 import { useSelector } from 'react-redux'
 import { AiOutlineShoppingCart,AiOutlineMenu } from 'react-icons/ai'
 import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiConnector'
import { categories } from '../../services/apis'
import { useState } from 'react'
import { IoIosArrowDropdownCircle } from 'react-icons/io'
import { BsChevronDown } from 'react-icons/bs'

// const subLinks=[
//     {
//         title:"python",
//         link:"/catalog/python"

//     },
//     {
//         title:"web dev",
//         link:"/catalog/web-devlopment"

//     }
// ]
 
 function Navbar() {
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const { totalItems } = useSelector((state) => state.cart)
    const location=useLocation();



    //api call
    const [subLinks, setSubLinks]=useState([]);
    const [loading,setLoading]=useState(false);

    const fetchSubLinks= async()=>
    {
        setLoading(true);
        try{
            
            const result=await apiConnector("GET",categories.CATEGORIES_API);
            console.log("printing sublinks result:",result);
            console.log("result -> data->data",result.data.data);
            setSubLinks(result.data.data);
            console.log("sublink = ",subLinks);
            console.log("sublink length=",subLinks.length);
            

        }
        catch(error)
        {
            console.log("could not fetch category list, error=",error);
        }
        setLoading(false);
        
    }

    useEffect(()=>
    {
         fetchSubLinks();

    },[])

    useEffect(() => {
        console.log("ue sublinks updated:", subLinks);
        console.log("ue sublink length:", subLinks.length);
    }, [subLinks]);
  

    



    const matchRoute=(route)=>
    {
        return matchPath({path:route},location.pathname);
    }
   return (
     <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 '>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between '>
        {/* image */}
        <Link to ="/">
            <img src={logo} width={160} height={42} loading='lazy'/>
        </Link>

        {/* nav links */}
        <nav>
            <ul className='flex gap-x-6 text-richblack-25'>
            {
                NavbarLinks.map((link,index)=>
                {
                    return <li key={index}>
                    {
                        link.title==="Catalog"?(
                            <div className='relative flex cursor-pointer items-center gap-2 group'>
                                <p>{link.title}</p>
                                <BsChevronDown/>

                                <div className='invisible absolute left-[50%] top-[50%]
                                translate-x-[-50%] translate-y-[10%]
                                z-[10000] 
                                flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                                opacity-0 transition-all duration-200 group-hover:visible
                                group-hover:opacity-100 lg:w-[300px]'>
                                    {/* diamond shape */}
                                    <div className='absolute left-[50%] top-0 h-4 w-4 rotate-45
                                    bg-richblack-5  translate-y-[-40%] translate-x-[150%]'>
                                    </div>

                                   
                                    {loading ? (<p className="text-center">Loading...</p> ) 
                                             : (subLinks) ? (
                                                <>
                                                    
                                                    {subLinks?.map((subLink, i) => (
                                                        <Link
                                                            to={`/catalog/${subLink.name
                                                                .split(" ")
                                                                .join("-")
                                                                .toLowerCase()}`}
                                                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50 text-black"
                                                            key={i}
                                                        >
                                                            <p>{subLink.name}</p>
                                                        </Link>
                                                    ))}
                                                </>
                                        ) : (
                                        <p className="text-center">No Courses Found</p>
                                    )}


                                </div>


                            </div>):(
                            <Link to={link?.path}>
                            <p className={`${matchRoute(link?.path)?"text-yellow-25":"text-richblack-25"}`}>
                                {link.title}
                            </p>

                            </Link>
                        )
                    }
                         
                    </li>

                })
                
            }

            </ul>
        </nav>

        {/* login/singup/dashboard */}
        <div className='flex gap-x-4 items-center'>
            {
                user && user?.accountType!="Instructor" && (
                    <Link to="/dashboard/cart" className='relative'>
                        <AiOutlineShoppingCart/>
                        {
                            totalItems>0 && (
                                <span>
                                    {totalItems}
                                </span>
                            )
                        }

                    </Link>
                )
            }
            {
                token===null && (
                    <Link to="/login">
                        <button className='border border-richblack-700 bg-richblack-800
                        px-[12px] py-[8px] text-richblack-100 rounded-md'>
                            Log in
                        </button>
                    </Link>
                )
            }
            {
                token===null && (
                    <Link to="/signup">
                        <button className='border border-richblack-700 bg-richblack-800
                        px-[12px] py-[8px] text-richblack-100 rounded-md'>
                        Sign up
                        </button>
                    </Link>
                )
            }
            {
                token!==null && <ProfileDropDown/>

            }
        </div>
        <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>



      </div>
    </div>
   )
 }
 
 export default Navbar