const { Events } = require("discord.js");

module.exports = {
	name: Events.GuildRoleDelete,
	execute(role) {
        console.log(role.id);

        //Récupération du channel
        const channel = role.guild.channels.cache.find(channel => channel.name === "statistiques");

        //Vérification de l'existence du message
        if(channel.messages.cache.map(x => x).length == 0){
            channel.delete()
            .catch(console.error);
        } else {
            //Vérification de l'existence du role dans le message
            channel.messages.fetch({ limit: 1 }).then( messages =>
                messages.forEach(m => {
                    let newMessage = "";
                    //Découpage du message
                    const tab = m.content.split("\n\n");
                    for(i = 0; i < tab.length; i++){
                        tab[i] = tab[i].split(" : ");

                        //Extraction de l'identifiant du role
                        let roleId = tab[i][0].substring(3);
						roleId = roleId.slice(0, -1);

                        if(roleId == role.id){
                            tab.splice(i, 1);
                            break;
                        }

                        //Recomposition du message
                        newMessage += tab[i][0] + " : " + tab[i][1] + "\n\n";
                    }

                    //Edition du message
                    m.edit(newMessage);
                })
            );
        }
	},
};