import '../css/App.css';
import '../css/AngelUpgrades.css';
import {Palier, World} from "../world";
import {Badge, Button, IconButton, Snackbar} from "@mui/material";
import React, {useState} from "react";

//================================== Angel Upgrades ===================================
type AngelUpgradeProps = {
    loadworld : World
    onAngelUpgradeBuy : (ange : Palier)=>void;
    updateNbAngelUpgradeCanBuy : ()=>void;

}

const url = 'http://localhost:4000/'

export default function AngelUpgrade({ loadworld, onAngelUpgradeBuy,updateNbAngelUpgradeCanBuy }: AngelUpgradeProps){
    //================================== UseStates ===================================
    const [world, setWorld] = useState(loadworld);

    const [showAnges, setShowAnges] = useState(true);


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
                                    <div className="angelupgradecost">Coût : {angelupgrade.seuil} anges</div>
                                    <div className="angelupgraderatio"> {angelupgrade.typeratio} : x{angelupgrade.ratio} </div>

                                </div>
                                <div className={"div_acheterAngelupgrade"}>
                                    {((angelupgrade.idcible)<=0) ? (
                                        <button className={"btn_acheterAngelupgrade"}  onClick={() => {onAngelUpgradeBuy(angelupgrade); updateNbAngelUpgradeCanBuy()}}
                                                disabled={world.activeangels < angelupgrade.seuil}>
                                            ACHETER ! </button>
                                    ) : (
                                        <button className={"btn_acheterAngelupgrade"}  onClick={() => {onAngelUpgradeBuy(angelupgrade); updateNbAngelUpgradeCanBuy()}}
                                                disabled={world.activeangels < angelupgrade.seuil || world.products[angelupgrade.idcible-1].quantite == 0}>
                                            ACHETER ! </button>
                                    )
                                    }

                                </div>
                            </div>
                    )
                    }

                </div>
            </div>
        }</div>
    )
}