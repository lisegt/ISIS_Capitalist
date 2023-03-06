import {Product, World} from "./world";
import React, {useEffect, useState} from "react";
import ProductComponent from "./components/ProductComponent";
import {transform} from "./utils";

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

    function onProductionDone(p:Product, qt:number):void{
        let gain = qt*(p.quantite*p.revenu);
        world.score+=gain;
        addToScore(gain);
    }
    function addToScore(gain:number){
        world.score+=gain;
        world.money+=gain;
    }

    return (
        <div className="App">
            <header className="header">
                <div className="worldName"> {world.name} </div>
                <img className = 'round' src={url + world.logo} />
                <span dangerouslySetInnerHTML={{__html: transform(world.money)}}></span>

            <div> multiplicateur </div>

            </header>
            <main className="main">
                <div>
                    <button className="Unlocks">Unlocks</button>
                    <button className="cashUpgrades">Cash Upgrades</button>
                    <button className="AngelUpgrades">Angel Upgrades</button>
                    <button className="Managers">Managers</button>
                    <button className="Investors">Investors</button>
                </div>
                <div>
                    <ProductComponent onProductionDone={onProductionDone} product ={world.products[0]}/>
                </div>

            </main>
        </div>
    );
}

//page 31/50
// implémenter une méthode calcScore()