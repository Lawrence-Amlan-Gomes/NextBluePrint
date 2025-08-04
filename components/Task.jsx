"use client";

import { useTask } from "@/app/hooks/useTask";
import { useTheme } from "@/app/hooks/useTheme";
import { Flamenco } from "next/font/google";
import { useEffect, useState } from "react";

export default function Task({ name, time, day, id, color }) {
  const { theme } = useTheme();
  const [isborder, setisborder] = useState(true)
  const { task, setTask, setClicked, clicked } = useTask();
  useEffect(()=>{
    if(task.day == day && clicked){
      if(task.id == id){
        setisborder(true)
      }else{
        setisborder(false)
      }
    }else{
      setisborder(false)
    }
  },[clicked, day, id, name, task.day, task.id, task.name, task.time, time])
  return (
    <div
      onClick={() =>{
        setTask({ name: name, time: time, day: day, id:id })
        setClicked(true)
      } }
      className={`${isborder ? theme ? "bg-[#000000] text-white" : "bg-[#ffffff] text-black" : `${color} text-white`} cursor-pointer w-[98%] h-[30px] float-left rounded-lg m-[1%] text-start p-1 font-normal text-[14px] overflow-hidden scrollbar-none`}
    >
      <div className="w-[55%] h-full float-left px-1 mr-[5%] overflow-hidden">{name}</div>
      <div className="w-[40%] h-full overflow-hidden text-end pr-2 text-[12px] mt-[2px]">{time}</div>
    </div>
  );
}
