import '../css/App.css';
import '../css/Unlocks.css';

import {Palier, World} from "../world";
import {Badge, Button, IconButton, Snackbar} from "@mui/material";
import React, {useState} from "react";

//================================== Unlocks ===================================
type UnlockProps = {
    loadworld : World
}

const url = 'http://localhost:4000/'

export default function Unlocks({ loadworld }: UnlockProps){
    //================================== UseStates ===================================
    const [world, setWorld] = useState(loadworld);

    const [showUnlocks, setShowUnlocks] = useState(true);


    return(
        <div> {showUnlocks &&
            <div className="modal">
                <div>
                    <h1 className="title">Unlocks</h1>
                </div>
                <div className={"liste_unlocks"}>
                    <h2>Unlocks par produit</h2>
                    <div>
                        {world.products.map(prod => {
                            return prod.paliers.map(
                                unlock =>
                                    <div key={unlock.name} className={`${unlock.unlocked ? 'unlock_debloque' : 'unlock_bloque'}`}>
                                        <div className="unlockname">{unlock.name}</div>
                                        <div className="unlock_logo">
                                            <img alt="unlock logo" className="round_unlock" src={url + prod.logo}/>
                                        </div>
                                        <div className="infos_unlock">
                                            { unlock.unlocked ? (<div className={"texte_bloque"}>Débloqué</div> ) : (<div className={"texte_bloque"}>Bloqué</div>)}

                                            <div className="unlockcost">Débloqué au bout de {unlock.seuil} {prod.name}s</div>
                                            <div className="unlockratio"> {unlock.typeratio} : x{unlock.ratio} </div>
                                        </div>
                                    </div>

                            )
                        })}
                    </div>
                </div>
                <div className={"liste_allunlocks"}>
                    <h2>Unlocks de tous les produits</h2>
                    <div>
                        {world.allunlocks.map(
                            all =>
                                <div key={all.name} className={`${all.unlocked ? 'allunlock_debloque' : 'allunlock_bloque'}`}>
                                    <div className="allunlockname"> {all.name} </div>
                                    <div className="allunlock_logo">
                                        <img alt="allunlock logo" className="round_allunlock" src={url + all.logo}/>
                                    </div>
                                    <div className="infos_allunlock">
                                        { all.unlocked ? (<div className={"texte_bloque"}>Débloqué</div> ) : (<div className={"texte_bloque"}>Bloqué</div>)}
                                        <div className="allunlockcost">Débloqué au bout de {all.seuil} instruments</div>
                                        <div className="allunlockratio"> {all.typeratio} : x{all.ratio} </div>
                                    </div>
                                </div>
                        )
                        }
                    </div>

                </div>
            </div>
        }</div>
    )
}