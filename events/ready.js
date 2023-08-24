const { Events, ActivityType } = require("discord.js");
const { updateStats } = require("../functions/stats.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		//Message de connexion du bot
		console.log(`Prêt ! Connecté en tant que ${client.user.tag}`);

		//Setup des infos affichées du bot
		client.user.setPresence({ 
			activities: [{ 
				name: '/wiki',
				type: ActivityType.Custom,
			}], 
			status: 'online'
		});

		//Parcours de chaque serveur dans lequel le bot est
		const Guilds = client.guilds.cache.map(guild => {
			//Vérification de l'existence du channel des statistiques
			const channel = guild.channels.cache.find(channel => channel.name === "statistiques");

			//Mise à jour des stats
			updateStats(guild, channel);
		});
	},
};