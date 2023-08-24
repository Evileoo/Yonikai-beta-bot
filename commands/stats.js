const { SlashCommandBuilder,  PermissionsBitField } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("stats")
		.setDescription("Ajout et Suppression de statistiques serveur")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption( o =>
            o
            .setName("type")
            .setDescription("Ajout ou Suppression")
            .setRequired(true)
            .addChoices(
                { name: "Ajouter une statistique", value: "ajout" },
                { name: "Modifier une statistique", value: "modif" },
                { name: "Supprimer une statistique", value: "suppr" },
            )
        )
        .addRoleOption( r =>
            r
            .setName("role")
            .setDescription("Role ciblé")
            .setRequired(true)
        )
        .addIntegerOption( i =>
            i
            .setName("emplacement")
            .setDescription("Place à laquelle le role doit être affichée")
        ),
	async execute(interaction) {

        //récupération du contenu de la commande
        const type = interaction.options.getString("type");
        const role = interaction.options.getRole("role");
        const place = interaction.options.getInteger("emplacement");

        //Vérification de l'existence du channel
        const channel = interaction.guild.channels.cache.find(channel => channel.name === "statistiques");
        if(!channel){
            return interaction.reply({
                content : "Salon des statistiques introuvable.\nSi vous avez déjà activé cette fonctionnalité, vérifiez que le nom du salon est bien **statistiques**\nSi vous ne l'avez pas activé, veuillez exécuter la commande `activer` et sélectionnez `statistiques du serveur`",
                ephemeral: true
            });
        }

        //Vérification de l'existence du message
        await channel.messages.fetch();
        if(channel.messages.cache.map(x => x).length == 0){
            channel.delete()
            .catch(console.error);
        }

        //Récupération du message des statistiques
        channel.messages.fetch({ limit: 1 }).then( messages =>
            messages.forEach(m => {
                let roleExists = false;
                let isEveryone = false;

                //découpage du message
                const tab = m.content.split("\n\n");
                for(i = 0; i < tab.length; i++){
                    tab[i] = tab[i].split(" : ");

                    //vérification de l'existence du role dans le message
                    if(tab[i][0] == `<@&${role.id}>`) roleExists = true;

                    //Cas du @everyone
                    if(role.name == "@everyone") isEveryone = true;
                    if(tab[i][0] == "@everyone" && role.name == tab[i][0]) roleExists = true;
                }

                let index;

                switch(type){
                    case "ajout":
                        //vérification de l'existence du role
                        if(roleExists){
                            return interaction.reply({
                                content : `Le role que vous souhaitez ajouter existe déjà dans le message`,
                                ephemeral: true
                            });
                        }

                        //mise en place de l'index d'emplacement de l'ajout
                        index = (place != null ? place : tab.length);
                        if(index > tab.length) index = tab.length;

                        //récupération du nombre de membres ayant le role
                        const memberCount = interaction.guild.roles.cache.find(r => r.id == role.id).members.size;

                        //ajout du role à l'emplacement demandé
                        let ajout = [ [`<@&${role.id}>`], [memberCount] ];
                        if(isEveryone) ajout[0][0] = role.name;
                        tab.splice(index, 0, ajout);
                    break;
                    case "modif":
                        //vérification de l'existence du role
                        if(!roleExists){
                            return interaction.reply({
                                content : `Le role que vous souhaitez modifier n'existe pas dans le message`,
                                ephemeral: true
                            });
                        }

                        //mise en place de l'index d'emplacement de déplacement
                        index = (place != null ? place - 1 : tab.length);
                        if(index > tab.length) index = tab.length;

                        //modification de l'emplacement du role
                        let roleToMove;
                        for(i = 0; i < tab.length; i++){
                            if((tab[i][0] == `<@&${role.id}>`) || (isEveryone && tab[i][0] == role.name)){
                                roleToMove = tab.splice(i, 1);
                                break;
                            }
                        }
                        tab.splice(index, 0, roleToMove[0]);
                    break;
                    case "suppr":
                        //vérification de l'existence du role
                        if(!roleExists){
                            return interaction.reply({
                                content : `Le role que vous souhaitez supprimer n'existe pas dans le message`,
                                ephemeral: true
                            });
                        }

                        //suppression du role
                        for(i = 0; i < tab.length; i++){
                            if((tab[i][0] == `<@&${role.id}>`) || (isEveryone && tab[i][0] == role.name)){
                                tab.splice(i, 1);
                                break;
                            }
                        }
                    break;
                    default:
                        //Afficher un message lorsque la commande demandée n'est pas reconnue
                        return interaction.reply({
                            content : "Une erreur est survenue, veuillez faire un rapport\nRaison : erreur switch pour la commande **stats**",
                            ephemeral: true
                        });
                }
                //recomposition du message
                let newMessage = "";
                for(i = 0; i < tab.length; i++){
                    newMessage += tab[i][0] + " : " + tab[i][1] + "\n\n";
                }

                if(newMessage == ""){
                    return interaction.reply({
                        content : "Erreur !\nLe message doit contenir au moins une statistique",
                        ephemeral: true
                    });
                }

                //edition du message
                m.edit(newMessage);
                
                //Afficher le message de confirmation de bonne exécution
                return interaction.reply({
                    content : "Commande exécutée !",
                    ephemeral: true
                });
            })
        );
	},
};