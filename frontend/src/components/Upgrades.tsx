import '../css/App.css';
import '../css/Upgrades.css';

import {Palier, World} from "../world";
import {Badge, Button, IconButton, Snackbar} from "@mui/material";
import React, {useState} from "react";

//================================== Upgrades ===================================
type UpgradeProps = {
    loadworld : World
    onUpgradeBuy : (upgrade : Palier)=>void;
    updateNbUpgradeCanBuy : ()=>void;
}

const url = 'http://localhost:4000/'

export default function Upgrade({ loadworld, onUpgradeBuy,updateNbUpgradeCanBuy }: UpgradeProps){
    //================================== UseStates ===================================
    const [world, setWorld] = useState(loadworld);

    const [showUpgrades, setShowUpgrades] = useState(true);


    return(
        <div> {showUpgrades &&
            <div className="modal">
                <div>
                    <h1 className="title">Upgrades</h1>
                </div>
                <div className={"liste_upgrades"}>
                    {world.upgrades.filter( upgrade => !upgrade.unlocked).map(
                        upgrade =>
                            <div key={upgrade.name} className="upgrade">
                                <div className="upgradename"> {upgrade.name} </div>
                                <div className="upgrade_logo">
                                    <img alt="upgrade logo" className="round_upgrade" src={url + upgrade.logo}/>
                                </div>
                                <div className="infos_upgrade">
                                    <div className="upgradecible">Upgrade appliqué sur les {world.products[upgrade.idcible - 1].name}s</div>
                                    <div className="upgradecost">Coût : {upgrade.seuil} €</div>
                                    <div className="upgraderatio"> {upgrade.typeratio} : x{upgrade.ratio} </div>

                                </div>
                                <div className={"div_acheterUpgrade"}>
                                    <button className={"btn_acheterUpgrade"}  onClick={() => {onUpgradeBuy(upgrade); updateNbUpgradeCanBuy()}}
                                            disabled={world.money < upgrade.seuil || world.products[upgrade.idcible-1].quantite == 0}>
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