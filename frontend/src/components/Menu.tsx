import {Palier, World} from "../world";
import React, {useEffect, useState} from 'react';
import Manager from './Manager';
import {Badge} from "@mui/material";
import Unlocks from "./Unlocks";
import Upgrades from "./Upgrades";


type MenuProps = {
    loadWorld: World
    loadsnackBarManagers: boolean;
    loadsnackBarUnlocks: boolean;
    loadsnackBarUpgrades: boolean;
    onManagerHired:(manager:Palier)=>void;
    onUpgradeBuy:(upgrade:Palier)=>void;
    buyManagerPossible: (managers : Palier[])=>number;
    buyUpgradePossible:(upgrades: Palier[])=>number;

}


export default function Menu({ loadWorld, loadsnackBarManagers, loadsnackBarUnlocks, loadsnackBarUpgrades, onManagerHired, onUpgradeBuy, buyManagerPossible, buyUpgradePossible} : MenuProps) {

    const [world, setWorld] = useState(loadWorld);

    const [showManager, setShowManager] = useState(false)
    const [showUnlocks, setShowUnlocks] = useState(false)
    const [showUpgrades, setShowUpgrades] = useState(false)

    const [nbManagersCanBuy, setNbManagersCanBuy] = useState(buyManagerPossible(world.managers))
    const [nbUpgradesCanBuy, setNbUpgradesCanBuy] = useState(buyUpgradePossible(world.upgrades))

    function updateNbManagerCanBuy() {
        setNbManagersCanBuy(buyManagerPossible(world.managers))
    }
    function updateNbUpgradeCanBuy(){
        setNbUpgradesCanBuy(buyUpgradePossible(world.upgrades));
    }
    // @ts-ignore
    return (
        <div className="coulisses">
            <h1>Coulisses</h1>
            <button className="btn_coulisses" onClick={() => setShowManager(!showManager)}>
                Managers
                {(
                    <Badge color="success" badgeContent={nbManagersCanBuy} sx={{ ml: 1 }}>
                        &nbsp;
                    </Badge>
                )}</button>
            {showManager && <Manager loadworld={world}
                                     onManagerHired={onManagerHired}
                                     loadsnackBarManagers={loadsnackBarManagers}
                                     updateNbManagerCanBuy={updateNbManagerCanBuy}
                                     />}

            <button className="btn_coulisses" onClick={() => setShowUnlocks(!showUnlocks)}>Unlocks</button>
            {showUnlocks && <Unlocks loadworld={world}
                                     loadsnackBarUnlocks={loadsnackBarUnlocks}
            />}
            <button className="btn_coulisses" onClick={() => setShowUpgrades(!showUpgrades)}>Cash Upgrades
                {(
                    <Badge color="success" badgeContent={nbUpgradesCanBuy} sx={{ ml: 1 }}>
                        &nbsp;
                    </Badge>
                )}</button>
            {showUpgrades && <Upgrades loadworld={world}
                                     onUpgradeBuy={onUpgradeBuy}
                                     loadsnackBarUpgrades={loadsnackBarUpgrades}
                                     updateNbUpgradeCanBuy={updateNbUpgradeCanBuy}
            />}

        </div>
    );
}