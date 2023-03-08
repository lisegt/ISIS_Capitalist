import {Palier, World} from "../world";
import {Button} from "@mui/material";
import React, {useState} from "react";

type ManagerProps = {
    loadworld : World
}
export default function Manager({ loadworld}: ManagerProps){
    const [showManagers, setShowManagers] = useState(true);
    //let world = require("../world")
    const [world, setWorld] = useState(loadworld);

    function hireManager(manager:Palier){

    }
    return(
        <div> {showManagers &&
            <div className="modal">
                <div>
                    <h1 className="title">Managers make you feel better !</h1>
                </div>
                <div>
                    {world.managers.filter( manager => !manager.unlocked).map(
                        manager =>
                            <div key={manager.idcible} className="managergrid">
                                <div>
                                    <div className="logo">
                                        <img alt="manager logo" className="round" src={
                                            manager.logo}/>
                                    </div>
                                </div>
                                <div className="infosmanager">
                                    <div className="managername"> {manager.name} </div>
                                    <div className="managercible"> {
                                        world.products[manager.idcible - 1].name} </div>
                                    <div className="managercost"> {manager.seuil} </div>
                                </div>
                                <div onClick={() => hireManager(manager)}>
                                    <Button disabled={world.money < manager.seuil}>
                                        Hire !</Button>
                                </div>
                            </div>

                    )
                    }


                </div>
            </div>
        }</div>
    )
}