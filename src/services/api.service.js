"use strict";

const ApiGateway = require("moleculer-web");


module.exports = {
	name: "api",
	mixins: [ ApiGateway],

	settings: {
		port: process.env.PORT || 9000,

        cors: {
            // Configures the Access-Control-Allow-Origin CORS header.
            origin: "*",
            // Configures the Access-Control-Allow-Methods CORS header.
            methods: ["GET", "PATCH", "OPTIONS", "POST", "PUT", "DELETE"],
            // Configures the Access-Control-Allow-Headers CORS header.
            allowedHeaders: ["Content-Type"],
            // Configures the Access-Control-Expose-Headers CORS header.
            exposedHeaders: [],
            // Configures the Access-Control-Allow-Credentials CORS header.
            credentials: false,
            // Configures the Access-Control-Max-Age CORS header.
            maxAge: 3600
        },

		routes: [

			{
				path: "/status/",
				whitelist: [
					// Access to any actions in all services
					"*"
				],
				aliases: {
					// The `name` comes from named param.
					// You can access it with `ctx.params.name` in action
					// "GET hi/:name": "greeter.welcome",
					// "POST user/:auth0_id": "user.create",
					"GET server": "application.configuration",
					"GET health": "application.health",
					"GET database": "application.database",
					"GET reset": "application.reset"
				}
			},
						{
				path: "/api/v1/",
				whitelist: [
					// Access to any actions in all services
					"*"
				],
				aliases: {
					// The `name` comes from named param.
					// You can access it with `ctx.params.name` in action
					// "GET hi/:name": "greeter.welcome",
					// "POST user/:auth0_id": "user.create",
					"POST user": "utilisateurs.create",
					"GET user/:email": "utilisateurs.get",
					"PATCH user/:email": "utilisateurs.edit",
					"POST product": "produits.create",
					"GET produt/:id_product": "produits.get",
					"PATCH produt/:id_product": "produits.edit",
					"PATCH produt/:id_product/increment": "produits.quantityIncrement",
					"PATCH produt/:id_product/decrement": "produits.quantityDecrement",
					"POST order/user/:id_user": "commandes.create",
					"GET order/:id_order": "commandes.getCommande",
					"GET order/user/:id_user": "commandes.getUtilisateur",
					"PATCH order/:id_order/product/:id_product/increment": "commandes.editIncrement",
					"PATCH order/:id_order/product/:id_product/decrement": "commandes.editDecrement",
					"PATCH order/:id_order": "commandes.validation",
				}
			},
			{
				bodyParsers: {
	                json: true,
	            },
				path: "/client/",
				whitelist: [
					// Access to any actions in all services
					"*"
				],
				aliases: {
					//	Example project
				}
			}
		]

	}
};
