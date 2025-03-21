"use client";

// import {motion} from "motion/react";

export const SubscribeCard = () => {
    return (

        <div className="bg-black border-white border-[1px] p-8 rounded-xl flex flex-col items-center gap-6 transition-transform transform hover:scale-105 hover:translate-y-2 hover:contrast-110 hover:shadow-xl hover:shadow-cyan-400/50">
            <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500 text-center">
                Subscribe to never miss a post!
            </h1>
            <input
                type="email"
                id="emailInput"
                className="w-3/4 md:w-2/3 p-3 rounded-lg text-black text-center border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="example@example.com"
            />
            <button
                type="button"
                onClick={buttonClick}
                className="w-2/3 md:w-1/3 p-3 rounded-lg text-white text-center bg-gradient-to-br from-cyan-400 to-pink-500 hover:bg-gradient-to-bl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
                Join!
            </button>
        </div>

    );
}


function buttonClick(){
    const emailElement = document.getElementById("emailInput")! as HTMLInputElement;
    console.log(emailElement.value)
}
