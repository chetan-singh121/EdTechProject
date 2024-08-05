import React from 'react'
import { useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn';

export default function RenderTotalAmount() {
    const{total,cart} =useSelector((state)=>state.cart);

    function handleBuyCourse()
    {
        //ye payment pr hoga. TODO:-> API integrate --> payment gateway tak leke jaegi
        //abhi ke liye to hardcore kr diya.
         const courses=cart.map((course)=>course._id);
         


         console.log("Bought these course: ",courses);

    }

  return (
    <div>
        <p>Total:</p>
        <p>Rs {total}</p>

        <IconBtn text="Buy Now" onclick={handleBuyCourse} customClasses={"w-full justify-center"}/>

    </div>
  )
}
