import React, { useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { motion} from "framer-motion";

function Liked(){

        

    return(
        <motion.div initial={{opacity:0, y: -10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.3}}>
           
        </motion.div>
    );
}

export default Liked
