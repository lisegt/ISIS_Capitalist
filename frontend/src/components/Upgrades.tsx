import {Palier, World} from "../world";
import {Badge, Button, IconButton, Snackbar} from "@mui/material";
import React, {useState} from "react";
type ManagerProps = {
    loadworld : World
    loadsnackBarUpgrades : boolean;
    onUpgradeBuy : (upgrade : Palier)=>void;
    updateNbUpgradeCanBuy : ()=>void;
}

const url = 'http://localhost:4000/'

export default function Upgrade({ loadworld, onUpgradeBuy, loadsnackBarUpgrades,updateNbUpgradeCanBuy }: ManagerProps){

    const [world, setWorld] = useState(loadworld);
    //Copie du monde pour mettre à jour le useState
    const newWorld = {...world};
    const [showUpgrades, setShowUpgrades] = useState(true);
    const [snackBarUpgrades, setSnackBarUpgrades] = useState(loadsnackBarUpgrades);


    return(
        <div> {showUpgrades &&
            <div className="modal">
                <div>
                    <h1 className="title">Upgrades</h1>
                </div>
                <div>
                    {world.upgrades.filter( upgrade => !upgrade.unlocked).map(
                        upgrade =>
                            <div key={upgrade.name} className="upgradegrid">
                                <div>
                                    <div className="logo">
                                        <img alt="upgrade logo" className="round" src={url +
                                            upgrade.logo}/>
                                    </div>
                                </div>
                                <div className="infosupgrade">
                                    <div className="upgradename"> {upgrade.name} </div>
                                    <div className="upgradecible"> {
                                        world.products[upgrade.idcible - 1].name} </div>
                                    <div className="upgradecost"> {upgrade.seuil} </div>
                                    <div className="upgraderatio"> {upgrade.typeratio} : x{upgrade.ratio} </div>
                                </div>
                                <div>
                                    <Button onClick={() => {onUpgradeBuy(upgrade); updateNbUpgradeCanBuy()}}
                                            disabled={world.money < upgrade.seuil || world.products[upgrade.idcible-1].quantite == 0}>
                                        Buy ! </Button>
                                </div>
                            </div>

                    )
                    }


                </div>
            </div>
        }</div>
    )
}