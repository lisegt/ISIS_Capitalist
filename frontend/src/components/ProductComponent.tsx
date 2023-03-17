import {Product, World} from "../world";
import React, {useEffect, useRef, useState} from "react";
import MyProgressbar, {Orientation} from "./ProgressBar";
import {useInterval} from "./MyInterval";
import {gql, useMutation} from "@apollo/client";
const url = 'http://localhost:4000/'
const LANCER_PRODUCTION = gql`
  mutation lancerProductionProduit($id: Int!) {
    lancerProductionProduit(id: $id) {
      id
    }
  }
`;


type ProductProps = {
    loadworld : World
    loadusername : string ;
    product: Product
    qtmulti: string
    qtAcheter : number[]
    loadproductPrice : number[];
    onProductionDone: (product:Product, qt: number)=>void;
    onProductionBuy: (p: Product, qt: number)=>void;



}

export default function ProductComponent({ product, onProductionDone, qtmulti, qtAcheter, loadworld, onProductionBuy, loadproductPrice, loadusername} : ProductProps) {
    const [world, setWorld]=useState(loadworld);
    const username = loadusername;
    const lastupdate= useRef(Date.now());
    const [timeleft, setTimeleft]=useState(product.timeleft);
    const [productPrice, setProductPrice] = useState(loadproductPrice);

    //Mutation
    const [lancerProduction] = useMutation(LANCER_PRODUCTION,
    { context: { headers: { "x-user": username }},
        onError: (error): void => {
            // actions en cas d'erreur
         }
        }
    )

    //Calculer le score toutes les 100 secondes
    useInterval(() => {calcScore()}, 100)

    // Mettre à jour l'état productPrice lorsque loadproductPrice change
    useEffect(() => {
        setProductPrice(loadproductPrice);
    }, [loadproductPrice]);

    //Calculer le score du joueur
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

        //Tant que le temps écoulé n'a pas dépassé le temps restant : cas simple
        if (temps_ecoule < timeleft) {
            setTimeleft(timeleft - temps_ecoule) ;
        } else {
            // Si le temps écoulé est égale ou supérieur au temps restant : cas compliqué (résultat négatif de la soustraction)
            //le produit n'est pas automatisé
            if (!product.managerUnlocked && en_production) {
                    nb_production = 1;
                    setTimeleft(0);
                }
            //le produit est automatisé
            if(product.managerUnlocked){
                nb_production = ((temps_ecoule - timeleft)/product.vitesse)+1;
                setTimeleft(temps_ecoule % product.vitesse);
                }
            }
        // Si un ou plusieurs produits ont été produit, on appelle la production du produit
        if(nb_production >0){
            onProductionDone(product, nb_production);
        }
    }

    //Lors du clic sur un produit
    function startFabrication(){

        //Productible que si on en a débloqué 1 au minimum
        if(product.quantite>0) {

            //Mise à jour des données pour calcScore
            setTimeleft(product.vitesse);
            lastupdate.current = Date.now();

            //Mutation --> Sauvegarde de la quantité du produit, du score et de l'argent
            lancerProduction({ variables: { id: product.id } });
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
                    <MyProgressbar className="progressbar" vitesse={product.vitesse}
                                                            initialvalue={product.vitesse - timeleft}
                                                            run={product.managerUnlocked || timeleft>0}
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
