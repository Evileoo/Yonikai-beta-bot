const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("wiki")
		.setDescription("Envoie le lien de la documentation du bot"),
	async execute(interaction) {

        return interaction.reply({
            content : "https://github.com/Evileoo/Yonikai-Bot/wiki",
            ephemeral: true
        });
	},
};