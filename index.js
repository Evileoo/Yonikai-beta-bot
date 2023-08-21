// Classes requises pour le bon fonctionnement du bot
const { Client, GatewayIntentBits, Collection, Partials, REST} = require("discord.js");
const { token, clientId, guildId } = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");
//require("./database/db.connection");

//Créer l'instance du bot
const client = new Client({
  intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildVoiceStates
	],
  partials: [
    Partials.Channel
  ],
});

//Créer la collection des commandes
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

//Construction et préparation de l'instance REST
const rest = new REST({ version: '10' }).setToken(token);

//Préparation des évènements gérés
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//Déploiement des commandes du bot
require("./deploy-commands");

//Connexion au bot
client.login(token);