import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {createSection,updateSection} from "../../../../../services/operations/courseDetailsAPI"
import {setCourse,setEditCourse,setStep,} from "../../../../../slices/courseSlice"
import IconBtn from "../../../../common/IconBtn"
import NestedView from "./NestedView"

function CourseBuilderForm() {

  const {register,handleSubmit,setValue,formState:{errors}}=useForm();
  const [editSectionName, setEditSectionName] = useState(null)
  const dispatch = useDispatch()
  const {course}=useSelector((state)=>state.course);
  const[loading ,setLoading]=useState(false);
  const{token}=useSelector((state)=> state.auth);

  const cancelEdit = () => {
    setEditSectionName(null)
    setValue("sectionName", "")
  }

  const goBack=()=>
  {
    dispatch(setStep(1));
    //wapas step 1 par jana mtlb course edit rkna hoga.
    dispatch(setEditCourse(true)); //flag set kia ki course edit kr re ho

  
  }
  const goToNext=()=>
  { 
    //third step pr jabhi jaenge tab atleast 1 section and usme atlear 1 video to ho

    //agar section hi ni daala ho to
    if(course.courseContent.length ===0)
    {
      toast.error("Please add atleast one section");
      return;
    }
    if(course.courseContent.some((section)=>section.subSection.length===0))
    {
      toast.error("Please add atleast one lecture in each section ");
      return;
    }

    //if every thing is good and okay;
    dispatch(setStep(3));


  }

  const onSubmit=async (data)=>
  {
    //jab edit ya create section wala button dabbe. tab ye kaam kro
    setLoading(true);
    let result;

    if (editSectionName) 
    {
      //editing the section name
      result = await updateSection( //updateSection wali api call kri
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      )
      // console.log("edit", result)
    } 
    else 
    {
      result = await createSection( //create section wali api call kri
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      )
    }

    //update values
    if(result)
    {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName","");


    }
    setLoading(false);

    
  }

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit()
      return
    }
    setEditSectionName(sectionId)
    setValue("sectionName", sectionName)
  }

  return (
    <div className='text-white'>
      <p>Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor='sectionName'>Section name <sup>*</sup></label>
          <input
            id='sectionName'
            placeholder='Add Section name'
            {...register("sectionName",{required:true})}
            className='form-style w-full text-black'
          />
          {errors.sectionName && (
            <span className='ml-2 text-xs tracking-wide text-pink-200'>
              Section name is required
            </span>
          )}
        </div>
        <div className="flex items-end gap-x-4">
          <IconBtn
            type="submit"
            disabled={loading}
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

          {/* agr course me kuch hai , tabhi to nested view dikhaoge */}
      {course.courseContent.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}
      {/* Next Prev Button */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
        >
          Back
        </button>
        <IconBtn disabled={loading} text="Next" onclick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  )
}

export default CourseBuilderForm