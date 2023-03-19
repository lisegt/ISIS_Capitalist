import {Palier, World} from "../world";
import React, {useEffect, useState} from 'react';
import Manager from './Manager';
import {Badge} from "@mui/material";
import Unlocks from "./Unlocks";
import Upgrades from "./Upgrades";
import AngelUpgrades from "./AngelUpgrades";
import Investor from "./Investors";


type MenuProps = {
    loadWorld: World
    loadsnackBarManagers: boolean;
    loadsnackBarUnlocks: boolean;
    loadsnackBarUpgrades: boolean;
    loadsnackBarAngelUpgrades: boolean;
    loadsnackBarResetWorld: boolean;
    onManagerHired:(manager:Palier)=>void;
    onUpgradeBuy:(upgrade:Palier)=>void;
    onAngelUpgradeBuy : (ange : Palier)=>void;
    onResetWorld : () => void;
    buyManagerPossible: (managers : Palier[])=>number;
    buyUpgradePossible:(upgrades: Palier[])=>number;
    buyAngelUpgradePossible:(angelupgrades: Palier[])=>number;
    buyInvestorsPossible : () => number;

}


export default function Menu({ loadWorld, loadsnackBarManagers, loadsnackBarUnlocks, loadsnackBarUpgrades, loadsnackBarAngelUpgrades, loadsnackBarResetWorld, onManagerHired, onUpgradeBuy, onAngelUpgradeBuy, onResetWorld, buyManagerPossible, buyUpgradePossible, buyAngelUpgradePossible, buyInvestorsPossible} : MenuProps) {

    const [world, setWorld] = useState(loadWorld);

    const [showManager, setShowManager] = useState(false)
    const [showUnlocks, setShowUnlocks] = useState(false)
    const [showUpgrades, setShowUpgrades] = useState(false)
    const [showAngelUpgrades, setShowAngelUpgrades] = useState(false)
    const [showInvestors, setShowInvestors] = useState(false)

    const [nbManagersCanBuy, setNbManagersCanBuy] = useState(buyManagerPossible(world.managers))
    const [nbUpgradesCanBuy, setNbUpgradesCanBuy] = useState(buyUpgradePossible(world.upgrades))
    const [nbAngelUpgradesCanBuy, setNbAngelUpgradesCanBuy] = useState(buyAngelUpgradePossible(world.angelupgrades))
    const [nbAngelInvestorsCanBuy, setNbInvestisorsCanBuy] = useState(buyInvestorsPossible())

    function updateNbManagerCanBuy() {
        setNbManagersCanBuy(buyManagerPossible(world.managers))
    }
    function updateNbUpgradeCanBuy(){
        setNbUpgradesCanBuy(buyUpgradePossible(world.upgrades));
    }

    function updateNbAngelUpgradeCanBuy(){
        setNbAngelUpgradesCanBuy(buyAngelUpgradePossible(world.angelupgrades));
    }

    function updateNbInvestisorsCanBuy(){
        setNbInvestisorsCanBuy(buyInvestorsPossible());
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

            <button className="btn_coulisses" onClick={() => setShowAngelUpgrades(!showAngelUpgrades)}>Angel Upgrades
                {(
                    <Badge color="success" badgeContent={nbAngelUpgradesCanBuy} sx={{ ml: 1 }}>
                        &nbsp;
                    </Badge>
                )}</button>
            {showAngelUpgrades && <AngelUpgrades loadworld={world}
                                       onAngelUpgradeBuy={onAngelUpgradeBuy}
                                       loadsnackBarAngelUpgrades={loadsnackBarAngelUpgrades}
                                       updateNbAngelUpgradeCanBuy={updateNbAngelUpgradeCanBuy}
            />}

            <button className="btn_coulisses" onClick={() => setShowInvestors(!showInvestors)}>Anges
            {(
                <Badge color="success" badgeContent={nbAngelInvestorsCanBuy} sx={{ ml: 1 }}>
                    &nbsp;
                </Badge>
            )}</button>
            {showInvestors && <Investor loadworld={world}
                                     loadsnackBarResetWorld={loadsnackBarResetWorld}
                                    onResetWorld={onResetWorld}
                                     updateNbInvestorsCanBuy={updateNbInvestisorsCanBuy}
            />}

        </div>
    );
}