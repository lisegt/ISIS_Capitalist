import {Palier, World} from "../world";
import {Badge, Button, IconButton, Snackbar} from "@mui/material";
import React, {useState} from "react";
type ManagerProps = {
    loadworld : World
    loadsnackBarUnlocks : boolean;
}

const url = 'http://localhost:4000/'

export default function Unlocks({ loadworld, loadsnackBarUnlocks }: ManagerProps){

    const [world, setWorld] = useState(loadworld);
    //Copie du monde pour mettre à jour le useState
    const newWorld = {...world};
    const [showUnlocks, setShowUnlocks] = useState(true);
    const [snackBarUnlocks, setSnackBarUnlocks] = useState(loadsnackBarUnlocks);


    return(
        <div> {showUnlocks &&
            <div className="modal">
                <div>
                    <h1 className="title">Unlocks</h1>
                </div>
                <div>
                    <h2>Unlocks par produit</h2>
                    {world.products.map(prod => {
                        return prod.paliers.filter( unlock => !unlock.unlocked).map(
                        unlock =>
                            <div key={unlock.name} className="unlockgrid">
                                <div>
                                    <div className="logo">
                                        <img alt="unlock logo" className="round" src={url +
                                            prod.logo}/>
                                    </div>
                                </div>
                                <div className="infosunlock">
                                    <div className="unlockproduct">{prod.name}</div>
                                    <div className="unlockname"> {unlock.name} </div>
                                    <div className="unlockcost"> {unlock.seuil} </div>
                                    <div className="unlockratio"> {unlock.typeratio} : x{unlock.ratio} </div>
                                </div>
                            </div>

                    )
                    })}

                </div>
                <div>
                    <h2>Unlocks de tous les produits</h2>
                    {world.allunlocks.filter( all => !all.unlocked).map(
                        all =>
                            <div key={all.name} className="unlockgrid">
                                <div>
                                    <div className="logo">
                                        <img alt="unlock logo" className="round" src={url +
                                            all.logo}/>
                                    </div>
                                </div>
                                <div className="infosunlock">
                                    <div className="unlockname"> {all.name} </div>
                                    <div className="unlockcost"> {all.seuil} </div>
                                    <div className="unlockratio"> {all.typeratio} : x{all.ratio} </div>
                                </div>
                            </div>

                    )
                    }


                </div>
            </div>
        }</div>
    )
}