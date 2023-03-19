import {Palier, World} from "../world";
import {Badge, Button, IconButton, Snackbar} from "@mui/material";
import React, {useState} from "react";
type AngeProps = {
    loadworld : World
    loadsnackBarAngelUpgrades : boolean;
    onAngelUpgradeBuy : (ange : Palier)=>void;
    updateNbAngelUpgradeCanBuy : ()=>void;


}

const url = 'http://localhost:4000/'

export default function Ange({ loadworld, onAngelUpgradeBuy, loadsnackBarAngelUpgrades,updateNbAngelUpgradeCanBuy }: AngeProps){

    const [world, setWorld] = useState(loadworld);
    //Copie du monde pour mettre à jour le useState
    const newWorld = {...world};
    const [showAnges, setShowAnges] = useState(true);
    const [snackBarAnges, setSnackBarAnges] = useState(loadsnackBarAngelUpgrades);


    return(
        <div> {showAnges &&
            <div className="modal">
                <div>
                    <h1 className="title">Angel Upgrades</h1>
                </div>
                <div className={"liste_upgrades"}>
                    {world.angelupgrades.filter( angelupgrade => !angelupgrade.unlocked).map(
                        angelupgrade =>
                            <div key={angelupgrade.idcible} className="angelupgrade">
                                <div className="angelupgradename"> {angelupgrade.name} </div>
                                <div className="angelupgrade_logo">
                                    <img alt="angelupgrade logo" className="round_angelupgrade" src={url + angelupgrade.logo}/>
                                </div>
                                <div className="infos_angelupgrade">
                                    <div className="angelupgradecible">
                                        {((angelupgrade.idcible)==0) ? (
                                                <p>Upgrade d'ange appliqué sur les tous les produits</p>
                                            ) : ((angelupgrade.idcible)==-1) ? (
                                                <p>Upgrade d'ange appliqué sur le bonus des anges</p>
                                            ) : (
                                                <p>Upgrade d'ange appliqué sur les {world.products[angelupgrade.idcible - 1].name}s</p>
                                            )
                                        }
                                    </div>
                                    <div className="angelupgradecost">Coût : {angelupgrade.seuil} €</div>
                                    <div className="angelupgraderatio"> {angelupgrade.typeratio} : x{angelupgrade.ratio} </div>

                                </div>
                                <div className={"div_acheterAngelupgrade"}>
                                    <button className={"btn_acheterAngelupgrade"}  onClick={() => {onAngelUpgradeBuy(angelupgrade); updateNbAngelUpgradeCanBuy()}}
                                            disabled={world.activeangels < angelupgrade.seuil || world.products[angelupgrade.idcible-1].quantite == 0}>
                                        ACHETER ! </button>
                                </div>
                            </div>
                    )
                    }

                </div>
            </div>
        }</div>
    )
}