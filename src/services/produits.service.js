"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "produits",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "produits.create" --title "title1" --description "description1" --price "price1"
		create: {
			params: {
				title: "string",
				description: "string",
				price: "number",
				quantity: "number"
			},
			handler(ctx) {
				var produit = new Models.Produit(ctx.params).create();
				console.log("Produits - create - ", produit);
				if (produit) {
					return Database()
						.then((db) => {
							return db.get("produits")
								.push(produit)
								.write()
								.then(() => {
									return produit;
								})
								.catch(() => {
									return new MoleculerError("Produits", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
								});
					});
				} else {
					return new MoleculerError("Produits", 417, "ERR_CRITIAL", { code: 417, message: "Todo is not valid" } )
				}
			}
		},	

		//	call "produits.getAll"
		
		getAll: {
			params: {

			},
			handler(ctx) {
				return Database()
					.then((db) => {
						return db.get("produits").value();
					});
			}
		},


		//	call "produit.get" --id_product
		get: {
			params: {
				id_product: "string"
			},
			handler(ctx) {
				return ctx.call("produits.verify", { id_product: ctx.params.id_product})
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var product = db.get("produits").find({ id: ctx.params.id_product }).value();;
								return product;
							})
							.catch(() => {
								return new MoleculerError("produits", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("produits", 404, "ERR_CRITIAL", { code: 404, message: "produit doesn't exists" } )
					}
				})
			}
		},

		//	call "produits.verify" --id_product
		verify: {
			params: {
				id_product: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("produits")
										.filter({ id: ctx.params.id_product})
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "produits.edit" --id_product  --title --description --price 
		edit: {
			params: {
				id_product: "string",
				title: "string",
				description: "string",
				price: "number"				
			},
			handler(ctx) {
				return ctx.call("produits.verify", { id_product: ctx.params.id_product})
				.then((exists) => {
					if (exists) {
						return ctx.call("produits.get", { id_product: ctx.params.id_product })
								.then((db_produit) => {
									//
									var produit = new Models.Produit(db_produit).create();
									produit.title = ctx.params.title || db_produit.title;
									produit.description = ctx.params.description || db_produit.description;
									produit.price = ctx.params.price || db_produit.price;
									
									return Database()
										.then((db) => {
											return db.get("produits")
												.find({ id: ctx.params.id_product })
												.assign(produit)
												.write()
												.then(() => {
													return produit;
												})
												.catch(() => {
													return new MoleculerError("produits", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
												});
										})
								})
					}
					else{
						return new MoleculerError("produits", 404, "ERR_CRITIAL", { code: 404, message: "produit doesn't exists" } )
					}
				});
			}
		},
		//	call "produits.quantityIncrement" --id_product
		quantityIncrement: {
			params: {
				id_product: "string"		
			},
			handler(ctx) {
				return ctx.call("produits.verify", { id_product: ctx.params.id_product})
				.then((exists) => {
					if (exists) {
						return ctx.call("produits.get", { id_product: ctx.params.id_product })
								.then((db_produit) => {
									//
									var produit = new Models.Produit(db_produit).create();
									produit.quantity = db_produit.quantity+1;
									
									return Database()
										.then((db) => {
											return db.get("produits")
												.find({ id: ctx.params.id_product })
												.assign(produit)
												.write()
												.then(() => {
													return produit;
												})
												.catch(() => {
													return new MoleculerError("produits", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
												});
										})
								})
					}
					else{
						return new MoleculerError("produits", 404, "ERR_CRITIAL", { code: 404, message: "produit doesn't exists" } )
					}
				});
			}
		},
		//	call "produits.quantityDecrement" --id_product
		quantityDecrement: {
			params: {
				id_product: "string"		
			},
			handler(ctx) {
				return ctx.call("produits.verify", { id_product: ctx.params.id_product})
				.then((exists) => {
					if (exists) {
						return ctx.call("produits.get", { id_product: ctx.params.id_product })
								.then((db_produit) => {
									//
									var produit = new Models.Produit(db_produit).create();
									produit.quantity = db_produit.quantity-1;
									
									return Database()
										.then((db) => {
											return db.get("produits")
												.find({ id: ctx.params.id_product })
												.assign(produit)
												.write()
												.then(() => {
													return produit;
												})
												.catch(() => {
													return new MoleculerError("produits", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
												});
										})
								})
					}
					else{
						return new MoleculerError("produits", 404, "ERR_CRITIAL", { code: 404, message: "produit doesn't exists" } )
					}
				});
			}
		}
	}
};

	

