const { SlashCommandBuilder,  PermissionsBitField, EmbedBuilder } = require("discord.js");
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
                { name: "activation de fonctionnalité", value: "activer" },
            )
        ),
	async execute(interaction) {

        //récupération du contenu de la commande
        const panel = interaction.options.getString("commande");

        //Exécution de la commande
        switch(panel){
            case "stats":
                //Vérification des permissions de l'utilisateur et du bot
                missingPermissions(PermissionsBitField.Flags.Administrator);

                //Edition du message de réponse
                const replyPanel = new EmbedBuilder()
                .setTitle("Panel Statistiques")
                .setDescription("Liste des commandes liées aux statistiques du serveur\n* : paramètre optionnel")
                .setColor(constants.MAINCOLOR)
                .addFields(
                    { name: `Ajout d'une statistique`, value: `\`/stats [ajouter] [@role] [emplacement*]\``},
                    { name: `Modification d'une statistique`, value: `\`/stats modifier @role [emplacement*]\``},
                    { name: `Suppression d'une statistique`, value: `\`/stats [supprimer] [@role]\``},
                    { name: `Besoin de détails ?`, value: `[Cliquer ici](https://github.com/Evileoo/Yonikai-Bot/wiki#stats-type-role-emplacement)`},
                )
                .setFooter({ text: constants.DEVCREDIT });

                //Envoi du message
                return interaction.reply({
                    embeds: [replyPanel],
                    ephemeral: true
                });
            break;
            case "activer":
                //Vérification des permissions de l'utilisateur et du bot
                missingPermissions(PermissionsBitField.Flags.Administrator);

                //Edition du message de réponse
                const replyActiver = new EmbedBuilder()
                .setTitle("Panel Statistiques")
                .setDescription("Liste des commandes liées à l'activation d'une fonctionnalité")
                .setColor(constants.MAINCOLOR)
                .addFields(
                    { name: `Activer une fonctionnalité`, value: `\`/activer [fonctionnalité]\``},
                    { name: `Besoin de détails ?`, value: `[Cliquer ici](https://github.com/Evileoo/Yonikai-Bot/wiki#activer-fonctionnalit%C3%A9)`},
                )
                .setFooter({ text: constants.DEVCREDIT });

                //Envoi du message
                return interaction.reply({
                    embeds: [replyActiver],
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