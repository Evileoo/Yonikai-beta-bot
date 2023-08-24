const { Events } = require("discord.js");
const { updateStats } = require("../functions/stats");

module.exports = {
	name: Events.GuildMemberUpdate,
	execute(oldMember, newMember) {
		//Récupération des roles du membre
		const oldMemberRoles = oldMember.roles.cache.map(role => role.toString());
        const newMemberRoles = newMember.roles.cache.map(role => role.toString());

        //Vérifiaction du type de modification
        //Cela doit être une modification de roles
        if(oldMemberRoles.length != newMemberRoles.length){
            //Récupération du channel d'affichage des stats
            const channel = oldMember.guild.channels.cache.find(channel => channel.name === "statistiques");

            //Mise à jour des stats
            updateStats(oldMember.guild, channel);
        }
	},
};