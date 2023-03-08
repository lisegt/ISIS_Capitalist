import {Product, World} from "./world";
import React, {useEffect, useState} from "react";
import ProductComponent from "./components/ProductComponent";
import {transform} from "./utils";

const url = 'http://localhost:4000/'


// Affiche l'interface principale
type MainProps = {
    loadworld: World
    username: string
}
export default function Main({ loadworld, username } : MainProps) {
    const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadworld)) as
        World);
    const [score, setScore] = useState(world.score);
    const [money, setMoney] = useState(world.money);
    const[qtmulti, setQtmulti]=useState("x1");

    useEffect(() => {
        setWorld(JSON.parse(JSON.stringify(loadworld)) as World)
    }, [loadworld])

    function onProductionDone(p:Product, qt:number):void{
        let gain = qt*(p.quantite*p.revenu);
        console.log("qt = "+qt)
        console.log("p.quantite = "+p.quantite)
        console.log("p.revenu = "+p.revenu)
        console.log("gain = "+gain)
        addToScore(gain);
    }
    function addToScore(gain:number){
        setScore(world.score=world.score+gain);
        setMoney(world.money=world.money+gain);

    }

    return (
        <div className="App">
            <header className="header">
                <div className="nomLogoWorld"> <img className = 'round' src={url + world.logo} />{world.name} </div>

                <span className="money" dangerouslySetInnerHTML={{__html: transform(world.money)}}></span>
                <span className="score" dangerouslySetInnerHTML={{__html: transform(world.score)}}></span>

            <div> multiplicateur </div>

            </header>
            <main className="main">
                <div className="partieGauche">
                        <button className="unlocks">Unlocks</button>
                        <button className="cashUpgrades">Cash Upgrades</button>
                        <button className="angelUpgrades">Angel Upgrades</button>
                        <button className="managers">Managers</button>
                        <button className="investors">Investors</button>
                </div>
                <div className="partieCentrale">
                    <div className="p0"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product ={world.products[0]}/>
                    </div>
                    <div className="p1"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product ={world.products[1]}/>
                    </div>

                </div>

            </main>
        </div>
    );
}

//page 34/50
