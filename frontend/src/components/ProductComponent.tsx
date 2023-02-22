import {Product} from "../world";
import React from "react";
const url = 'https://isiscapitalistgraphql.kk.kurasawa.fr/'

type ProductProps = {
    product: Product
}
export default function ProductComponent({ product} : ProductProps) {
    return (
        <img className = 'round' src={url + product.logo} />)
}
//faire le code html d'affichage d'un produit