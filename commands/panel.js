const { SlashCommandBuilder,  PermissionsBitField, EmbedBuilder, ChannelType, Embed } = require("discord.js");
const constants = require("../constants");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("panel")
		.setDescription("Permet d'afficher un panel d'aide")
        .addStringOption( (option) =>
            option
            .setName("commande")
            .setDescription("Commande dont on souhaite avoir le panel")
            .setRequired(true)
            .addChoices(
                { name: "statistiques du serveur", value: "stats" },
            )
        ),
	async execute(interaction) {

        //récupération du contenu de la commande
        const panel = interaction.options.getString("commande");
        
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

        
        switch(panel){
            case "stats":
                //Vérification des permissions de l'utilisateur et du bot
                missingPermissions(PermissionsBitField.Flags.Administrator);

                //Edition du message de réponse
                const replyEmbed = new EmbedBuilder()
                .setTitle("Panel Statistiques")
                .setDescription("Liste des commandes liées aux statistiques du serveur")
                .setColor(constants.MAINCOLOR)
                .addFields(
                    { name: `Ajout d'une statistique`, value: `\`/stats ajouter @role\``},
                    { name: `Suppression d'une statistique`, value: `\`/stats supprimer @role\``}
                )
                .setFooter({ text: constants.DEVCREDIT });

                //Envoi du message
                return interaction.reply({
                    embeds: [replyEmbed],
                    ephemeral: true
                });
            break;
            default:
                //Afficher un message lorsque la commande demandée n'est pas reconnue
                return interaction.reply({
                    content : "Une erreur est survenue, veuillez faire un rapport\nRaison : erreur switch pour les droits **panel**",
                    ephemeral: true
                });
        }
        //vérification des droits de l'utilisateur et du bot
        function missingPermissions(permissionLevel){
            if(!interaction.guild.members.me.permissions.has(permissionLevel) && !interaction.memberPermissions.has(permissionLevel)){
                //Si les conditions ne sont pas remplies, la commande est annulée
                return interaction.reply({
                    embeds: [{
                        title: `Commande refusée`,
                        description: `Vous n'avez pas les droits d'utiliser ce panel`,
                        color: constants.MAINCOLOR
                    }],
                    ephemeral: true
                });
            }
        }
	},
};