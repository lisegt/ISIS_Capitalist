import {Palier, World} from "../world";
import {Button} from "@mui/material";
import {useState} from "react";

type ManagerProps = {
    manager : Palier
}
export default function Manager({ manager}: ManagerProps){
    const [showManagers, setShowManagers] = useState(true);
    let world = require("./world")

    function hireManager(manager:Palier){

    }
    return(
        <div> {showManagers &&
            <div className="modal">
                <div>
                    <h1 className="title">Managers make you feel better !</h1>
                </div>
                <div>
                    {
                        world.managers.palier.filter( (manager: Palier) => !manager.unlocked).map(
                        (manager : Palier) => {
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
                                        world.products.product[manager.idcible - 1].name} </div>
                                    <div className="managercost"> {manager.seuil} </div>
                                </div>
                                <div onClick={() => hireManager(manager)}>
                                    <Button disabled={world.money < manager.seuil}>
                                        Hire !</Button>
                                </div>
                            </div>
                        }
                    )
                    }

                </div>
            </div>
        }</div>
    )
}