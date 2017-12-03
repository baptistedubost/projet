const TodoModel = require("./TodoModel");
const UtilisateurModel = require("./UtilisateurModel");
const ProduitModel = require("./ProduitModel");
const CommandeModel = require("./CommandeModel");


module.exports = {
	Todo: TodoModel,
	Utilisateur: UtilisateurModel,
	Produit: ProduitModel,
	Commande: CommandeModel,
};
