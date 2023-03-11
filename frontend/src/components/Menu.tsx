import {Palier, World} from "../world";
import React, { useState } from 'react';
import Manager from './Manager';


type MenuProps = {
    loadWorld: World
    onManagerHired:(manager:Palier)=>void;
    loadsnackBarOpen: boolean;
}


export default function Menu({ loadWorld, onManagerHired, loadsnackBarOpen} : MenuProps) {
    const [showManager, setShowManager] = useState(false);
    const [world, setWorld] = useState(loadWorld);


    // @ts-ignore
    return (
        <div>
            <h1>Menu</h1>
            <button className="test" onClick={() => setShowManager(!showManager)}>Manager</button>
            {showManager && <Manager loadworld={world}
                                     onManagerHired={onManagerHired}
                                     loadsnackBarOpen={loadsnackBarOpen}/>}

        </div>
    );
}