import './css/App.css';
import './css/Produit.css';

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

//===================== Mutations ============================
const ACHETER_QT_PRODUIT = gql`
  mutation acheterQtProduit($id: Int!, $quantite: Int!) {
    acheterQtProduit(id: $id, quantite: $quantite) {
      id
    }
  }
`;

const ENGAGER_MANAGER = gql`
  mutation engagerManager($name : String!) {
    engagerManager(name : $name) {
      name
    }
  }
`;

const CASH_UPGRADE = gql`
  mutation acheterCashUpgrade($name : String!) {
    acheterCashUpgrade(name : $name) {
      name
    }
  }
`;

const ANGEL_UPGRADE = gql`
  mutation acheterAngelUpgrade($name : String!) {
    acheterAngelUpgrade(name : $name) {
      name
    }
  }
`;

const RESET_WORLD = gql`
  mutation resetWorld {
    resetWorld{
        activeangels
        allunlocks {
        idcible
        logo
        name
        ratio
        seuil
        typeratio
        unlocked
        }
        angelbonus
        angelupgrades {
        idcible
        logo
        name
        ratio
        seuil
        typeratio
        unlocked
        }
        lastupdate
        logo
        managers {
        idcible
        logo
        name
        ratio
        seuil
        typeratio
        unlocked
        }
        money
        name
        products {
        cout
        id
        croissance
        logo
        managerUnlocked
        name
        paliers {
            idcible
            logo
            name
            ratio
            seuil
            typeratio
            unlocked
        }
        quantite
        revenu
        timeleft
        vitesse
        }
        score
        totalangels
        upgrades {
        idcible
        logo
        name
        ratio
        seuil
        typeratio
        unlocked
        }
    }
  }
`;

