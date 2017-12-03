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

		//	call "commandes.create" --id_user "dsdfedv1" 
		create: {
			params: {
				id_user: "string"
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
									return [commande.id_order,commande.id_user]
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


		//	call "commandes.getUtilisateur" --id_user
		getUtilisateur: {
			params: {
				id_user: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verifyUtilisateur", { id_user: ctx.params.id_user})
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var comm = db.get("commandes").filter({ id_user: ctx.params.id_user }).map('id_order').value();;
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
		//	call "commandes.getCommande" --id_order
		getCommande: {
			params: {
				id_order: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verifyCommande", { id_order: ctx.params.id_order})
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var comm = db.get("commandes").filter({ id_order: ctx.params.id_order }).value();;
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
		//	call "commandes.verifyUtilisateur" --id_user
		verifyUtilisateur: {
			params: {
				id_user: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("commandes")
										.filter({ id_user: ctx.params.id_user})
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},
		//	call "commandes.verifyCommande" --id_order
		verifyCommande: {
			params: {
				id_order: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("commandes")
										.filter({ id_order: ctx.params.id_order})
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},
		//	call "commandes.verify" --id_order
		verify: {
			params: {
				id_order: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("commandes")
										.filter({ id_order: ctx.params.id_order})
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},
				//	call "produit.get" --id_order
		get: {
			params: {
				id_order: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verify", { id_order: ctx.params.id_order})
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var comm = db.get("commandes").find({ id_order: ctx.params.id_order }).value();;
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

		//	call "commandes.editIncrement" --id_order 
		editIncrement: {
			params: {
				id_order: "string",			
			},
			handler(ctx) {
				return ctx.call("commandes.verify", { id_order: ctx.params.id_order})
				.then((exists) => {
					if (exists) {
						return ctx.call("commandes.get", { id_order: ctx.params.id_order })
								.then((db_commande) => {
									//
									var commande = new Models.Commande(db_commande).create();
									commande.quantity = db_commande.quantity +1;						
									return Database()
										.then((db) => {
											return db.get("commandes")
												.find({ id: ctx.params.id_order })
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
		//	call "commandes.editDecrement" --id_order 
		editDecrement: {
			params: {
				id_order: "string",			
			},
			handler(ctx) {
				return ctx.call("commandes.verify", { id_order: ctx.params.id_order})
				.then((exists) => {
					if (exists) {
						return ctx.call("commandes.get", { id_order: ctx.params.id_order })
								.then((db_commande) => {
									//
									var commande = new Models.Commande(db_commande).create();
									if (db_commande != 0){
									commande.quantity = db_commande.quantity -1;	
									}					
									return Database()
										.then((db) => {
											return db.get("commandes")
												.find({ id: ctx.params.id_order })
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
		//commandes.validation --id_order
		validation: {
			params: {
				id_order: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verify", { id_order: ctx.params.id_order})
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var comm = db.get("commandes").find({ id: ctx.params.id_order }).value();;
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
		//	call "commandes.quantityIncrement" --id_order
		quantityIncrement: {
			params: {
				id_order: "string"		
			},
			handler(ctx) {
				return ctx.call("commandes.verify", { id_order: ctx.params.id_order})
				.then((exists) => {
					if (exists) {
						return ctx.call("commandes.get", { id_order: ctx.params.id_order })
								.then((db_commande) => {
									//
									var commande = new Models.commande(db_commande).create();
									commande.quantity = db_commande.quantity+1;
									
									return Database()
										.then((db) => {
											return db.get("commandes")
												.find({ id: ctx.params.id_order })
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
		//	call "commandes.quantityDecrement" --id_order
		quantityDecrement: {
			params: {
				id_order: "string"		
			},
			handler(ctx) {
				return ctx.call("commandes.verify", { id_order: ctx.params.id_order})
				.then((exists) => {
					if (exists) {
						return ctx.call("commandes.get", { id_order: ctx.params.id_order })
								.then((db_commande) => {
									//
									var commande = new Models.commande(db_commande).create();
									commande.quantity = db_commande.quantity-1;
									
									return Database()
										.then((db) => {
											return db.get("commandes")
												.find({ id: ctx.params.id_order })
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

	

