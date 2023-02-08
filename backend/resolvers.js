//pour la sauvegarde des mondes des joueurs dans le dossier userworlds
const fs = require("fs");

function saveWorld(context) {
    fs.writeFile("userworlds/" + context.user + "-world.json", JSON.stringify(context.world), err => {
        if (err) {
            console.error(err)
            throw new Error("Erreur d'écriture du monde côté serveur...")
        }
    })
}

module.exports = {
    Query: {
        getWorld(parent, args, context)  {
            saveWorld(context)
            return  context.world
        } },
    Mutation: {
    }
};