//================================== Affichage Principale =============================
type MainProps = {
    loadworld: World
    username: string
}
export default function Main({ loadworld, username } : MainProps) {

    //================================== UseStates ===================================
    //Téléchargement du monde
    const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadworld)) as World);

    //Qtmulti peut prendre comme valeur :  x1 ; x10 ; x100 ; Max  Il correspond au nombre d'exemplaires d'un produit que l'ont veut acheter en un click sur le bouton du produit
    const [qtmulti, setQtmulti] = useState("x1");

    //Anges
    const [bonusAnges, setBonusAnges] = useState(world.angelbonus);
    const [resetAnge, setResetAnge] = useState(0);

    //Les snackbar servent à notifier le joueur du message que l'on souhaite
    const [snackBarManagers, setSnackBarManagers] = useState(false);
    const [snackBarUnlocks, setSnackBarUnlocks] = useState(false);
    const [snackBarUpgrades, setSnackBarUpgrades] = useState(false);
    const [snackBarAngelUpgrades, setSnackBarAngelUpgrades] = useState(false);
    const [snackBarResetWorld, setSnackBarResetWorld] = useState(false);

    //================================== UseEffect ===================================
    //Téléchargement du world quand il est modifié
    useEffect(() => {
        setWorld(JSON.parse(JSON.stringify(loadworld)) as World)
    }, [loadworld])

    // ==================== Mutations =============================
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

    const [acheterCashUpgrade] = useMutation(CASH_UPGRADE,
        {
            context: { headers: { "x-user": username } },
            onError: (error): void => {

            }
        }
    )

    const [acheterAngelUpgrade] = useMutation(ANGEL_UPGRADE,
        {
            context: { headers: { "x-user": username } },
            onError: (error): void => {

            }
        }
    )

    const [resetWorld] = useMutation(RESET_WORLD,
        {
            context: { headers: { "x-user": username } },
            onError: (error): void => {

            }
        }
    )

    //========================== Functions =======================================

    //Maj de la valeur de qtmulti en fonction de sa valeur actuelle
    function setMultiplier() {
        let qtm = ""
        switch (qtmulti) {
            case "x1":
                qtm = "x10"
                break
            case "x10":
                qtm = "x100"
                break
            case "x100":
                qtm = "Max"
                break
            case "Max":
                qtm = "x1"
                break
        }
        //Maj du useState qtmulti
        setQtmulti((prevQtMulti) => {
            let newQtMulti = prevQtMulti
            newQtMulti = qtm
            return newQtMulti
        })
    }


    //Une fois qu'un produit est produit, on met à jour le gain (score et money)
    function onProductionDone(p: Product, qt: number): void {
        //Calcul du gain (score et money) en fonction de la quantité de la production
        let gain = qt * (p.quantite * p.revenu);
        //Maj du world pour sauvegarder le score et la money calculés
        addToScore(gain);
    }

    //Maj du world pour sauvegarder le score et la money calculés
    function addToScore(gain: number) {
        const newScore = world.score + gain;
        const newMoney = world.money + gain;
        setWorld((prevWorld) => {
            return {...prevWorld, money: newMoney, score: newScore}
        })

    }



    //Une fois un produit acheté, on maj la quantité du produit, son cout et l'argent de l'user
    //En paramètre : le produit, le nombre d'exemplaire et le cout du lot que l'on veut acheter
    function onProductionBuy(p: Product, qt: number, prix: number) {
        //Si notre porte-monnaie nous permet l'achat
        if (world.money >= prix) {
            //On sélectionne la quantité de produit que l'on veut acheter
            let quant = 0
            switch (qtmulti) {
                case "x1":
                    quant = 1
                    break
                case "x10":
                    quant = 10
                    break
                case "x100":
                    quant = 100
                    break
                case "Max":
                    quant = qt
                    break
            }
            //On calcule le nouveau cout et la nouvelle quantité
            p.cout = p.cout * p.croissance ** quant
            p.quantite = p.quantite + quant
            const newProduct = [...world.products]
            //On calcule l'argent restant de l'user
            const newMoney = world.money - prix
            //Maj du produit et de la money
            setWorld((prevWorld) => {
                return {...prevWorld, money: newMoney, products: newProduct}
            })

            //Vérification qu'il n'y ait pas un seuil à débloquer
            seuilUnlocked(p)

            //Mutation
            acheterQtProduit({variables: {id: p.id, quantite: quant}});
        }
    }

    // Embaucher un manager
    function onManagerHired(manager:Palier){
        // Débloquer le manager que s'il n'est pas déjà débloqué
        if(manager.unlocked===false) {

            //Calcul de l'argent restant
            world.money = world.money - manager.seuil;
            //Passage du manager à "débloqué"
            world.products[manager.idcible - 1].managerUnlocked = true;
            // Mise à jour de tous les hooks d'état
            const newManagers = [...world.managers];
            const newProductUnlocked = [...world.products]
            setWorld((prevWorld) => {
                return {...prevWorld, money: world.money, managers: newManagers, newProductUnlocked};
            });
            // Afficher d'un message qui confirme l'embauche
            setSnackBarManagers(true);

            //Mutation
            engagerManager({variables: {name: manager.name}});
        }
    }

    //fonction pour appliquer le bonus passé en paramètre
    function appliquerBoost(upgrade:Palier):void{
        //on récupère l'id du produit associé à l'unlock
        let idProduit = upgrade.idcible;
        //on récupère le produit grâce à son id
        if (idProduit > 0) {
            let produit = world.products.find((p) => p.id === idProduit) as Product
            appliquerBoostSurProduit(produit,upgrade)

        } else if (idProduit === 0){ //concerne tous les produits
            world.products.forEach((produit) => {
                appliquerBoostSurProduit(produit, upgrade)
            })
        } else { // si -1 : le bonus augmente l'efficacité des anges
            appliquerBoostSurAnge(upgrade)
        }
    }

    //fonction pour appliquer le boost sur le produit passé en paramètre
    function appliquerBoostSurProduit(produit:Product,upgrade:Palier){
        //type de boost
        //boost de revenu
        if (upgrade.typeratio === "gain") {
            produit.revenu = produit.revenu*upgrade.ratio
        } else if (upgrade.typeratio === "vitesse"){ // boost de vitesse
            produit.vitesse = Math.round(produit.vitesse/upgrade.ratio)
        } else { //boost d'ange
            appliquerBoostSurAnge(upgrade)
        }
    }

    //fonction qui applique le bonus sur les anges
    function appliquerBoostSurAnge(upgrade:Palier){
        //on augmente le bonus de production apporté par les anges selon la quantité de bonus de l’upgrade
        world.angelbonus += upgrade.ratio
    }


    function onUpgradeBuy(upgrade:Palier):void{
        //on débloque l'upgrade
        upgrade.unlocked = true;
        let newMoney = world.money - upgrade.seuil
        const newUpgrades = [...world.upgrades]


        appliquerBoost(upgrade)
        setWorld((prevWorld) => {
            return { ...prevWorld, money: newMoney, upgrades: newUpgrades };
        });

        //mutation
        acheterCashUpgrade({ variables: { name: upgrade.name } });
    }

    function onAngelUpgradeBuy(angelupgrade:Palier){
        //on cherche le cashUpgrade d'après son nom
        let nomAngelUpgrade = angelupgrade.name
        let angelUpgrade = world.angelupgrades.find((au) => au.name === nomAngelUpgrade) as Palier

        //on débloque l'angel upgrade
        angelUpgrade.unlocked = true

        //on déduit le coût de l'angel upgrade au nombre d'anges actifs
        let newNbAnges = world.activeangels - angelUpgrade.seuil
        const newAngelUpgrades = [...world.angelupgrades]

        //appliquer le boost
        appliquerBoost(angelUpgrade);

        setWorld((prevWorld) => {
            return { ...prevWorld, activeangels: newNbAnges, upgrades: newAngelUpgrades };
        });

        //mutation
        acheterAngelUpgrade({ variables: { name: angelupgrade.name } })

    }

    async function onResetWorld() {

        //appel de la mutation
        const {data} = await resetWorld({variables: {name: username}})
        loadworld = data.resetWorld

        setWorld(JSON.parse(JSON.stringify(data.resetWorld)) as World);
    }

    // Calcul du nombre de manager engageable pour l'afficher dans le badge
    function buyManagerPossible(managers : Palier[]){
        //On parcourt les managers pour compter ceux que l'on peut engager
        let r =0;
        for(let i=0; i<managers.length;i++){
            //Engageable que si :
                //le seuil du manager est inférieur à l'argent de l'user
                //l'user possède au moins 1 produit sur lequel le manager peut travailler
                //il n'est pas déjà engagé
            if(managers[i].seuil<=world.money && world.products[managers[i].idcible-1].quantite >0 && !managers[i].unlocked){
                r ++;
            }
        }
        return r;
    }

    function buyUpgradePossible(upgrades : Palier[]){
        let r=0
        for(let i=0; i<upgrades.length;i++){
            if(upgrades[i].seuil<=world.money && world.products[upgrades[i].idcible-1].quantite >0 && !upgrades[i].unlocked){
                r ++;
            }
        }
        return r
    }

    function buyAngelUpgradePossible(angelupgrades : Palier[]){
        let r=0
        for(let i=0; i<angelupgrades.length;i++){
            if (angelupgrades[i].idcible-1<=0){
                if(angelupgrades[i].seuil<=world.activeangels && !angelupgrades[i].unlocked){
                    r ++;
                }
            } else {
                if(angelupgrades[i].seuil<=world.activeangels && world.products[angelupgrades[i].idcible-1].quantite >0 && !angelupgrades[i].unlocked){
                    r ++;
                }
            }
        }
        return r
    }

    function buyInvestorsPossible(){
        let r=0
        if ((150 * Math.sqrt(world.score/Math.pow(10, 15))-world.totalangels) > 0) {
            r = Math.floor(150 * Math.sqrt(world.score/Math.pow(10, 15))-world.totalangels)
        }
        return r
    }

    //Fermer la snackbar
    function CloseIcon(props: { fontSize: string }) {
        return null;
    }

    //Déblocage d'un seuil en fonction de la quantité de produit
    function seuilUnlocked(p : Product){
        //unlocks individuels
        p.paliers.forEach(unlock => {
            //Si le seuil n'est pas débloqué et que la quantité du produit vient de dépasser le seuil
            if(unlock.unlocked===false && unlock.seuil <= p.quantite){

                //Maj des données en fonction du type de l'amélioration
                if (unlock.typeratio === "vitesse") {
                    p.vitesse = Math.round(p.vitesse / unlock.ratio)
                } else if (unlock.typeratio === "gain") {
                    p.revenu = p.revenu * unlock.ratio
                } else if (unlock.typeratio === "ange") {
                    world.angelbonus += unlock.ratio
                }

                //Déblocage de l'unlock
                unlock.unlocked = true
                //maj du useState
                const newUnlocks = [...world.products]
                setWorld((prevWorld)=>{
                    return{...prevWorld, products:newUnlocks}
                })
                //Affichage de la snackBar
                setSnackBarUnlocks(true)
            }
        })

        //allunlocks
        //On parcourt tous les allunlocks
        world.allunlocks.forEach(all => {
            //on s'occupe que de ceux qui ne sont pas débloqués
            if(!all.unlocked) {
                //on initialise un compteur
                let n = 0
                //on compte combien de produit ont une quantité supérieur au seuil
                world.products.forEach(prod => {
                    if (all.seuil <= prod.quantite){
                        n++
                    }
                        })
                //Si on a le meme nombre de produit avec une quantité sup au seuil que le nombre de produit existant
                if(n===world.products.length){
                    //Maj des données des produits
                    if(all.typeratio === "ange"){
                        world.angelbonus = world.angelbonus + all.ratio
                    }else{
                        //on parcourt tous les produits pour mettre à jours chaque produit
                        world.products.forEach(prod => {
                            if(all.typeratio === "vitesse"){
                                prod.vitesse = Math.round(prod.vitesse/all.ratio)
                            }
                            if(all.typeratio === "gain"){
                                prod.revenu = Math.round(prod.revenu * all.ratio)
                            }
                        })
                    }

                    //Déblocage de l'unlock
                    all.unlocked = true
                    //maj du useState
                    const newUnlock = [...world.allunlocks]
                    setWorld((prevWorld)=>{
                        return{...prevWorld, allunlocks:newUnlock}
                    })
                    //Affichage de la snackBar
                    setSnackBarUnlocks(true)
                }
            }
        })
    }


    return (
        <div className="App">
            <header className="header">
                <div className="nomLogoWorld">
                    <img className={'logo'} src={url + world.logo}/>
                    {world.name}
                </div>
                <span className="money" dangerouslySetInnerHTML={{__html: transform(world.money)}}></span>

                <div className="qmulti_mediator">
                    <img src={process.env.PUBLIC_URL + "/mediator.png"} onClick={() => {
                        setMultiplier()
                    }}
                    />
                    <p>{qtmulti}</p>

                </div>



            </header>
            <main className="main">
                <div className="partieGaucheCoulisses">
                    <Menu loadWorld={world}
                          loadsnackBarManagers={snackBarManagers}
                          loadsnackBarUnlocks={snackBarUnlocks}
                          loadsnackBarUpgrades={snackBarUpgrades}
                          loadsnackBarAngelUpgrades={snackBarAngelUpgrades}
                          loadsnackBarResetWorld={snackBarResetWorld}
                          onManagerHired={onManagerHired}
                          onUpgradeBuy={onUpgradeBuy}
                          onAngelUpgradeBuy={onAngelUpgradeBuy}
                          onResetWorld = {onResetWorld}
                          buyManagerPossible={buyManagerPossible}
                          buyUpgradePossible={buyUpgradePossible}
                          buyAngelUpgradePossible={buyAngelUpgradePossible}
                          buyInvestorsPossible = {buyInvestorsPossible}
                    />

                    <Snackbar
                        open={snackBarManagers}
                        autoHideDuration={5000}
                        message="Nouveau manager embauché !"
                        action={
                            <IconButton
                                size="small"
                                aria-label="close"
                                color="secondary"
                                onClick={() => setSnackBarManagers(false)}
                                style={{backgroundColor: 'red'}}
                            >
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        }
                    />
                    <Snackbar
                        open={snackBarUnlocks}
                        autoHideDuration={5000}
                        message="Nouveau palier atteint !"
                        action={
                            <IconButton
                                size="small"
                                aria-label="close"
                                color="secondary"
                                onClick={() => setSnackBarUnlocks(false)}
                                style={{backgroundColor: 'red'}}
                            >
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        }
                    />
                    <Snackbar
                        open={snackBarUpgrades}
                        autoHideDuration={5000}
                        message="Nouveau upgrade acheté !"
                        action={
                            <IconButton
                                size="small"
                                aria-label="close"
                                color="secondary"
                                onClick={() => setSnackBarUpgrades(false)}
                                style={{backgroundColor: 'red'}}
                            >
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        }
                    />
                    <Snackbar
                        open={snackBarAngelUpgrades}
                        autoHideDuration={5000}
                        message="Nouvel upgrade d'ange débloqué !"
                        action={
                            <IconButton
                                size="small"
                                aria-label="close"
                                color="secondary"
                                onClick={() => setSnackBarAngelUpgrades(false)}
                                style={{backgroundColor: 'red'}}
                            >
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        }
                    />

                    <Snackbar
                        open={snackBarResetWorld}
                        autoHideDuration={5000}
                        message="Reset du monde !"
                        action={
                            <IconButton
                                size="small"
                                aria-label="close"
                                color="secondary"
                                onClick={() => setSnackBarResetWorld(false)}
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
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadusername={username}
                    />
                    </div>
                    <div className="case_produit"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product={world.products[1]}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadusername={username}
                    />
                    </div>
                    <div className="case_produit"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product={world.products[2]}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadusername={username}
                    />
                    </div>
                    <div className="case_produit"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product={world.products[3]}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadusername={username}
                    />
                    </div>
                    <div className="case_produit"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product={world.products[4]}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadusername={username}
                    />
                    </div>
                    <div className="case_produit"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product={world.products[5]}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadusername={username}
                    />
                    </div>


                </div>

            </main>
        </div>
    );
}
