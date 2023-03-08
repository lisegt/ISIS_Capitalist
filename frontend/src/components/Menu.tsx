import {World} from "../world";
import React, { useState } from 'react';
import Manager from './Manager';


type MenuProps = {
    world: World
}


export default function Menu({ world} : MenuProps) {
    const [showManager, setShowManager] = useState(false);


    // @ts-ignore
    return (
        <div>
            <h1>Menu</h1>
            <button onClick={() => setShowManager(true)}>Open Manager</button>
            {showManager && <Manager manager={}/>}

        </div>
    );
}