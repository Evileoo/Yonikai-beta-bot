const { Events } = require("discord.js");

module.exports = {
	name: Events.GuildMemberUpdate,
	execute(oldMember, newMember) {
		//Récupération des roles du membre
		const oldMemberRoles = oldMember.roles.cache.map(role => role.toString());
        const newMemberRoles = newMember.roles.cache.map(role => role.toString());

        if(oldMemberRoles.length != newMemberRoles.length){
            const channel = oldMember.guild.channels.cache.find(channel => channel.name === "statistiques");
            if(channel){
				//Vérification de l'existence du message
				channel.messages.fetch().then(count =>{
					if(channel.messages.cache.map(x => x).length == 0){
						channel.delete()
						.catch(console.error);
					} else {
						channel.messages.fetch({ limit: 1 }).then( messages =>
							messages.forEach(m => {
								let newMessage = "";
								//Découpage du message
								const tab = m.content.split("\n\n");
								for(i = 0; i < tab.length; i++){
									tab[i] = tab[i].split(" : ");

									//Cas du @everyone
									let isEveryone = false;
									if(tab[i][0] == "@everyone") isEveryone = true;

									//récupération du nombre de membres ayant le role
									let memberCount;
									if(isEveryone) memberCount = oldMember.guild.roles.cache.find(r => r.name == tab[i][0]).members.size;
									else{
										let roleId = tab[i][0].substring(3);
										roleId = roleId.slice(0, -1);
										memberCount = oldMember.guild.roles.cache.find(r => r.id == roleId).members.size;
									}

									//mise à jour du nombre
									tab[i][1] = memberCount;

									//Recomposition du message
									newMessage += tab[i][0] + " : " + tab[i][1] + "\n\n";
								}

								//Edition du message
								m.edit(newMessage);
							})
						);
					}
				});
			}
        }
        
/*
		//Parcours de chaque serveur dans lequel le bot est
		const Guilds = client.guilds.cache.map(guild => {
			//Vérification de l'existence du channel des statistiques
			const channel = guild.channels.cache.find(channel => channel.name === "statistiques");
			if(channel){
				//Vérification de l'existence du message
				channel.messages.fetch().then(count =>{
					if(channel.messages.cache.map(x => x).length == 0){
						channel.delete()
						.catch(console.error);
					} else {
						channel.messages.fetch({ limit: 1 }).then( messages =>
							messages.forEach(m => {
								let newMessage = "";
								//Découpage du message
								const tab = m.content.split("\n\n");
								for(i = 0; i < tab.length; i++){
									tab[i] = tab[i].split(" : ");

									//Cas du @everyone
									let isEveryone = false;
									if(tab[i][0] == "@everyone") isEveryone = true;

									//récupération du nombre de membres ayant le role
									let memberCount;
									if(isEveryone) memberCount = guild.roles.cache.find(r => r.name == tab[i][0]).members.size;
									else{
										let roleId = tab[i][0].substring(3);
										roleId = roleId.slice(0, -1);
										memberCount = guild.roles.cache.find(r => r.id == roleId).members.size;
									}

									//mise à jour du nombre
									tab[i][1] = memberCount;

									//Recomposition du message
									newMessage += tab[i][0] + " : " + tab[i][1] + "\n\n";
								}

								//Edition du message
								m.edit(newMessage);
							})
						);
					}
				});
			}
		});
*/
	},
};