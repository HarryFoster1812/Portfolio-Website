"use client";

import {motion} from "motion/react";

export const SubscribeCard = () => {
    return (
            <div className="bg-black border-white border-[1px] p-5 rounded-xl flex justify-center items-center flex-col gap-[10px] hover:scale-[1.1] hover:translate-y-[10px] hover:contrast-[1.2] hover:shadow-[0_15px_40px_rgba(0,_255,_255,_0.5)] ">
            <h1 className="md:text-3xl text-xl text-wrap bg-clip-text font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-500">Subscribe to never miss a post!</h1>
            <input type="email" id="emailInput" className="w-2/3 rounded text-center text-black" placeholder="example@example.com"/>
            <button type="email" onClick={buttonClick} className="w-1/3 rounded text-center  bg-gradient-to-br from-cyan-400 to-pink-500">Join!</button>
        </div>
    );
}


function buttonClick(){
    const emailElement = document.getElementById("emailInput");
    console.log(emailElement.value)
}
