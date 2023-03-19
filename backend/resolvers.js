//pour la sauvegarde des mondes des joueurs dans le dossier userworlds
const fs = require("fs");

// le monde de base défini dans world.js
let world = require("./world")

function saveWorld(context) {
    context.world.lastupdate = Date.now().toString() ;

    fs.writeFile("userworlds/" + context.user + "-world.json", JSON.stringify(context.world), err => {
        if (err) {
            console.error(err)
            throw new Error("Erreur d'écriture du monde côté serveur...")
        }
    })

}
// à appeler ds toutes mutations et getWorld
function calcul_score(context) {
    let liste_produits = context.world.products
    let temps_ecoule = Date.now() - parseInt(context.world.lastupdate)

    // le gain
    let gain = 0;

    for (let p in liste_produits) {

        let produit = liste_produits[p]

        //la production pendant le temps d'absence
        let nb_production = 0
        let en_production = false

        //s'il reste du timeleft, le produit est encore en production
        if (produit.timeleft > 0) {
            en_production = true
        }

        //il reste du temps avant la fin de production
        if (temps_ecoule < produit.timeleft) {
            produit.timeleft = produit.timeleft - temps_ecoule
        } else {
            //le produit n'est pas automatisé
            if (!produit.managerUnlocked) {
                // il restait du timeleft
                if (en_production) {
                    nb_production = 1
                    produit.timeleft = 0
                }
            } else {
                // le produit est automatisé
                nb_production = ((temps_ecoule - produit.timeleft) / produit.vitesse) + 1
                produit.timeleft = temps_ecoule % produit.vitesse
            }
        }
        gain += nb_production * produit.quantite * produit.revenu * (1 + context.world.activeangels*context.world.angelbonus/100)
        //pb gain quand un produit est managé --> conversion Date en ms pr etre divisible par vitesse de production
    }

    context.world.score += gain
    context.world.money += gain

}
//fonction pour appliquer le boost passé en paramètre
function appliquerBoost(palier, context){

    //on récupère l'id du produit associé à l'unlock
    let idProduit = palier.idcible;
    console.log(idProduit)
    //on récupère le produit grâce à son id
    if (idProduit > 0) {
        let produit = context.world.products.find((p) => p.id === idProduit);
        console.log("1 produit")
        console.log(produit.name)
        appliquerBoostSurProduit(produit, palier, context)

    } else if (idProduit === 0){ //concerne tous les produits
        context.world.products.forEach((produit) => {
            console.log("bonus sur tous les produits")
            appliquerBoostSurProduit(produit, palier, context)
        })
    } else { // si -1 : le bonus augmente l'efficacité des anges
        appliquerBoostSurAnge(palier, context)
    }
}
//fonction pour appliquer le boost sur le produit passé en paramètre
function appliquerBoostSurProduit(produit,palier, context){
    //type de boost
    //boost de revenu
    if (palier.typeratio === "gain") {
        produit.revenu = produit.revenu*palier.ratio
    } else if (palier.typeratio === "vitesse"){ // boost de vitesse
        produit.vitesse = Math.round(produit.vitesse/palier.ratio)
    } else { //boost d'ange
        appliquerBoostSurAnge(palier, context)
    }
}

//fonction qui applique le bonus sur les anges
function appliquerBoostSurAnge(palier, context){
    //on augmente le bonus de production apporté par les anges selon la quantité de bonus de l’upgrade
    context.world.angelbonus += palier.ratio
}


function verifierAllUnlocks(seuil, context){
    let produits = context.world.products

    //tableau contenant les états des unlocks de tous les produits, pour un seuil donné
    let etatsUnlocks = [] ;
    console.log("tableau bool : " +etatsUnlocks)

    //on suppose que tous les produits ont les mêmes paliers
    produits.forEach((produit) => {
        //pour chaque produit, on récupère l'unlock correspondant au seuil passé en paramètre
        let unlockToTest = produit.paliers.find((palier) => palier.seuil === seuil)

        //on remplit le tableau de booléens
        etatsUnlocks.push(unlockToTest.unlocked)
    })

    //on teste les booléens du tableau etatsUnlocks
    if (etatsUnlocks.every(bool => bool)){
        console.log("allunlock débloqué")
        //tous les unlocks sont true, on peut débloquer le allUnlock du seuil correspondant

        //unlock à débloquer
        let allUnlockADebloquer = context.world.allunlocks.find((allunlock) => allunlock.seuil === seuil)
        allUnlockADebloquer.unlocked = true

        //on applique le boost du allUnlock : le revenu de chaque produit est multiplié par le ratio
        produits.forEach((produit) => {
            appliquerBoostSurProduit(produit, allUnlockADebloquer,context)
        })
    }
}

