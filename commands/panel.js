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
            )
        ),
	async execute(interaction) {

        //récupération du contenu de la commande
        const panel = interaction.options.getString("commande");

        //Exécution de la commande
        switch(panel){
            case "stats":
                //Vérification des permissions de l'utilisateur et du bot
                //missingPermissions(PermissionsBitField.Flags.Administrator);

                //Edition du message de réponse
                const replyEmbed = new EmbedBuilder()
                .setTitle("Panel Statistiques")
                .setDescription("Liste des commandes liées aux statistiques du serveur")
                .setColor(constants.MAINCOLOR)
                .addFields(
                    { name: `Ajout d'une statistique`, value: `\`/stats ajouter @role [emplacement]\`\nL'\`emplacement\` n'est pas obligatoire, il a pour valeur par défaut la fin du message\nPour utiliser l'\`emplacement\`, il faut mettre la ligne à laquelle vous voulez que le compteur s'affiche`},
                    { name: `Ajout d'une statistique`, value: `\`/stats modifier @role [emplacement]\`\nL'\`emplacement\` n'est pas obligatoire, il a pour valeur par défaut la fin du message\nPour utiliser l'\`emplacement\`, il faut mettre la ligne à laquelle vous voulez que le compteur s'affiche`},
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