const { SlashCommandBuilder,  PermissionsBitField, ChannelType } = require("discord.js");
const constants = require("../constants");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("activer")
		.setDescription("Permet d'activer des fonctionnalités du bot")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption( (option) =>
            option
            .setName("nom")
            .setDescription("Nom de la fonctionnalité")
            .setRequired(true)
            .addChoices(
                { name: "statistiques du serveur", value: "stats" },
            )
        ),
	async execute(interaction) {

        //récupération du contenu de la commande
        const activate = interaction.options.getString("nom");
        
        //Vérification des droits du bot
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)){
            return interaction.reply({
                embeds: [{
                    title: `Erreur !`,
                    description: `Droits d'administrateur requis pour l'exécution de la commande **activate**`,
                    color: constants.MAINCOLOR
                }],
                ephemeral: true
            });
        }

        //Activation des fonctionnalités
        switch(activate){
            case "stats":
                //Vérification de l'existence du salon avant la création de celui-ci
                let channel = interaction.guild.channels.cache.find(channel => channel.name === "statistiques");
                if(channel){
                    alreadyActivated("Le salon");
                } else {
                    //Création du salon
                    const channelParent = interaction.channel.parent.id;
                    let everyoneRole = interaction.guild.roles.cache.find(r => r.name === '@everyone');
                    await interaction.guild.channels.create({
                        name: `statistiques`,
                        parent: `${channelParent}`,
                        type: ChannelType.GuildText,
                        permissionOverwrites : [{
                            id: everyoneRole.id,
                            deny: PermissionsBitField.Flags.SendMessages
                        }]
                    });

                    //Vérification de la bonne exécution de la commande
                    channel = interaction.guild.channels.cache.find(channel => channel.name === "statistiques");
                    if(channel){
                        //confirmer la création du salon
                        interaction.reply({
                            content : "Salon créé, le salon est identifié par son nom, veuillez ne pas y toucher",
                            ephemeral: true
                        });

                        //Comptage et affichage du nombre de membres présents sur le serveur
                        const memberCount = interaction.guild.members.cache;

                        //Création d'un premier message inutile afin d'éviter le ping
                        await interaction.guild.channels.cache.get(channel.id).send({
                            content: `Chargement...`
                        });

                        //Affichage du compteur de membres
                        channel.messages.fetch({ limit: 1 }).then( messages =>
                            messages.forEach(m => {
                                m.edit(`@everyone : ${memberCount.size}`);
                            })
                        );
                    } else {
                        return interaction.reply({
                            content : "Une erreur est survenue, veuillez faire un rapport",
                            ephemeral: true
                        });
                    }


                }
            break;

            default:
                //Afficher un message lorsque la commande demandée n'est pas reconnue
                return interaction.reply({
                    content : "Une erreur est survenue, veuillez faire un rapport\nRaison : erreur switch pour la commande **activate**",
                    ephemeral: true
                });
        }
        //Centralisation de tous les messages d'autorisations déjà accordées
        function alreadyActivated(parameter){
            return interaction.reply({
                embeds: [{
                    title: `Cette autorisation a déjà été accordée`,
                    description: `${parameter} a été trouvé sur le serveur`,
                    color: constants.MAINCOLOR
                }],
                ephemeral: true
            });
        }
	},
};