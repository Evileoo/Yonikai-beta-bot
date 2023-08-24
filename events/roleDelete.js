const { Events } = require("discord.js");
const { deleteStat } = require("../functions/stats.js");

module.exports = {
	name: Events.GuildRoleDelete,
	execute(role) {
        //Récupération du channel
        const channel = role.guild.channels.cache.find(channel => channel.name === "statistiques");

        //Suppression de la statistique associée au role supprimé si elle existe
        deleteStat(channel, role);
	},
};