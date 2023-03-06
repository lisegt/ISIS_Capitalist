import {Product} from "../world";
import React, {useEffect, useRef, useState} from "react";
import MyProgressbar, {Orientation} from "./ProgressBar";
import {useInterval} from "./MyInterval";
const url = 'https://isiscapitalistgraphql.kk.kurasawa.fr/'


type ProductProps = {
    product: Product
    onProductionDone: (product:Product, qt: number)=>void;
}

export default function ProductComponent({ product, onProductionDone} : ProductProps) {

       const lastupdate= useRef(product.lastupdate);
       const [timeleft, setTimeleft]=useState(product.timeleft);

    useInterval(() => calcScore(), 100)
    function calcScore() {

        let temps_ecoule=Date.now()-lastupdate.current;

        //la production pendant le temps d'absence
        let nb_production = 0;
        let en_production = false;

        //s'il reste du timeleft, le produit est encore en production
        if (timeleft > 0) {
            lastupdate.current = Date.now();
            en_production = true;
        }

        if (temps_ecoule < timeleft) {
            setTimeleft(timeleft - temps_ecoule) ;
        } else {
            //le produit n'est pas automatisé
            if (!product.managerUnlocked && en_production) {
                    nb_production = 1;
                    setTimeleft(0);
                }
            if(product.managerUnlocked){
                nb_production = ((temps_ecoule - timeleft)/product.vitesse)+1;
                setTimeleft(temps_ecoule % product.vitesse);
            }
            }
        if(nb_production >0){
            onProductionDone(product, nb_production);
        }
        }
    function startFabrication(){
        setTimeleft( product.vitesse);
        lastupdate.current = Date.now();
    }

    return (
        <div className="Product">
            <div className="ProductLeft">
                <button onClick={()=>{startFabrication()}}><img className = 'round' src={url + product.logo} /></button>
                <div>{product.quantite}</div>
            </div>
            <div className="productRight">
                <div className="partieHaute">
                    <MyProgressbar className="barstyle" vitesse={product.vitesse}
                                                            initialvalue={product.vitesse - timeleft}
                                                            run={product.managerUnlocked || timeleft>0} frontcolor="#ff8800" backcolor="#ffffff"
                                                            auto={product.managerUnlocked}
                                                            orientation={Orientation.horizontal} />
                    <div className="gain">{product.revenu}</div>
                </div>
                <div className="partieBasse">
                    <button>Acheter</button>
                    <div>Quantité achetée</div>
                    <div>{product.cout}</div>
                    <div>Compteur à rebourd : temps restant pour que la production du produit soit complète</div>
                </div>
            </div>
        </div>

    )

}
//faire le code html d'affichage d'un produit
// Implémenter StartFabrication + CalcScore