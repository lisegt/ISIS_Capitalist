//pour la sauvegarde des mondes des joueurs dans le dossier userworlds
const fs = require("fs");

function saveWorld(context) {
    fs.writeFile("userworlds/" + context.user + "-world.json", JSON.stringify(context.world), err => {
        if (err) {
            console.error(err)
            throw new Error("Erreur d'écriture du monde côté serveur...")
        }
    })
    context.world.lastupdate = Date.now() ;
}

module.exports = {
    Query: {
        getWorld(parent, args, context)  {
            saveWorld(context)
            return context.world
        } },
    Mutation: {
        acheterQtProduit(parent, args, context) {
            //trouver le produit
            let idProduit = args.id;
            let quantiteAjout = args.quantite;

            //on récupère le produit associé à l'identifiant
            let produit = context.world.products.find((p) => p.id === idProduit)

            if (produit === undefined) {
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas.`)
            } else {

                //on déduit le cout de l'achat de l'argent du monde = somme d'une suite géométrique
                let q = produit.croissance
                let coutAchat = produit.cout*((1-Math.pow(q,quantiteAjout))/(1-q))

                context.world.money = context.world.money-coutAchat ;

                //on incrémente la qté
                produit.quantite += quantiteAjout ;

                //màj du cout d'achat produit, coût du produit n+1
                produit.cout = Math.pow(q,quantiteAjout)*produit.cout

            }

            //sauver le monde pour mémoriser changements opérés
            saveWorld(context) ;

            return produit ;
        },

        lancerProductionProduit(parent, args, context) {

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
        }
    }
};