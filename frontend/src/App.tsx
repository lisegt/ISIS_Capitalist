import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './css/App.css';
import {gql, useApolloClient, useQuery} from "@apollo/client";
import Main from "./Main";
import './assets/styles.css';

const GET_WORLD=gql`
    query getWorld {
    getWorld {
        name
        logo
        money
        activeangels
        angelbonus
        lastupdate
        allunlocks {
            name
            logo
            seuil
            idcible
            ratio
            typeratio
            unlocked
        }
        angelupgrades {
            name
            logo
            seuil
            idcible
            ratio
            typeratio
            unlocked
        }
        managers {
            name
            logo
            seuil
            idcible
            ratio
            typeratio
            unlocked
        }
        upgrades {
            name
            logo
            seuil
            idcible
            ratio
            typeratio
            unlocked
        }
        totalangels
        score
        products {
            id
            name
            logo
            cout
            croissance
            revenu
            vitesse
            quantite
            timeleft
            managerUnlocked
            paliers {
                name
                logo
                seuil
                idcible
                ratio
                typeratio
                unlocked
            }
        }
    }
}`

function App() {
    const [username, setUsername] = useState(localStorage.getItem('username') || `Player${Math.floor(Math.random()*10000)}`);
    const client = useApolloClient();

    //Gérer l'id du joueur
    const onUserNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        localStorage.setItem("username", event.currentTarget.value);
        setUsername(event.currentTarget.value);
        //Quand le nom d'utilisateur change --> forcer le client à refabriquer la requête.
        client.resetStore();
    };

    //Récupération des données du joueur lorsqu'on clique sur "entrer"
    const pressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            window.location.reload();
        }
    };
    const {loading, error, data, refetch} = useQuery(GET_WORLD, {
        context: {headers: {"x-user": username}}
    });

    let corps = undefined
    if (loading) corps = <div> Loading... </div>
    else if (error) corps = <div> Erreur de chargement du monde ! </div>
    else corps = <Main loadworld={data.getWorld} username={username} />
    return (
            <div className={"caseJoueur"}>

                <div className={"case_id"}>
                        <img className = 'round_avatar' src={process.env.PUBLIC_URL + "/musician.png"} />
                    <div className={"id_form"}>
                        <div className={"id_player"}>Votre ID :</div>
                        <input className={"input_id"} type="text" value={username} onChange={onUserNameChanged} onKeyPress = {pressEnter}/>
                    </div>

                </div>
                <div className={"jeu"}>{corps}</div>

            </div>
    );

}




export default App;
