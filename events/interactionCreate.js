const { Events } = require("discord.js");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()){
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`Aucune commande nommée ${interaction.commandName} a été trouvée.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Une erreur est survenue en exécutant la commande ${interaction.commandName}`);
				console.error(error);
			}
		} else if (interaction.isButton()) {
			// respond to the button
		} else if (interaction.isStringSelectMenu()) {
			// respond to the select menu
		}
	},
};