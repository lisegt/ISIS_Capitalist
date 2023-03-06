module.exports = {
    "name": "Music World",
    "logo": "icones/logomonde.png",
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
                    "name": "Opéra",
                    "logo": "icones/micro.jpg",
                    "seuil": 25,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                },
                {
                    "name": "Gospel",
                    "logo": "icones/micro.jpg",
                    "seuil": 50,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                },
                {
                    "name": "R&B",
                    "logo": "icones/micro.jpg",
                    "seuil": 100,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                },
                {
                    "name": "Rap",
                    "logo": "icones/micro.jpg",
                    "seuil": 150,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                }
            ],
        },
        {
            "id": 2,
            "name": "flute",
            "logo": "icones/flute.png",
            "cout": 60,
            "croissance": 1.07,
            "revenu": 1,
            "vitesse": 1000,
            "quantite": 0,
            "timeleft": 0,
            "managerUnlocked": false,
            "paliers": [
                {
                    "name": "Ballade",
                    "logo": "icones/flute.png",
                    "seuil": 25,
                    "idcible": 2,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                },
                {
                    "name": "Baroque",
                    "logo": "icones/flute.png",
                    "seuil": 50,
                    "idcible": 2,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                },
                {
                    "name": "Jazz",
                    "logo": "icones/flute.png",
                    "seuil": 100,
                    "idcible": 2,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                },
                {
                    "name": "Contemporain",
                    "logo": "icones/flute.png",
                    "seuil": 150,
                    "idcible": 2,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                }
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

