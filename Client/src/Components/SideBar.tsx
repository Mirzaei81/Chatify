import React from "react"
import { IoSearch } from "react-icons/io5";

export default function sideBar(){
    return(
        <div className="flex flex-row bg-eerie_black-300">
          <div className="">
          <input placeholder="Search">
            <IoSearch/>
            </input>
            <div className="rounded-md"></div>     
          </div>
        </div>
    )

}
