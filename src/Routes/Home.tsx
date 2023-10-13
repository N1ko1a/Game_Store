import React from "react"
import SideNav from "../Components/SideNav"
import SearchBar from "../Components/SearchBar"

function Home(){
    return (
        <div className=" flex flex-col">
            <SideNav/>
            <SearchBar/>
        </div>
    )
}

export default Home
