import {Palier, Product, World} from "./world";
import React, {useEffect, useState} from "react";
import ProductComponent from "./components/ProductComponent";
import {transform} from "./utils";
import Menu from "./components/Menu";
import {IconButton, Snackbar} from '@mui/material';
import Manager from "./components/Manager";
import {useInterval} from "./components/MyInterval";
import {gql, useMutation} from "@apollo/client";

const url = 'http://localhost:4000/'

//Mutations
const ACHETER_QT_PRODUIT = gql`
  mutation acheterQtProduit($id: Int!, $quantite: Int!) {
    acheterQtProduit(id: $id, quantite: $quantite) {
      id
    }
  }
`;const ENGAGER_MANAGER = gql`
  mutation engagerManager($name : String!) {
    engagerManager(name : $name) {
      name
    }
  }
`;


// Affiche l'interface principale
type MainProps = {
    loadworld: World
    username: string
}
export default function Main({ loadworld, username } : MainProps) {

    //Téléchargement du monde
    const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadworld)) as World);

    const [money, setMoney] = useState(world.money);

    const[qtmulti, setQtmulti]=useState("x1");

    //qtAcheter a une copie car c'est un tableau, on utilise la copie pour mettre le useState à jour en modifiant que la valeur que l'on souhaite modifier
    const[qtAcheter, setQtAcheter]=useState([1,1,1,1,1,1]);
    const newQtAcheter = [...qtAcheter];

    //productPrice a une copie car c'est un tableau, on utilise la copie pour mettre le useState à jour en modifiant que la valeur que l'on souhaite modifier
    const [productPrice, setProductPrice] = useState([world.products[0].cout,
        world.products[1].cout,
        world.products[2].cout,
        world.products[3].cout,
        world.products[4].cout,
        world.products[5].cout])
    const newProductPrice = [...productPrice];

    const [snackBarOpen, setSnackBarOpen] = useState(false);

    //Mutations
    const [acheterQtProduit] = useMutation(ACHETER_QT_PRODUIT,
        { context: { headers: { "x-user": username }},
            onError: (error): void => {
                // actions en cas d'erreur
            }
        }
    )
    const [engagerManager] = useMutation(ENGAGER_MANAGER,
        { context: { headers: { "x-user": username }},
            onError: (error): void => {
                // actions en cas d'erreur
            }
        }
    )

    //Téléchargement du world quand il est modifié
    useEffect(() => {
        setWorld(JSON.parse(JSON.stringify(loadworld)) as World)
    }, [loadworld])

    //Combien de quantité je peux acheter avec tout l'argent que j'ai ?
    function qtAchetable(){
        //Il y a un décallage des qtmulti (lorsque qtmulti=x1 il faut que la quantité achetable soit 10 sinon problèmes dans l'affichage
        if(qtmulti === "x1") {
            //La quantité achetable = à 10
            for (let i = 0; i < 6; i++) {
                newQtAcheter[world.products[i].id] = 10;
                setQtAcheter(newQtAcheter);
            }
        }
        if(qtmulti === "x10") {
            //La quantité achetable = à 100
            for (let i = 0; i < 6; i++) {
                newQtAcheter[world.products[i].id] = 100;
                setQtAcheter(newQtAcheter);
            }
        }
        if(qtmulti === "x100") {
            //La quantité achetable = à Max
            for (let i = 0; i < 6; i++) {
                calcMaxCanBuy(world.products[i]);
            }
        }
        if(qtmulti === "Max") {
            //La quantité achetable = à 1
            for (let i = 0; i < 6; i++) {
                newQtAcheter[world.products[i].id] = 1;
                setQtAcheter(newQtAcheter);
            }
        }
    }

    //Une fois un produit produit, mise à jour du gain
    function onProductionDone(p:Product, qt:number):void{
        let gain = qt*(p.quantite*p.revenu);
        //Modification des useStates, mise à jour du world
        addToScore(gain);
        //Recalcule de la quantité achetable si qtmulti = "Max" --> doit peut etre etre = à "100" à cause du décallage
        if(qtmulti==="Max") {
            calcMaxCanBuy(p);
        }
    }

    //Modification des useStates, mise à jour du world
    function addToScore(gain:number){
        const newScore = world.score + gain;
        const newMoney = world.money + gain;
        setWorld((prevWorld)=>{
            return{...prevWorld, money : newMoney, score : newScore}
        })

    }

    //Calcul de la quantité de produit maximale achetable avec la money qu'on a.
    // Idée de la suite géométrique un = u0 × q^n .
    function calcMaxCanBuy(p: Product){
        //Initialisation
        let u0 = p.cout;
        let un = u0;
        //Raison
        let q = p.croissance;
        //Compteur
        let n = 0;
        let coutAchat = u0;
        //tant qu'on a plus d'argent que le coutAchat
        while (world.money>=coutAchat){
            n ++;
            un = u0 * q**n;
            coutAchat = coutAchat + un;
        }
        //Mise à jour de la quantité du produit dans le useState QtAcheter
        newQtAcheter[p.id] = n;
        setQtAcheter(newQtAcheter)
    }

    //on déduit le cout de l'achat à l'argent du monde
    function onProductionBuy(p: Product, qt: number){

        let q = p.croissance
        //Calcul du cout de l'achat en fonction de la quantité et du produit
        let coutAchat = p.cout * ((1 - Math.pow(q, qt)) / (1 - q))
            //Si on a assez d'argent
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

                //màj du cout d'achat produit, coût du produit n+1
                p.cout = Math.pow(q, qt) * p.cout
                updateProductPrice(world.products)
            }

        //Recalcule de la quantité achetable si qtmulti = "Max" --> doit peut etre etre = à "100" à cause du décallage
        if(qtmulti=="Max"){
            calcMaxCanBuy(p)
        }
        //Mutation
        acheterQtProduit({ variables: { id: p.id, quantite : qt } });
    }

    //Changer la valeur de qtmulti en fonction de sa valeur précédente
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
        //calcul du cout du lot de produit en fonction de la quantité qui forme le lot
        updateProductPrice(world.products)
    }

    //mettre à jour le prix du lot en fonction de la taille du lot
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
    }

    // Embaucher un manager
    function onManagerHired(manager:Palier){
        // Débloquer le manager --> Je crois qu'il ne sert pas
        manager.unlocked = true;
        // Mise à jour de tous les hooks d'état
        const newMoney = world.money - manager.seuil;
        const newManagers = [...world.managers];
        world.products[manager.idcible-1].managerUnlocked = true;
        const newProductUnlocked = [...world.products]
        setWorld((prevWorld) => {
            return { ...prevWorld, money: newMoney, managers: newManagers, newProductUnlocked };
        });
        // Afficher le message de la SnackBar
        setSnackBarOpen(true);

        //Mutation
        engagerManager({ variables: { name: manager.name } });

    }

    // Calcul du nombre de manager achetable pour l'afficher dans le badge
    function buyManagerPossible(managers : Palier[]){
        let r =0;
        for(let i=0; i<managers.length;i++){
            if(managers[i].seuil<=world.money && world.products[managers[i].idcible-1].quantite >0 && !managers[i].unlocked){
                r ++;
            }
        }
        return r;
    }

    //Fermer la snackbar
    function CloseIcon(props: { fontSize: string }) {
        return null;
    }


    return (
        <div className="App">
            <header className="header">
                <div className="nomLogoWorld">
                    <img className='logo' src={url + world.logo}/>{world.name}
                </div>
                <span className="money" dangerouslySetInnerHTML={{__html: transform(world.money)}}></span>

                <button className="qmulti_mediator" onClick={() => {
                    toogleQtmulti()
                    qtAchetable()
                }}>{qtmulti}</button>



            </header>
            <main className="main">
                <div className="partieGauche">
                    <Menu loadWorld={world}
                          onManagerHired={onManagerHired}
                          loadsnackBarOpen={snackBarOpen}
                          buyManagerPossible={buyManagerPossible}/>

                    <Snackbar
                        open={snackBarOpen}
                        autoHideDuration={5000}
                        message="Nouveau manager embauché !"
                        action={
                            <IconButton
                                size="small"
                                aria-label="close"
                                color="secondary"
                                onClick={() => setSnackBarOpen(false)}
                                style={{backgroundColor: 'red'}}
                            >
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        }
                    />
                </div>
                <div className="partieCentrale">
                    <div className="case_produit"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product={world.products[0]}
                                                          qtAcheter={qtAcheter}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadproductPrice={productPrice}
                                                          loadusername={username}/>
                    </div>
                    <div className="case_produit"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product={world.products[1]}
                                                          qtAcheter={qtAcheter}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadproductPrice={productPrice}
                                                          loadusername={username}/>
                    </div>
                    <div className="case_produit"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product={world.products[2]}
                                                          qtAcheter={qtAcheter}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadproductPrice={productPrice}
                                                          loadusername={username}/>
                    </div>
                    <div className="case_produit"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product={world.products[3]}
                                                          qtAcheter={qtAcheter}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadproductPrice={productPrice}
                                                          loadusername={username}/>
                    </div>
                    <div className="case_produit"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product={world.products[4]}
                                                          qtAcheter={qtAcheter}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadproductPrice={productPrice}
                                                          loadusername={username}/>
                    </div>
                    <div className="case_produit"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product={world.products[5]}
                                                          qtAcheter={qtAcheter}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadproductPrice={productPrice}
                                                          loadusername={username}/>
                    </div>


                </div>

            </main>
        </div>
    );
}

//page 43/50
// mettre à jour l'affichage du cout d'un produit en fonction de qmulti
// bloquer bouton achat quand pas assez de sous
// verifier que le score ne s'incrémente pas un point en retard
// argent en négatif quand j'achete une trop grosse quantité de produit avec max
// pb pour embaucher manager flute
