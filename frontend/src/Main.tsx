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
    resetWorld {
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
    const [qtmulti, setQtmulti]=useState("x1");
    const [bonusAnges, setBonusAnges]=useState(world.angelbonus);
    const [resetAnge, setResetAnge] = useState(0);

    //qtAcheter a une copie car c'est un tableau, on utilise la copie pour mettre le useState à jour en modifiant que la valeur que l'on souhaite modifier
    const[qtAcheter, setQtAcheter]=useState([1,1,1,1,1,1]);
    const newQtAcheter = [...qtAcheter];

    //Cout du lot
    const [coutLot, setCoutLot]=useState(world.products.map((prod => prod.cout)))

    //productPrice a une copie car c'est un tableau, on utilise la copie pour mettre le useState à jour en modifiant que la valeur que l'on souhaite modifier
    const [productPrice, setProductPrice] = useState([world.products[0].cout,
        world.products[1].cout,
        world.products[2].cout,
        world.products[3].cout,
        world.products[4].cout,
        world.products[5].cout])
    const newProductPrice = [...productPrice];

    //Les snackbar servent à notifier le joueur du message que l'on souhaite
    const [snackBarManagers, setSnackBarManagers] = useState(false);
    const [snackBarUnlocks, setSnackBarUnlocks] = useState(false);
    const [snackBarUpgrades, setSnackBarUpgrades] = useState(false);
    const [snackBarAngelUpgrades, setSnackBarAngelUpgrades] = useState(false);

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
    useEffect(() => {
        console.log(qtmulti);
        calcCoutLot(parseInt(qtmulti.substring(1)))
    }, [qtmulti]);

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

    const [newWorld] = useMutation(RESET_WORLD,
        {
            context: { headers: { "x-user": username } },
            onError: (error): void => {

            }
        }
    )


    //Téléchargement du world quand il est modifié
    useEffect(() => {
        setWorld(JSON.parse(JSON.stringify(loadworld)) as World)
    }, [loadworld])

    //Combien de quantité je peux acheter avec tout l'argent que j'ai ?
    function setMultiplier() {
        //Il y a un décallage des qtmulti (lorsque qtmulti=x1 il faut que la quantité achetable soit 10 sinon problèmes dans l'affichage
        let qtm = ""
        let qta = [0,0,0,0,0,0]
        switch (qtmulti) {
            case "x1":
                qtm = "x10"
                world.products.forEach(prod => {
                    qta[prod.id - 1] = 10
                })
                break
            case "x10":
                    qtm = "x100"
                    world.products.forEach(prod => {
                        qta[prod.id - 1] = 100
                    })
                break
            case "x100":
                    qtm = "Max"
                    world.products.forEach(prod => {
                        qta[prod.id-1]=calcMaxCanBuy(prod)
                    })
                break
            case "Max":
                    qtm = "x1"
                    world.products.forEach(prod => {
                        qta[prod.id - 1] = 1
                    })
                break
                }
        setQtmulti((prevQtMulti) => {
            let newQtMulti = prevQtMulti
            newQtMulti = qtm
            return newQtMulti
        })
        //setQtmulti(qtm)
        setQtAcheter(qta)
        //updateCoutLot()
        }




    //Une fois un produit produit, mise à jour du gain
    function onProductionDone(p:Product, qt:number):void{
        let gain = qt*(p.quantite*p.revenu);
        //Modification des useStates, mise à jour du world
        addToScore(gain);
        //Recalcule de la quantité achetable si qtmulti = "Max" --> doit peut etre etre = à "100" à cause du décallage
        if(qtmulti==="Max") {
            updateCalcMaxCanBuy()
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

    /*
    function calcMaxCanBuy(p: Product){
        //Initialisation
        let u0 = p.cout;
        let un = u0;
        //Raison
        let q = p.croissance;
        //Compteur
        let n = 0;
        let coutAchatMoins1 = u0;
        let coutAchat = u0;
        //tant qu'on a plus d'argent que le coutAchat
        while (world.money>=coutAchat){
            n ++;
            un = u0 * q**n;
            coutAchatMoins1=coutAchat
            coutAchat = coutAchat + un;
        }

        //Maj du cout du lot
        setCoutLot((prevCoutLot)=>{
            const newCoutLot = [...prevCoutLot]
            newCoutLot[p.id-1] = coutAchatMoins1
            return newCoutLot
        })

        return n
    }

     */

    function calcMaxCanBuy(p: Product){
        //Compteur
        let n = 0;
        let q = p.croissance
        let coutAchatMoins1 = 0;
        let coutUltimProd = p.cout;
        let coutAchat = p.cout;
        //tant qu'on a plus d'argent que le coutAchat
        while (world.money>=coutAchat){
            n ++;
            coutAchatMoins1=coutAchat
            coutUltimProd = coutUltimProd * q
            coutAchat = coutAchat + coutUltimProd
        }

        //Maj du cout du lot
        setCoutLot((prevCoutLot)=>{
            const newCoutLot = [...prevCoutLot]
            newCoutLot[p.id-1] = coutAchatMoins1
            return newCoutLot
        })

        return n
    }

    function updateCoutLot(){
        world.products.forEach(p => {
            calcCoutLot(parseInt(qtmulti.substring(1)))
        })
    }
/*
    function calcCoutLot(stop : number){
        console.log("stop : "+stop+"; qtmulti :"+qtmulti)
        world.products.forEach(p => {

            //Initialisation
            let u0 = p.cout;
            let un = u0;
            //Raison
            let q = p.croissance;
            //Compteur
            let n = 0;
            let coutAchatMoins1 = u0;
            let coutAchat = u0;

            //tant qu'on a pas atteint la valeur de qtmulti on ne stop pas
            while (n<stop){
                n ++;
                un = u0 * q**n;
                coutAchatMoins1=coutAchat
                coutAchat = coutAchat + un;
            }
            if(qtmulti != "Max") {
                //Maj du cout du lot
                setCoutLot((prevCoutLot) => {
                    const newCoutLot = [...prevCoutLot]
                    newCoutLot[p.id - 1] = coutAchatMoins1
                    return newCoutLot
                })
            }


        })
    }

 */
    function calcCoutLot(stop : number){
        console.log("stop : "+stop+"; qtmulti :"+qtmulti)
        world.products.forEach(p => {
            //Raison
            let q = p.croissance;
            //Compteur
            let n = 0;
            let coutAchatMoins1 = 0;
            let coutUltimProd = p.cout;
            let coutAchat = p.cout;

            //tant qu'on a pas atteint la valeur de qtmulti on ne stop pas
            while (n<stop-1){
                n ++;
                coutAchatMoins1=coutAchat
                coutUltimProd = coutUltimProd * q
                coutAchat = coutAchat + coutUltimProd
            }
            if(qtmulti != "Max") {
                //Maj du cout du lot
                setCoutLot((prevCoutLot) => {
                    const newCoutLot = [...prevCoutLot]
                    newCoutLot[p.id - 1] = coutAchatMoins1
                    return newCoutLot
                })
            }


        })
    }

    function updateCalcMaxCanBuy(){
        world.products.forEach(prod => {
            newQtAcheter[prod.id-1] =calcMaxCanBuy(prod)
        })
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
                //p.cout = Math.pow(q, qt) * p.cout
                updateCoutLot()

            }

        //Recalcule de la quantité achetable si qtmulti = "Max" --> doit peut etre etre = à "100" à cause du décallage
        if(qtmulti=="Max"){
                updateCalcMaxCanBuy()

        }
        //Vérification qu'il n'y a pas un seuil à débloquer
        seuilUnlocked(p)

        //Mutation
        acheterQtProduit({ variables: { id: p.id, quantite : qt } });
    }

    //Changer la valeur de qtmulti en fonction de sa valeur précédente

    /*
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
    */


    // Embaucher un manager
    function onManagerHired(manager:Palier){
        // Débloquer le manager
        if(manager.unlocked===false) {

            // Mise à jour de tous les hooks d'état
            world.money = world.money - manager.seuil;
            world.products[manager.idcible - 1].managerUnlocked = true;
            const newManagers = [...world.managers];
            world.products[manager.idcible-1].managerUnlocked = true;
            const newProductUnlocked = [...world.products]
            setWorld((prevWorld) => {
                return {...prevWorld, money: world.money, managers: newManagers, newProductUnlocked};
            });
            // Afficher le message de la SnackBar
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
        world.activeangels -= angelUpgrade.seuil

        //appliquer le boost
        appliquerBoost(angelUpgrade);

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

    //A implementer
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
                const newUnlock = [...world.products]
                setWorld((prevWorld)=>{
                    return{...prevWorld, newUnlock}
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
                        return{...prevWorld, newUnlock}
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
                        updateCoutLot()
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
                          onManagerHired={onManagerHired}
                          onUpgradeBuy={onUpgradeBuy}
                          onAngelUpgradeBuy={onAngelUpgradeBuy}
                          buyManagerPossible={buyManagerPossible}
                          buyUpgradePossible={buyUpgradePossible}
                          buyAngelUpgradePossible={buyAngelUpgradePossible}
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
                </div>
                <div className="partieCentrale">
                    <div className="case_produit"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product={world.products[0]}
                                                          qtAcheter={qtAcheter}
                                                            loadcoutLot={coutLot}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadusername={username}
                    />
                    </div>
                    <div className="case_produit"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product={world.products[1]}
                                                          qtAcheter={qtAcheter}
                                                                    loadcoutLot={coutLot}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadusername={username}
                    />
                    </div>
                    <div className="case_produit"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product={world.products[2]}
                                                          qtAcheter={qtAcheter}
                                                                    loadcoutLot={coutLot}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadusername={username}
                    />
                    </div>
                    <div className="case_produit"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product={world.products[3]}
                                                          qtAcheter={qtAcheter}
                                                                    loadcoutLot={coutLot}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadusername={username}
                    />
                    </div>
                    <div className="case_produit"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product={world.products[4]}
                                                          qtAcheter={qtAcheter}
                                                                    loadcoutLot={coutLot}
                                                          loadworld={world}
                                                          onProductionBuy={onProductionBuy}
                                                          loadusername={username}
                    />
                    </div>
                    <div className="case_produit"><ProductComponent onProductionDone={onProductionDone}
                                                          qtmulti={qtmulti}
                                                          product={world.products[5]}
                                                          qtAcheter={qtAcheter}
                                                                    loadcoutLot={coutLot}
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

//page 43/50
// mettre à jour l'affichage du cout d'un produit en fonction de qmulti --> manque plus que le max
// bloquer bouton achat quand pas assez de sous
// argent en négatif quand j'achete une trop grosse quantité de produit avec max -->
