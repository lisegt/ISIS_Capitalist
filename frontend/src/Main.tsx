import {Product, World} from "./world";
import React, {useEffect, useState} from "react";
import ProductComponent from "./components/ProductComponent";
import {transform} from "./utils";
import Menu from "./components/Menu";
import Manager from "./components/Manager";

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
    const[qtAcheter, setQtAcheter]=useState(1);
    const [quantite, setQuantite] = useState([world.products[0].quantite,
        world.products[1].quantite,
        world.products[2].quantite,
        world.products[3].quantite,
        world.products[4].quantite,
        world.products[5].quantite])
    const newQuantite = [...quantite]; // créer une copie du tableau existant


    useEffect(() => {
        setWorld(JSON.parse(JSON.stringify(loadworld)) as World)
    }, [loadworld])

    function onProductionDone(p:Product, qt:number):void{
        let gain = qt*(p.quantite*p.revenu);
        addToScore(gain);
    }
    function addToScore(gain:number){
        setScore(world.score+gain);
        world.score = world.score + gain;
        setMoney(world.money+gain);
        world.money = world.money+gain;

    }
    function onProductionBuy(p: Product, qt: number){
        p.cout=1
        //on déduit le cout de l'achat de l'argent du monde = somme d'une suite géométrique
        let q = p.croissance
        let coutAchat = p.cout * ((1 - Math.pow(q, qt)) / (1 - q))
            if (world.money >= coutAchat) {

                //maj money
                world.money = world.money - coutAchat;
                setMoney(money - coutAchat)

                //on incrémente la qté
                newQuantite[p.id] += qt; // incrémenter la première quantité dans la copie
                setQuantite(newQuantite)

                //màj du cout d'achat produit, coût du produit n+1
                p.cout = Math.pow(q, qt) * p.cout
            }
        }
    function acheter(product : Product) {

        if (qtmulti === "x1" && world.money >= product.cout) {
            setMoney(world.money - product.cout)
            newQuantite[product.id] += 1; // incrémenter la première quantité dans la copie
            setQuantite(newQuantite); // mettre à jour l'état avec la nouvelle copie modifiée du tableau
        }
        if (qtmulti === "x10" && world.money >= (product.cout * 10)) {
            setMoney(world.money - product.cout * 10)
            newQuantite[product.id] += 10;
            setQuantite(newQuantite);
        }

        if (qtmulti === "x100" && world.money >= (product.cout * 100)) {
            setMoney(world.money - product.cout * 100)
            newQuantite[product.id] += 100;
            setQuantite(newQuantite);
        }
    }


    return (
        <div className="App">
            <header className="header">
                <div className="nomLogoWorld"> <img className = 'round' src={url + world.logo} />{world.name} </div>
                <span className="money" dangerouslySetInnerHTML={{__html: transform(world.money)}}></span>

                <button className="test2" onClick={() => {
                    if (qtmulti === "x1") {
                        setQtmulti("x10");
                        setQtAcheter(10);
                    } else if (qtmulti === "x10") {
                        setQtmulti("x100");
                        setQtAcheter(100);
                    } else if (qtmulti === "x100") {
                        setQtmulti("Max");
                    } else if (qtmulti === "Max"){
                        setQtmulti("x1");
                        setQtAcheter(1);
                    }
                }}>{qtmulti}</button>

            <div> multiplicateur </div>

            </header>
            <main className="main">
                <div className="partieGauche">
                        <Menu world={world}></Menu>

                </div>
                <div className="partieCentrale">
                    <div className="p0"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product ={world.products[0]}
                                                          qtAcheter={qtAcheter}
                                                          loadworld={world}
                                                            acheter={acheter}
                                                          onProductionBuy={onProductionBuy}/>
                    </div>
                    <div className="p1"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product ={world.products[1]}
                                                          qtAcheter={qtAcheter}
                                                          loadworld={world}
                                                            acheter={acheter}
                                                          onProductionBuy={onProductionBuy}/>
                    </div>
                    <div className="p2"><ProductComponent onProductionDone={onProductionDone}
                                                              qtmulti={qtmulti}
                                                              product ={world.products[2]}
                                                              qtAcheter={qtAcheter}
                                                              loadworld={world}
                                                              acheter={acheter}
                                                              onProductionBuy={onProductionBuy}/>
                    </div>
                    <div className="p2"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product ={world.products[3]}
                                                          qtAcheter={qtAcheter}
                                                          loadworld={world}
                                                          acheter={acheter}
                                                          onProductionBuy={onProductionBuy}/>
                    </div>
                    <div className="p2"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product ={world.products[4]}
                                                          qtAcheter={qtAcheter}
                                                          loadworld={world}
                                                          acheter={acheter}
                                                          onProductionBuy={onProductionBuy}/>
                    </div>
                    <div className="p2"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product ={world.products[5]}
                                                          qtAcheter={qtAcheter}
                                                          loadworld={world}
                                                          acheter={acheter}
                                                          onProductionBuy={onProductionBuy}/>
                    </div>


                </div>

            </main>
        </div>
    );
}

//page 34/50
