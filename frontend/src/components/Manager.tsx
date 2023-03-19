import {Palier, World} from "../world";
import {Badge, Button, IconButton, Snackbar} from "@mui/material";
import React, {useState} from "react";
type ManagerProps = {
    loadworld : World
    loadsnackBarManagers : boolean;
    onManagerHired : (manager:Palier)=>void;
    updateNbManagerCanBuy : ()=>void;
}

const url = 'http://localhost:4000/'

export default function Manager({ loadworld, onManagerHired, loadsnackBarManagers,updateNbManagerCanBuy }: ManagerProps){

    const [world, setWorld] = useState(loadworld);
    //Copie du monde pour mettre à jour le useState
    const newWorld = {...world};
    const [showManagers, setShowManagers] = useState(true);
    const [snackBarManagers, setSnackBarManagers] = useState(loadsnackBarManagers);


    return(
        <div> {showManagers &&
            <div className="modal">
                <div>
                    <h1 className="title">Engagez des managers !</h1>
                </div>
                <div className={"liste_managers"}>
                    {world.managers.filter( manager => !manager.unlocked).map(
                        manager =>
                            <div key={manager.idcible} className="manager">
                                <div className="manager_logo">
                                    <img alt="manager logo" className="round_manager" src={url + manager.logo}/>
                                </div>
                                <div className="infos_manager">
                                    <div className="managername"> {manager.name} </div>
                                    <div className="managercible"> Automatise les {
                                        world.products[manager.idcible - 1].name}s</div>
                                    <div className="managercost">{manager.seuil} € </div>
                                </div>
                                <div className={"div_acheterManager"}>
                                    <button className={"btn_acheterManager"} onClick={() => {onManagerHired(manager); updateNbManagerCanBuy()}}
                                            disabled={world.money < manager.seuil || world.products[manager.idcible-1].quantite == 0}>
                                        ENGAGER ! </button>
                                </div>
                            </div>

                    )
                    }


                </div>
            </div>
        }</div>
    )
}