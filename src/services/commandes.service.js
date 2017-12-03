"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "commandes",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "commandes.create" --id_utilisateur "dsdfedv1" 
		create: {
			params: {
				id_utilisateur: "string"
			},
			handler(ctx) {
				var commande = new Models.Commande(ctx.params).create();
				console.log("Commande - create - ", commande);
				if (commande) {
					return Database()
						.then((db) => {
							return db.get("commandes")
								.push(commande)
								.write()
								.then(() => {
									return [commande.id,commande.id_utilisateur]
								})
								.catch(() => {
									return new MoleculerError("commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
								});
					});
				} else {
					return new MoleculerError("commandes", 417, "ERR_CRITIAL", { code: 417, message: "Commande is not valid" } )
				}
			}
		},	

		//	call "commandes.getAll"
		getAll: {
			params: {

			},
			handler(ctx) {
				return Database()
					.then((db) => {
						return db.get("commandes").value();
					});
			}
		},


		//	call "commandes.getUtilisateur" --id_utilisateur
		getUtilisateur: {
			params: {
				id_utilisateur: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verifyUtilisateur", { id_utilisateur: ctx.params.id_utilisateur})
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var comm = db.get("commandes").filter({ id_utilisateur: ctx.params.id_utilisateur }).map('id').value();;
								return comm;
							}).catch(() => {
								return new MoleculerError("commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("commandes", 404, "ERR_CRITIAL", { code: 404, message: "commande doesn't exists" } )
					}
				})
			}
		},
		//	call "commandes.getCommande" --id_commande
		getCommande: {
			params: {
				id_commande: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verifyCommande", { id_commande: ctx.params.id_commande})
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var comm = db.get("commandes").filter({ id: ctx.params.id_commande }).value();;
								return comm;
							}).catch(() => {
								return new MoleculerError("commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("commandes", 404, "ERR_CRITIAL", { code: 404, message: "commande doesn't exists" } )
					}
				})
			}
		},
		//	call "commandes.verifyUtilisateur" --id_utilisateur
		verifyUtilisateur: {
			params: {
				id_utilisateur: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("commandes")
										.filter({ id_utilisateur: ctx.params.id_utilisateur})
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},
		//	call "commandes.verifyCommande" --id_commande
		verifyCommande: {
			params: {
				id_commande: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("commandes")
										.filter({ id: ctx.params.id_commande})
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},
		//	call "commandes.verify" --id_commande
		verify: {
			params: {
				id_commande: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("commandes")
										.filter({ id: ctx.params.id_commande})
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},
				//	call "produit.get" --id_commande
		get: {
			params: {
				id_commande: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verify", { id_commande: ctx.params.id_commande})
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var comm = db.get("commandes").find({ id: ctx.params.id_commande }).value();;
								return comm;
							})
							.catch(() => {
								return new MoleculerError("commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("commandes", 404, "ERR_CRITIAL", { code: 404, message: "commande doesn't exists" } )
					}
				})
			}
		},

		//	call "commandes.editIncrement" --id_commande 
		editIncrement: {
			params: {
				id_commande: "string",			
			},
			handler(ctx) {
				return ctx.call("commandes.verify", { id_commande: ctx.params.id_commande})
				.then((exists) => {
					if (exists) {
						return ctx.call("commandes.get", { id_commande: ctx.params.id_commande })
								.then((db_commande) => {
									//
									var commande = new Models.Commande(db_commande).create();
									commande.quantity = db_commande.quantity +1;						
									return Database()
										.then((db) => {
											return db.get("commandes")
												.find({ id: ctx.params.id_commande })
												.assign(commande)
												.write()
												.then(() => {
													return commande.quantity;
												})
												.catch(() => {
													return new MoleculerError("commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
												});
										})
								})
					}
					else{
						return new MoleculerError("commandes", 404, "ERR_CRITIAL", { code: 404, message: "commande doesn't exists" } )
					}
				});
			}
		},
		//	call "commandes.editDecrement" --id_commande 
		editDecrement: {
			params: {
				id_commande: "string",			
			},
			handler(ctx) {
				return ctx.call("commandes.verify", { id_commande: ctx.params.id_commande})
				.then((exists) => {
					if (exists) {
						return ctx.call("commandes.get", { id_commande: ctx.params.id_commande })
								.then((db_commande) => {
									//
									var commande = new Models.Commande(db_commande).create();
									commande.quantity = db_commande.quantity -1;						
									return Database()
										.then((db) => {
											return db.get("commandes")
												.find({ id: ctx.params.id_commande })
												.assign(commande)
												.write()
												.then(() => {
													return commande.quantity;
												})
												.catch(() => {
													return new MoleculerError("commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
												});
										})
								})
					}
					else{
						return new MoleculerError("commandes", 404, "ERR_CRITIAL", { code: 404, message: "commande doesn't exists" } )
					}
				});
			}
		},
		//commandes.validation --id_commande
		validation: {
			params: {
				id_commande: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verify", { id_commande: ctx.params.id_commande})
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var comm = db.get("commandes").find({ id: ctx.params.id_commande }).value();;
								return comm;
							})
							.catch(() => {
								return new MoleculerError("commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("commandes", 404, "ERR_CRITIAL", { code: 404, message: "commande doesn't exists" } )
					}
				})
			}
		},
		//	call "commandes.quantityIncrement" --id_commande
		quantityIncrement: {
			params: {
				id_commande: "string"		
			},
			handler(ctx) {
				return ctx.call("commandes.verify", { id_commande: ctx.params.id_commande})
				.then((exists) => {
					if (exists) {
						return ctx.call("commandes.get", { id_commande: ctx.params.id_commande })
								.then((db_commande) => {
									//
									var commande = new Models.commande(db_commande).create();
									commande.quantity = db_commande.quantity+1;
									
									return Database()
										.then((db) => {
											return db.get("commandes")
												.find({ id: ctx.params.id_commande })
												.assign(commande)
												.write()
												.then(() => {
													return commande;
												})
												.catch(() => {
													return new MoleculerError("commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
												});
										})
								})
					}
					else{
						return new MoleculerError("commandes", 404, "ERR_CRITIAL", { code: 404, message: "commande doesn't exists" } )
					}
				});
			}
		},
		//	call "commandes.quantityDecrement" --id_commande
		quantityDecrement: {
			params: {
				id_commande: "string"		
			},
			handler(ctx) {
				return ctx.call("commandes.verify", { id_commande: ctx.params.id_commande})
				.then((exists) => {
					if (exists) {
						return ctx.call("commandes.get", { id_commande: ctx.params.id_commande })
								.then((db_commande) => {
									//
									var commande = new Models.commande(db_commande).create();
									commande.quantity = db_commande.quantity-1;
									
									return Database()
										.then((db) => {
											return db.get("commandes")
												.find({ id: ctx.params.id_commande })
												.assign(commande)
												.write()
												.then(() => {
													return commande;
												})
												.catch(() => {
													return new MoleculerError("commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
												});
										})
								})
					}
					else{
						return new MoleculerError("commandes", 404, "ERR_CRITIAL", { code: 404, message: "commande doesn't exists" } )
					}
				});
			}
		}
	}
};

	

