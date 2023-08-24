const { Events } = require("discord.js");
const { updateStats } = require("../functions/stats");

module.exports = {
	name: Events.GuildMemberAdd,
	execute(member) {
		//Récupération du channel des statistiques
        const channel = member.guild.channels.cache.find(channel => channel.name === "statistiques");

		//mise à jour des statistiques
		updateStats(channel.guild, channel);
	},
};