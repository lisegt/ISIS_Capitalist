module.exports = {
    "name": "Music world",
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
            "paliers": [
                {
                    "name": "1er Palier vitesse micro",
                    "logo": "icones/palier1.jpg",
                    "seuil": 25,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                },
                {
                    "name": "2e Palier gain micro",
                    "logo": "icones/palier2.jpg",
                    "seuil": 50,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "gain",
                    "unlocked": false
                },
                {
                    "name": "3e palier gain micro",
                    "logo": "icones/palier3.jpg",
                    "seuil": 100,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "gain",
                    "unlocked": false
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
            "quantite": 0,
            "timeleft": 0,
            "managerUnlocked": false,
            "paliers": [
                {
                    "name": "1er Palier vitesse flute",
                    "logo": "icones/palier1.jpg",
                    "seuil": 25,
                    "idcible": 2,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                },
                {
                    "name": "2e Palier gain flute",
                    "logo": "icones/palier2.jpg",
                    "seuil": 50,
                    "idcible": 2,
                    "ratio": 2,
                    "typeratio": "gain",
                    "unlocked": false
                },
                {
                    "name": "3e palier gain flute",
                    "logo": "icones/palier3.jpg",
                    "seuil": 100,
                    "idcible": 2,
                    "ratio": 2,
                    "typeratio": "gain",
                    "unlocked": false
                },
            ],
        }
    ],
    "allunlocks": [
        {
            "name": "1er Unlock général gain",
            "logo": "icones/unlock1.jpg",
            "seuil": 25,
            "idcible": 0,
            "ratio": 2,
            "typeratio": "gain",
            "unlocked": false
        },
        {
            "name": "Nom du deuxieme unlock général",
            "logo": "icones/unlock2.jpg",
            "seuil": 50,
            "idcible": 0,
            "ratio": 2,
            "typeratio": "gain",
            "unlocked": false
        },
        {
            "name": "Nom du troisieme unlock général",
            "logo": "icones/unlock3.jpg",
            "seuil": 100,
            "idcible": 0,
            "ratio": 2,
            "typeratio": "gain",
            "unlocked": false
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
            "unlocked": false
        },
        {
            "name": "Casser la voiiiiix - vitesse",
            "logo": "icones/micro.png",
            "seuil": 1e3,
            "idcible": 1,
            "ratio": 2,
            "typeratio": "vitesse",
            "unlocked": false
        },
        {
            "name": "Cash upgrade flute - gain",
            "logo": "icones/micro.png",
            "seuil": 1e3,
            "idcible": 2,
            "ratio": 3,
            "typeratio": "gain",
            "unlocked": false
        },
        {
            "name": "Cash upgrade flute - vitesse",
            "logo": "icones/micro.png",
            "seuil": 1e3,
            "idcible": 2,
            "ratio": 2,
            "typeratio": "vitesse",
            "unlocked": false
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
            "unlocked": false
        }
    ],
    "managers": [
        {
            "name": "Mariah Carey",
            "logo": "icones/MariahCarey.png",
            "seuil": 100,
            "idcible": 1,
            "ratio": 0,
            "typeratio": "vitesse",
            "unlocked": false
        },
        {
            "name": "Jean-Sebastien Bach",
            "logo": "icones/Bach.png",
            "seuil": 1500,
            "idcible": 2,
            "ratio": 0,
            "typeratio": "vitesse",
            "unlocked": false
        },
        {
            "name": "Stradivarius",
            "logo": "icones/Stradivarius.png",
            "seuil": 10000,
            "idcible": 3,
            "ratio": 0,
            "typeratio": "vitesse",
            "unlocked": false
        },
        {
            "name": "Guitariste de Sultan of Swing",
            "logo": "icones/Guitariste.png",
            "seuil": 50000,
            "idcible": 4,
            "ratio": 0,
            "typeratio": "vitesse",
            "unlocked": false
        },
    ]
};

