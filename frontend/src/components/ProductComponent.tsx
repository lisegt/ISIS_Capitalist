import {Product, World} from "../world";
import React, {useEffect, useRef, useState} from "react";
import MyProgressbar, {Orientation} from "./ProgressBar";
import {useInterval} from "./MyInterval";
import {gql, useMutation} from "@apollo/client";
import {transform} from "../utils";

const url = 'http://localhost:4000/'

//===================== Mutation ============================
const LANCER_PRODUCTION = gql`
  mutation lancerProductionProduit($id: Int!) {
    lancerProductionProduit(id: $id) {
      id
    }
  }
`;

//===================== Product ============================
type ProductProps = {
    loadworld : World
    loadusername : string ;
    product: Product
    qtmulti: string
    onProductionDone: (product:Product, qt: number)=>void;
    onProductionBuy: (p: Product, qt: number, prix : number)=>void;

}

export default function ProductComponent({ product, onProductionDone, qtmulti, loadworld, onProductionBuy, loadusername} : ProductProps) {
    //================================== UseStates ===================================
    const [world, setWorld]=useState(loadworld);

    const lastupdate= useRef(Date.now());
    const [timeleft, setTimeleft]=useState(product.timeleft);

    //================================== UseRefs ===================================
    //Prix d'un lot --> modifié en fonction de la quantité du lot
    const prixLot = useRef(0)
    //Quantité d'un lot maximal
    const qtLot = useRef(0)


    const username = loadusername;


    //================================== Mutation ===================================
    const [lancerProduction] = useMutation(LANCER_PRODUCTION,
    { context: { headers: { "x-user": username }},
        onError: (error): void => {
            // actions en cas d'erreur
         }
        }
    )

    //================================== UseInterval ===================================
    //Calculer le score toutes les 100 secondes
    useInterval(() => {calcScore()}, 100)


    //================================== Fonctions =====================================
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

    //Calcul de la quantité de produit maximale que l'user peut acheter avec son argent actuel
    function calcMaxCanBuy():
        number {
        //Suit la logique d'une suite géométrique
        qtLot.current = Math.trunc((Math.log10(-(world.money * (1 - product.croissance) / product.cout - 1)) / Math.log10(product.croissance)))

        return qtLot.current
    }

    //Maj du prix d'un lot en fonction de la quantité que l'on souhaite acheter en un clic
    function updatePrixLot():number{
        //On passe toutes possibilités de qtmulti
        switch (qtmulti) {
            case "x1":
                prixLot.current=product.cout
            break
            case "x10":
                prixLot.current=product.cout * (1 - product.croissance ** 10) / (1 - product.croissance)

                break
            case "x100":
                prixLot.current=product.cout * (1 - product.croissance ** 100) / (1 - product.croissance)
                break
            case "Max":
                //On utilise calMaxCanBuy comme quantité de produit que l'user veut acheter
                prixLot.current=product.cout * (1 - product.croissance ** calcMaxCanBuy()) / (1 - product.croissance)
                break
        }
        return prixLot.current
    }

    //On active la possibilité d'acheter un produit que si l'user a assez d'argent
    function buttonOn() {
        let r = false
        if ( qtmulti != "Max" && updatePrixLot() <= loadworld.money) {
            r = true
        }
        if(qtmulti === "Max" && calcMaxCanBuy()!=0){
            r = true
        }
        return r
    }

    return (
        <div className="produit_item">
            <div className={"partieGaucheProduit"}>
                <button className="btn_produit" onClick={()=>{startFabrication()}}>
                    <div className={"cercle_produit"}>
                        <img className = 'round_produit' src={url + product.logo} />
                    </div>
                </button>
                <div className={"quantite_produit"}>{product.quantite}</div>

            </div>

            <div className="partieDroiteProduit">
                <div className="partieHauteProduit">
                    <MyProgressbar
                        className="progressbar"
                        vitesse={product.vitesse}
                        initialvalue={product.vitesse - timeleft}
                        run={product.managerUnlocked || timeleft>0}
                        frontcolor="#000000"
                        backcolor="#ffffff"
                        auto={product.managerUnlocked}
                        orientation={Orientation.horizontal}>

                    </MyProgressbar>
                    <div className="revenu_produit">Revenu : {product.revenu} €</div>

                </div>
                <div className="partieBasseProduit">
                    <button className={"btn_acheterProduit"} onClick={() => onProductionBuy(product, qtLot.current, prixLot.current)}
                    disabled={!buttonOn()}>
                        <div>
                            Acheter {qtmulti==="Max" && <span> {Math.trunc(qtLot.current)}</span>} pour { <span dangerouslySetInnerHTML={{ __html: transform(Math.round(updatePrixLot() * 100) / 100) }}/>}
                        </div>
                    </button>
                    <div className={"time_left"}>{timeleft} ms</div>
                </div>
            </div>
        </div>

    )

}
