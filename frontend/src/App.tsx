import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
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
    const [username, setUsername] = useState("")
    const client = useApolloClient();
    useEffect(() => {
        let username = localStorage.getItem("username");
        if (username == undefined) {
            localStorage.setItem("username", "Player" + Math.floor(Math.random() * 10000));
        } else {
            setUsername(username);
        }
    }, []);
    const onUserNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {

        localStorage.setItem("username", event.currentTarget.value);
        setUsername(event.currentTarget.value);
        //Quand le nom d'utilisateur change --> forcer le client à refabriquer la requête.
        client.resetStore();
    };
    const {loading, error, data, refetch} = useQuery(GET_WORLD, {
        context: {headers: {"x-user": username}}
    });
    let corps = undefined
    if (loading) corps = <div> Loading... </div>
    else if (error) corps = <div> Erreur de chargement du monde ! </div>
    else corps = <Main loadworld={data.getWorld} username={username} />
    return (
        <div className = "nomJoueur">
            <div> Your ID :</div>
            <input type="text" value={username} onChange={onUserNameChanged}/>
            {corps}
        </div>
    );

}




export default App;
