import React from 'react';
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
  return (
    <div className="App">
      <header className="header">
          <div> logo monde </div>
          <div> argent </div>
          <div> multiplicateur </div>
          <div> ID du joueur </div>
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
