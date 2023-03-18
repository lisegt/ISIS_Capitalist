import {Palier, World} from "../world";
import React, {useEffect, useState} from 'react';
import Manager from './Manager';
import {Badge} from "@mui/material";
import Unlocks from "./Unlocks";


type MenuProps = {
    loadWorld: World
    onManagerHired:(manager:Palier)=>void;
    loadsnackBarManagers: boolean;
    loadsnackBarUnlocks: boolean;
    buyManagerPossible: (managers : Palier[])=>number;

}


export default function Menu({ loadWorld, onManagerHired, loadsnackBarManagers, loadsnackBarUnlocks, buyManagerPossible} : MenuProps) {
    const [showManager, setShowManager] = useState(false);
    const [showUnlocks, setShowUnlocks] = useState(false);
    const [world, setWorld] = useState(loadWorld);
    const [nbManagersCanBuy, setNbManagersCanBuy] = useState(buyManagerPossible(world.managers));

    function updateNbManagerCanBuy() {
        setNbManagersCanBuy(buyManagerPossible(world.managers));
    }
    // @ts-ignore
    return (
        <div className="coulisses">
            <h1>Coulisses</h1>
            <button className="btn_coulisses" onClick={() => setShowManager(!showManager)}>
                Managers
                {(
                    <Badge color="primary" badgeContent={nbManagersCanBuy} sx={{ ml: 1 }}>
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

        </div>
    );
}