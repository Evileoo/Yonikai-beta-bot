const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');

const commands = [];
//Récupération des fichiers de commandes
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//Récupération de la commande pour la mise en déploiement
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

//Construction et préparation du module REST
const rest = new REST({ version: '10' }).setToken(token);

//Déploiement des commandes
(async () => {
	try {
		console.log(`Récupération de ${commands.length} commandes`);

		//Raffraichissement des commandes à chaque redémarrage du bot
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`${data.length} commandes ont été chargées`);
	} catch (error) {
		//Récupération des erreurs
		console.error(error);
	}
})();