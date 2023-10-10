import React from "react"
import SideNav from "../Components/SideNav"
import SearchBar from "../Components/SearchBar"

function Home(){
    return (
        <div className=" flex justify-around">
            <SearchBar/>
            <SideNav/>
        </div>
    )
}

export default Home
