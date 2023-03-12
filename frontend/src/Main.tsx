import {Palier, Product, World} from "./world";
import React, {useEffect, useState} from "react";
import ProductComponent from "./components/ProductComponent";
import {transform} from "./utils";
import Menu from "./components/Menu";
import { Snackbar } from '@mui/material';
import Manager from "./components/Manager";
import {useInterval} from "./components/MyInterval";

const url = 'http://localhost:4000/'


// Affiche l'interface principale
type MainProps = {
    loadworld: World
    username: string
}
export default function Main({ loadworld, username } : MainProps) {
    const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadworld)) as
        World);
    //const [score, setScore] = useState(world.score);
    const [money, setMoney] = useState(world.money);
    const[qtmulti, setQtmulti]=useState("x1");
    const[qtAcheter, setQtAcheter]=useState([1,1,1,1,1,1]);
    const newQtAcheter = [...qtAcheter];
    const [productPrice, setProductPrice] = useState([world.products[0].cout,
        world.products[1].cout,
        world.products[2].cout,
        world.products[3].cout,
        world.products[4].cout,
        world.products[5].cout])
    const newProductPrice = [...productPrice]; // créer une copie du tableau existant

    const [snackBarOpen, setSnackBarOpen] = useState(false);

    useEffect(() => {
        setWorld(JSON.parse(JSON.stringify(loadworld)) as World)
    }, [loadworld])



    function qtAchetable(){
        if(qtmulti === "x1") {
            for (let i = 0; i < 6; i++) {
                newQtAcheter[world.products[i].id] = 10;
                setQtAcheter(newQtAcheter);
            }

        }
        if(qtmulti === "x10") {
            for (let i = 0; i < 6; i++) {
                newQtAcheter[world.products[i].id] = 100;
                setQtAcheter(newQtAcheter);
            }
        }
        if(qtmulti === "x100") {
            for (let i = 0; i < 6; i++) {
                calcMaxCanBuy(world.products[i]);
            }
        }
        if(qtmulti === "Max") {
            for (let i = 0; i < 6; i++) {
                newQtAcheter[world.products[i].id] = 1;
                setQtAcheter(newQtAcheter);
            }
        }
    }
    function onProductionDone(p:Product, qt:number):void{
        let gain = qt*(p.quantite*p.revenu);
        addToScore(gain);
        if(qtmulti==="Max") {
            calcMaxCanBuy(p);
        }
    }
    function addToScore(gain:number){
        const newScore = world.score + gain;
        const newMoney = world.money + gain;
        setWorld((prevWorld)=>{
            return{...prevWorld, money : newMoney, score : newScore}
        })

    }
    //un = u0 × q^n .
    function calcMaxCanBuy(p: Product){
        let u0 = p.cout;
        let un = u0;
        let q = p.croissance;
        let n = 0;
        let coutAchat = u0;
        //tant qu'on a plus d'argent que le coutAchat
        while (world.money>=coutAchat){
            //console.log("money="+world.money+"; coutAchat"+coutAchat)
            n ++;
            un = u0 * q**n;
            coutAchat = coutAchat + un;
            //console.log("n="+n+"; un="+un+"; unPlus1="+unPlus1+"; coutAchat ="+coutAchat)
        }
        newQtAcheter[p.id] = n;
        //console.log("qt : "+newQtAcheter[p.id] )
        setQtAcheter(newQtAcheter)
    }
    function onProductionBuy(p: Product, qt: number){
        //on déduit le cout de l'achat de l'argent du monde = somme d'une suite géométrique
        let q = p.croissance
        let coutAchat = p.cout * ((1 - Math.pow(q, qt)) / (1 - q))
            if (world.money >= coutAchat) {

                //maj money
                world.money = world.money - coutAchat;
                setMoney(money - coutAchat)

                //on incrémente la qté
                world.products[p.id-1].quantite += qt;
                const newQuantite = [...world.products];
                setWorld((prevWorld)=>{
                    return{...prevWorld, newQuantite};
                })
                //console.log(world.products[p.id-1].quantite)

                //màj du cout d'achat produit, coût du produit n+1
                p.cout = Math.pow(q, qt) * p.cout
                updateProductPrice(world.products)
            }
        if(qtmulti=="Max"){
            calcMaxCanBuy(p)
        }
    }

    function toogleQtmulti(){
        if (qtmulti === "x1") {
            setQtmulti("x10");
        } else if (qtmulti === "x10") {
            setQtmulti("x100");
        } else if (qtmulti === "x100") {
            setQtmulti("Max");
        } else if (qtmulti === "Max"){
            setQtmulti("x1");
        }
        updateProductPrice(world.products)
    }

    function updateProductPrice(p:Product[]){
        if (qtmulti === "x1") {
            for (let i = 0; i < p.length; i++) {
                newProductPrice[i] = p[i].cout;
            }
        } else if (qtmulti === "x10") {
            for(let i=0; i<p.length;i++) {
                let u0 = p[i].cout;
                let un = u0;
                let q = p[i].croissance;
                let n = 0;
                let coutAchat = u0;
                while (n < 10) {
                    n++;
                    un = u0 * q ** n;
                    coutAchat = coutAchat + un;
                }
                newProductPrice[i] = coutAchat;
            }
        } else if (qtmulti === "x100") {
            for(let i=0; i<p.length;i++) {
                let u0 = p[i].cout;
                let un = u0;
                let q = p[i].croissance;
                let n = 0;
                let coutAchat = u0;
                while (n < 100) {
                    n++;
                    un = u0 * q ** n;
                    coutAchat = coutAchat + un;
                }
                newProductPrice[i] = coutAchat;
            }
        } else if (qtmulti === "Max"){

            for(let i=0; i<p.length;i++) {
                let u0 = p[i].cout;
                let un = u0;
                let q = p[i].croissance;
                let n = 0;
                let coutAchat = u0;
                while (n < qtAcheter[i]) {
                    n++;
                    un = u0 * q ** n;
                    coutAchat = coutAchat + un;
                }
                newProductPrice[i] = coutAchat;
            }
        }
        setProductPrice(newProductPrice)
        //console.log("here"+productPrice)
    }

    function onManagerHired(manager:Palier){
        //console.log(world.products[manager.idcible-1].managerUnlocked)
        manager.unlocked = true;
        const newMoney = world.money - manager.seuil;
        const newManagers = [...world.managers];
        world.products[manager.idcible-1].managerUnlocked = true;
        const newProductUnlocked = [...world.products]
        setWorld((prevWorld) => {
            return { ...prevWorld, money: newMoney, managers: newManagers, newProductUnlocked };
        });
        // Afficher le message de la SnackBar
        setSnackBarOpen(true);
    }

    function buyManagerPossible(managers : Palier[]){
        let r =0;
        for(let i=0; i<managers.length;i++){
            if(managers[i].seuil<=world.money && world.products[managers[i].idcible-1].quantite >0 && !managers[i].unlocked){
                r ++;
            }
        }
        return r;
    }


    return (
        <div className="App">
            <header className="header">
                <div className="nomLogoWorld"> <img className = 'round' src={url + world.logo} />{world.name} </div>
                <span className="money" dangerouslySetInnerHTML={{__html: transform(world.money)}}></span>

                <button className="test2" onClick={() => {
                    toogleQtmulti()
                    qtAchetable()
                }}>{qtmulti}</button>

            <div> multiplicateur </div>

            </header>
            <main className="main">
                <div className="partieGauche">
                        <Menu loadWorld={world}
                              onManagerHired={onManagerHired}
                              loadsnackBarOpen={snackBarOpen}
                              buyManagerPossible ={buyManagerPossible}/>


                </div>
                <div className="partieCentrale">
                    <div className="p0"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product ={world.products[0]}
                                                          qtAcheter={qtAcheter}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadproductPrice={productPrice}/>
                    </div>
                    <div className="p1"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product ={world.products[1]}
                                                          qtAcheter={qtAcheter}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadproductPrice={productPrice}/>
                    </div>
                    <div className="p2"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product ={world.products[2]}
                                                          qtAcheter={qtAcheter}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadproductPrice={productPrice}/>
                    </div>
                    <div className="p2"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product ={world.products[3]}
                                                          qtAcheter={qtAcheter}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadproductPrice={productPrice}/>
                    </div>
                    <div className="p2"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product ={world.products[4]}
                                                          qtAcheter={qtAcheter}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadproductPrice={productPrice}/>
                    </div>
                    <div className="p2"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product ={world.products[5]}
                                                          qtAcheter={qtAcheter}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadproductPrice={productPrice}/>
                    </div>


                </div>

            </main>
        </div>
    );
}

//page 38/50 6)
//mettre à jour l'affichage du cout d'un produit en fonction de qmulti
// verifier que le score ne s'incrémente pas un point en retard
//corriger pb affiche snackBar
