import React from "react"
import SideNav from "../Components/SideNav"
import SearchBar from "../Components/SearchBar"
import OtherOptions from "../Components/OtherOptions"

function Home(){
    return (
        <div className=" flex flex-row justify-evenly">
                <SideNav/>
                <SearchBar/>
                <OtherOptions/>
        </div>

    )
}

export default Home
