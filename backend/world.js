module.exports = {
    "name": "Nom du monde",
    "logo": "icones/logomonde.jpg",
    "money": 0,
    "score": 0,
    "totalangels": 0,
    "activeangels": 0,
    "angelbonus": 2,
    "lastupdate": 0,
    "products": [
        {
            "id": 1,
            "name": "micro",
            "logo": "icones/micro.png",
            "cout": 4,
            "croissance": 1.07,
            "revenu": 1,
            "vitesse": 500,
            "quantite": 1,
            "timeleft": 0,
            "managerUnlocked": false,
            "palliers": [
                {
                    "name": "Nom du premier palier",
                    "logo": "icones/palier1.jpg",
                    "seuil": 25,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": "false"
                },
                {
                    "name": "Nom deuxieme palier",
                    "logo": "icones/palier2.jpg",
                    "seuil": 50,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": "false"
                },
                {
                    "name": "Nom troisieme palier",
                    "logo": "icones/palier3.jpg",
                    "seuil": 100,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": "false"
                }
            ],
        },
        {
            "id": 2,
            "name": "flute",
            "logo": "icones/flute.png",
            "cout": 4,
            "croissance": 1.07,
            "revenu": 1,
            "vitesse": 500,
            "quantite": 1,
            "timeleft": 0,
            "managerUnlocked": false,
            "palliers": [
                {
                    "name": "Nom du premier palier",
                    "logo": "icones/palier1.jpg",
                    "seuil": 25,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": "false"
                },
                {
                    "name": "Nom deuxième palier",
                    "logo": "icones/palier2.jpg",
                    "seuil": 50,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": "false"
                },
                {
                    "name": "Nom troisieme palier",
                    "logo": "icones/palier3.jpg",
                    "seuil": 100,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": "false"
                },
            ],
        }
    ],
    "allunlocks": [
        {
            "name": "Nom du premier unlock général",
            "logo": "icones/unlock1.jpg",
            "seuil": 25,
            "idcible": 0,
            "ratio": 2,
            "typeratio": "gain",
            "unlocked": "false"
        },
        {
            "name": "Nom du deuxieme unlock général",
            "logo": "icones/unlock2.jpg",
            "seuil": 50,
            "idcible": 0,
            "ratio": 2,
            "typeratio": "gain",
            "unlocked": "false"
        },
        {
            "name": "Nom du troisieme unlock général",
            "logo": "icones/unlock3.jpg",
            "seuil": 100,
            "idcible": 0,
            "ratio": 2,
            "typeratio": "gain",
            "unlocked": "false"
        }
    ],
    "upgrades": [
        {
            "name": "Casser la voiiiiix - gain",
            "logo": "icones/micro.png",
            "seuil": 1e3,
            "idcible": 1,
            "ratio": 3,
            "typeratio": "gain",
            "unlocked": "false"
        },
        {
            "name": "Casser la voiiiiix - vitesse",
            "logo": "icones/micro.png",
            "seuil": 1e3,
            "idcible": 1,
            "ratio": 3,
            "typeratio": "vitesse",
            "unlocked": "false"
        }
    ],
    "angelupgrades": [
        {
            "name": "Angel Sacrifice",
            "logo": "icones/angel.png",
            "seuil": 10,
            "idcible": 1,
            "ratio": 3,
            "typeratio": "gain",
            "unlocked": "false"
        }
    ],
    "managers": [
        {
            "name": "Mariah Carey",
            "logo": "icones/MariahCarey.png",
            "seuil": 10,
            "idcible": 1,
            "ratio": 0,
            "typeratio": "gain",
            "unlocked": "false"
        },
        {
            "name": "Jean-Sebastien Bach",
            "logo": "icones/Bach.png",
            "seuil": 20,
            "idcible": 1,
            "ratio": 0,
            "typeratio": "gain",
            "unlocked": "false"
        },
    ]
};
