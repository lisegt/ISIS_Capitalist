import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {gql} from "@apollo/client";

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
    useEffect(() => {
        let username = localStorage.getItem("username");
        if(username == undefined) {
            localStorage.setItem("username", "Player" + Math.floor(Math.random() * 10000));
        }else{setUsername(username);}
    },[]);
    const onUserNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {

        localStorage.setItem("username", event.currentTarget.value);
        setUsername(event.currentTarget.value);
    };

  return (
    <div className="App">
      <header className="header">
          <div> logo monde </div>
          <div> argent </div>
          <div> multiplicateur </div>
          <div> ID du joueur </div>
          <input type="text" value={username} onChange={onUserNameChanged}/>
      </header>
        <main className="main">
            <div> liste des boutons de menu </div>
            <div className="product">
                <div> premier produit</div>
                <div> second produit</div>
                <div> troisième produit</div>
                <div> quatrième produit</div>
                <div> cinquième produit</div>
                <div> sixième produit</div>
            </div>
        </main>
    </div>
  );
}




export default App;