module.exports = {
    Query: {
        getWorld(parent, args, context)  {
            calcul_score(context)
            saveWorld(context)
            return context.world
        } },
    Mutation: {
        acheterQtProduit(parent, args, context) {
            calcul_score(context)

            console.log(`produit ${args.id} acheté`)
            console.log(context.world.money)

            //trouver le produit
            let idProduit = args.id;
            let quantiteAjout = args.quantite;

            //on récupère le produit associé à l'identifiant
            let produit = context.world.products.find((p) => p.id === idProduit)

            //les paliers du produit
            let paliers = produit.paliers

            if (produit === undefined) {
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas.`)

            } else {

                //on déduit le cout de l'achat de l'argent du monde = somme d'une suite géométrique
                let q = produit.croissance
                let coutAchat = produit.cout*((1-Math.pow(q,quantiteAjout))/(1-q))

                context.world.money = context.world.money-coutAchat ;
                console.log(context.world.money)

                //on incrémente la qté
                produit.quantite += quantiteAjout ;

                //màj du cout d'achat produit, coût du produit n+1
                produit.cout = Math.pow(q,quantiteAjout)*produit.cout

                //prise en compte des unlocks
                //on récupère tous les paliers qui sont encore lock et dont la quantité de produit est supérieure au seuil du palier
                //autrement dit, tous les paliers qu'on va débloquer
                paliers = paliers.filter(palier => !palier.unlocked && produit.quantite>=palier.seuil)

                // on parcourt la liste des paliers à débloquer
                paliers.forEach((palier) => {
                    //on les unlock
                    palier.unlocked = true ;
                    //appliquer l'effet du seuil
                    appliquerBoost(palier, context)

                    //vérifier l'état de tous les unlocks
                    verifierAllUnlocks(palier.seuil, context)
                });
            }

            //sauver le monde pour mémoriser changements opérés
            saveWorld(context) ;
            console.log(context.world.money)
            return produit ;
        },

        lancerProductionProduit(parent, args, context) {
            calcul_score(context)

            //on récupère le produit associé à l'identifiant
            let idProduit = args.id;
            let produit = context.world.products.find((p) => p.id === idProduit)

            if (produit === undefined) {
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas.`)
            } else {
                produit.timeleft = produit.vitesse
            }

            saveWorld(context) ;

            return produit ;
        },

        engagerManager(parent, args, context) {
            calcul_score(context)

            //on cherche le manager
            let nomManager = args.name;
            let manager = context.world.managers.find((m) => m.name === nomManager)

            if (manager === undefined) {
                throw new Error(`Le manager ${args.name} n'existe pas.`)
            } else {
                //produit dont il est manager
                let productManaged = context.world.products.find((p) => p.id === manager.idcible)

                //pour débloquer le manager
                //du côté du produit
                productManaged.managerUnlocked = true ;
                //du côté du manager
                manager.unlocked = true
            }
            saveWorld(context) ;

            return manager ;
        },

        acheterCashUpgrade(parent, args, context){
            calcul_score(context)

            //on cherche le cashUpgrade d'après son nom
            let nomCashUpgrade = args.name
            let cashUpgrade = context.world.upgrades.find((cu) => cu.name === nomCashUpgrade)

            if (cashUpgrade === undefined) {
                throw new Error(`Le cash upgrade ${args.name} n'existe pas.`)
            } else {
                //on débloque le cashupgrade
                cashUpgrade.unlocked = true

                //on déduit le prix du cashUpgrade à la money du monde
                context.world.money -= cashUpgrade.seuil

                //appliquer le boost
                appliquerBoost(cashUpgrade, context);
            }
            saveWorld(context)
            return cashUpgrade
        },

        acheterAngelUpgrade(parent, args, context){
            calcul_score(context)

            //on cherche le cashUpgrade d'après son nom
            let nomAngelUpgrade = args.name
            let angelUpgrade = context.world.angelupgrades.find((au) => au.name === nomAngelUpgrade)

            if (angelUpgrade === undefined) {
                throw new Error(`L'angel upgrade ${args.name} n'existe pas.`)
            } else {
                //on débloque l'angel upgrade
                angelUpgrade.unlocked = true

                //on déduit le coût de l'angel upgrade au nombre d'anges actifs
                context.world.activeangels -= angelUpgrade.seuil

                //appliquer le boost
                appliquerBoost(angelUpgrade, context);
            }
            saveWorld(context)
            return angelUpgrade
        },

        resetWorld(parent, args, context){

            let angesTotal = context.world.totalangels
            let angesActifs = context.world.activeangels

            console.log(angesTotal)
            console.log(angesActifs)

            //réinitialisation du monde avec monde de base
            let newWorld = world

            newWorld.totalangels = angesTotal
            newWorld.activeangels = angesActifs

            //accumuler les anges supplémentaires gagnés lors de la partie en cours + récupération des propriétés de l'ancien monde
            let totalAngelsToReset = Math.round(150*Math.sqrt(context.world.score/(Math.pow(10,15))) - context.world.totalangels)
            let activeAngelsToReset = Math.round(150*Math.sqrt(context.world.score/(Math.pow(10,15))) - context.world.totalangels)

            //si on reset avant que le nouveau score dépasse l'ancien score
            //le nombre d'anges reste égal
            if (totalAngelsToReset > 0){
                newWorld.totalangels += totalAngelsToReset
                newWorld.activeangels += activeAngelsToReset
            }

            newWorld.lastupdate = Date.now().toString()
            context.world = newWorld
            saveWorld(context)
            return newWorld
        }
    }
};