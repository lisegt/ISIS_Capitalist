import {Palier, World} from "../world";
import {Badge, Button, IconButton, Snackbar} from "@mui/material";
import React, {useState} from "react";
type ManagerProps = {
    loadworld : World
    onManagerHired : (manager:Palier)=>void;
    loadsnackBarOpen : boolean;
    //buyManagerPossible : (manager:Palier[])=>number;
    //loadnbManagersCanBuy: number;
    updateNbManagerCanBuy : ()=>void;
}
function CloseIcon(props: { fontSize: string }) {
    return null;
}
export default function Manager({ loadworld, onManagerHired, loadsnackBarOpen,updateNbManagerCanBuy }: ManagerProps){
    const [showManagers, setShowManagers] = useState(true);
    const [world, setWorld] = useState(loadworld);
    const newWorld = {...world};
    const [snackBarOpen, setSnackBarOpen] = useState(loadsnackBarOpen);
    //const [NbManagersCanBuy, setNbManagersCanBuy] = useState(loadnbManagersCanBuy);


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
                <Snackbar
                    open={snackBarOpen}
                    autoHideDuration={5000}
                    message="Nouveau manager embauché !"
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="secondary"
                            onClick={() => setSnackBarOpen(false)}
                            style={{backgroundColor: 'red'}}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                />
            </div>
        }</div>
    )
}