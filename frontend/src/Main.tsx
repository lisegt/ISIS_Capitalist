import {World} from "./world";
import React, {useEffect, useState} from "react";
import ProductComponent from "./components/ProductComponent";

const url = 'https://isiscapitalistgraphql.kk.kurasawa.fr/'


// Affiche l'interface principale
type MainProps = {
    loadworld: World
    username: string
}
export default function Main({ loadworld, username } : MainProps) {
    const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadworld)) as
        World);
    useEffect(() => {
        setWorld(JSON.parse(JSON.stringify(loadworld)) as World)
    }, [loadworld])

    return (
        <div className="App">
            <header className="header">
                <span> {world.name} </span>
                <img className = 'round' src={url + world.logo} />
                <span> {world.money} </span>
                <div> multiplicateur </div>

            </header>
            <main className="main">
                <div> liste des boutons de menu </div>
                <div className="product">
                    <ProductComponent product={ world.products[0] } />
                    <ProductComponent product={ world.products[1] } />
                    <ProductComponent product={ world.products[2] } />
                    <ProductComponent product={ world.products[3] } />
                    <ProductComponent product={ world.products[4] } />
                    <ProductComponent product={ world.products[5] } />
                </div>
            </main>
        </div>
    );
}