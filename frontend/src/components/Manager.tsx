import {Palier, World} from "../world";
import {Badge, Button, IconButton, Snackbar} from "@mui/material";
import React, {useState} from "react";
type ManagerProps = {
    loadworld : World
    loadsnackBarOpen : boolean;
    onManagerHired : (manager:Palier)=>void;
    updateNbManagerCanBuy : ()=>void;
}

export default function Manager({ loadworld, onManagerHired, loadsnackBarOpen,updateNbManagerCanBuy }: ManagerProps){

    const [world, setWorld] = useState(loadworld);
    //Copie du monde pour mettre à jour le useState
    const newWorld = {...world};
    const [showManagers, setShowManagers] = useState(true);
    const [snackBarOpen, setSnackBarOpen] = useState(loadsnackBarOpen);


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
                                <div>
                                    <Button onClick={() => {onManagerHired(manager); updateNbManagerCanBuy()}}
                                            disabled={world.money < manager.seuil || world.products[manager.idcible-1].quantite == 0}>
                                        Hire ! </Button>
                                </div>
                            </div>

                    )
                    }


                </div>
            </div>
        }</div>
    )
}