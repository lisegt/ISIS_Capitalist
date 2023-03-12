import {Palier, World} from "../world";
import React, {useEffect, useState} from 'react';
import Manager from './Manager';
import {Badge} from "@mui/material";


type MenuProps = {
    loadWorld: World
    onManagerHired:(manager:Palier)=>void;
    loadsnackBarOpen: boolean;
    buyManagerPossible: (managers : Palier[])=>number;

}


export default function Menu({ loadWorld, onManagerHired, loadsnackBarOpen, buyManagerPossible} : MenuProps) {
    const [showManager, setShowManager] = useState(false);
    const [world, setWorld] = useState(loadWorld);
    const [nbManagersCanBuy, setNbManagersCanBuy] = useState(buyManagerPossible(world.managers));

/*
    // appelé à chaque fois que world est mis à jour
    useEffect(() => {
        SetNbManagersCanBuy(buyManagerPossible(world.managers));
    }, [nbManagersCanBuy]);

    useEffect(()=>{
        console.log(nbManagersCanBuy);
    }, [world]);
*/
    function updateNbManagerCanBuy() {
        setNbManagersCanBuy(buyManagerPossible(world.managers));
    }
    // @ts-ignore
    return (
        <div>
            <h1>Menu</h1>
            <button className="test" onClick={() => setShowManager(!showManager)}>Manager
                {(
                    <Badge color="secondary" badgeContent={nbManagersCanBuy} sx={{ ml: 1 }}>
                        &nbsp;
                    </Badge>
                )}</button>
            {showManager && <Manager loadworld={world}
                                     onManagerHired={onManagerHired}
                                     loadsnackBarOpen={loadsnackBarOpen}
                                     updateNbManagerCanBuy={updateNbManagerCanBuy}
                                     />}

        </div>
    );
}