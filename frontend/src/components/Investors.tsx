import '../css/App.css';
import '../css/Investors.css';
import {Palier, World} from "../world";
import {Badge, Button, IconButton, Snackbar} from "@mui/material";
import React, {useState} from "react";

//================================== Investors ===================================
type InvestorProps = {
    loadworld : World
    onResetWorld: () => void
    updateNbInvestorsCanBuy : () => void;
}

const url = 'http://localhost:4000/'

export default function Investor({ loadworld,onResetWorld, updateNbInvestorsCanBuy }: InvestorProps){
    //================================== UseStates ===================================
    const [world, setWorld] = useState(loadworld);

    const [showInvestors, setShowInvestors] = useState(true);


    return(
        <div> {showInvestors &&
            <div className="modal_anges">
                <div>
                    <h1 className="title">Investir dans des Anges</h1>
                </div>
                <div className={"investors"}>
                    <div>
                        <div className={"contenu_anges"}>
                            <div className={"img_ange"}>
                                <img className={"logo_ange"} src={url + "/icones/ange.png"}/>
                            </div>
                            <div className={"anges_en_poche"}>
                                <h3>{world.activeangels}  Anges en poche</h3>
                                <h3>Bonus par ange : {world.angelbonus} %</h3>
                            </div>

                        </div>

                        <div className={"div_acheterAnges"}>
                            {((150 * Math.sqrt(world.score/Math.pow(10, 15))-world.totalangels) <= 1) ? (
                                <button className={"btn_acheterAnges"}  onClick={() => {onResetWorld() ; updateNbInvestorsCanBuy() }}
                                        disabled={Math.floor(150 * Math.sqrt(world.score/Math.pow(10, 15))-world.totalangels) <= 0}>
                                    VOUS N'AVEZ PAS ASSEZ GAGNÉ D'ARGENT POUR INVESTIR DANS DES ANGES !
                                </button>
                            ) : (
                                <button className={"btn_acheterAnges"}  onClick={() => {onResetWorld() ; updateNbInvestorsCanBuy() }}
                                        disabled={Math.floor(150 * Math.sqrt(world.score/Math.pow(10, 15))-world.totalangels) <= 0}>
                                    RESET LE MONDE ET INVESTIR DANS {Math.floor(150 * Math.sqrt(world.score/Math.pow(10, 15))-world.totalangels)} ANGES !
                                </button>
                            )
                            }
                        </div>


                    </div>
                </div>
            </div>
        }</div>
    )
}