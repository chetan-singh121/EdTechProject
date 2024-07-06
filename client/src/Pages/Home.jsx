
import React from 'react'
import {FaArrowRight} from 'react-icons/fa'
import {Link} from 'react-router-dom'
function Home()
{
    return(
        <div>
        {/* section1 */}
        <div className='relative mx-auto flex flex-col w-11/12 items-center text-white
        justify-between'>
            <Link to={"/singnup"}>
                <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
                transition-all duration-200 hover:scale-95'>
                    <div className='flex items-center gap-2 rounded-full px-10 py-[5px]
                    group-hover:bg-richblack-900'>
                        <p>Become an Instructor</p>
                        <FaArrowRight/>
                    </div>
                </div>

            </Link>
        </div>
        {/* section 2 */}
        {/* section 3 */}
        {/* footer last section 4 */}

        </div>
    );

}
export default Home;