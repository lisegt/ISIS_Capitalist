import {Product, World} from "../world";
import React, {useEffect, useRef, useState} from "react";
import MyProgressbar, {Orientation} from "./ProgressBar";
import {useInterval} from "./MyInterval";
const url = 'http://localhost:4000/'


type ProductProps = {
    product: Product
    onProductionDone: (product:Product, qt: number)=>void;
    qtmulti: string
    qtAcheter : number[]
    loadworld : World
    onProductionBuy: (p: Product, qt: number)=>void;
    loadproductPrice : number[];
}

export default function ProductComponent({ product, onProductionDone, qtmulti, qtAcheter, loadworld, onProductionBuy, loadproductPrice} : ProductProps) {

       const lastupdate= useRef(Date.now());
       const [timeleft, setTimeleft]=useState(product.timeleft);
       const [world, setWorld]=useState(loadworld);
    const [productPrice, setProductPrice] = useState(loadproductPrice);





    useInterval(() => {calcScore()}, 100)

    // Mettre à jour l'état productPrice lorsque loadproductPrice change
    useEffect(() => {
        setProductPrice(loadproductPrice);
    }, [loadproductPrice]);
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
        if(product.quantite>0) {
            setTimeleft(product.vitesse);
            lastupdate.current = Date.now();
        }


    }

    return (
        <div className="unproduit">
            <div className="productLeft">
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
                    <div className="gain">revenu : {product.revenu}</div>
                </div>
                <div className="partieBasse">
                    <button className="test2" onClick={() => onProductionBuy(product, qtAcheter[product.id])}
                    >{qtAcheter[product.id]}</button>
                    <div>cout : {productPrice[product.id-1]}</div>
                    <div>{timeleft}ms</div>
                </div>
            </div>
        </div>

    )

}
