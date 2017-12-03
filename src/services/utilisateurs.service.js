"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "utilisateurs",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "utilisateurs.create" --lastName "lastName1" --firstName "firstName1" --email "email1"
		create: {
			params: {
				lastName: "string",
				firstName: "string",
				email: "string"
			},
			handler(ctx) {
				return ctx.call("utilisateurs.verify", { email: ctx.params.email })
				.then((exists) => {
					if (exists === false) {
						var utilisateur = new Models.Utilisateur(ctx.params).create();
						console.log("Utilisateurs - create - ", utilisateur);
						if (utilisateur) {
							return Database()
								.then((db) => {
									return db.get("utilisateurs")
										.push(utilisateur)
										.write()
										.then(() => {
											return utilisateur;
										})
										.catch(() => {
											return new MoleculerError("utilisateurs", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
										});
								});
						} else {
							return new MoleculerError("utilisateurs", 417, "ERR_CRITIAL", { code: 417, message: "utilisateur is not valid" } )
							}
					}
					else {
						return new MoleculerError("utilisateurs", 409, "ERR_CRITIAL", { code: 409, message: "utilisateur already exists" } )
					}
				});
			}	
		},
	

		//	call "utilisateurs.getAll"
		getAll: {
			params: {

			},
			handler(ctx) {
				return Database()
					.then((db) => {
						return db.get("utilisateurs").value();
					});
			}
		},


		//	call "utilisateur.get" --email
		get: {
			params: {
				email: "string"
			},
			handler(ctx) {
				return ctx.call("utilisateurs.verify", { email: ctx.params.email})
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var user = db.get("utilisateurs").find({ email: ctx.params.email }).value();;
								return user;
							})
							.catch(() => {
								return new MoleculerError("Utilisateurs", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Utilisateurs", 404, "ERR_CRITIAL", { code: 404, message: "utilisateur doesn't exists" } )
					}
				})
			}
		},

		//	call "utilisateurs.verify" --id_utilisateur
		verify: {
			params: {
				email: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("utilisateurs")
										.filter({ email: ctx.params.email})
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "utilisateurs.edit" --email  --lastName --firtsName 
		edit: {
			params: {
				email: "string",
				lastName: "string",
				firstName: "string"				
			},
			handler(ctx) {
				return ctx.call("utilisateurs.verify", { email: ctx.params.email})
				.then((exists) => {
					if (exists) {
						return ctx.call("utilisateurs.get", { email: ctx.params.email })
								.then((db_utilisateur) => {
									//
									var utilisateur = new Models.Utilisateur(db_utilisateur).create();
									utilisateur.lastName = ctx.params.lastName || db_utilisateur.lastName;
									utilisateur.firstName = ctx.params.firstName || db_utilisateur.firstName;
									
									return Database()
										.then((db) => {
											return db.get("utilisateurs")
												.find({ email: ctx.params.email })
												.assign(utilisateur)
												.write()
												.then(() => {
													return utilisateur;
												})
												.catch(() => {
													return new MoleculerError("Utilisateurs", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
												});
										})
								})
					}
					else{
						return new MoleculerError("Utilisateurs", 404, "ERR_CRITIAL", { code: 404, message: "utilisateur doesn't exists" } )
					}
				});
			}
		}




	}
};
