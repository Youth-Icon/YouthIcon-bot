const { Client, GatewayIntentBits,  EmbedBuilder} = require('discord.js');
require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const jsoncommands = require('./commands/data/commands.json');
const {join, ticketclick, ModalSubmit} = require('./functions/join')
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

const commands = [].map(command => command.toJSON());
jsoncommands.map(commandData =>{
  commands.push(
    new SlashCommandBuilder()
      .setName(commandData.name)
      .setDescription(commandData.description)
  )
})

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (interaction.isCommand()) {
    const { commandName } = interaction;

    if (commandName === 'invite') {
      const embed = new EmbedBuilder()
        .setColor('#E85D04')
        .setTitle('Invite Link')
        .setDescription('This is the invitation link https://discord.gg/dGWGvhJDDh');
        
      await interaction.reply({ embeds: [embed] });
    }
    if (commandName === 'join') {
      await join(interaction);
    }
  }else if(interaction.isButton()){
    await ticketclick(interaction)
  }else if(interaction.isModalSubmit()){
  
    await ModalSubmit(interaction, client)
  }
});

client.login(token);
