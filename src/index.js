const { Client, GatewayIntentBits,  EmbedBuilder} = require('discord.js');
require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const jsoncommands = require('./commands/data/commands.json');
const {join, ticketclick, ModalSubmit} = require('./functions/join');
const {projects} = require('./functions/projects')
const {reportproblem, reportproblemsubmitted} = require('./functions/reportproblem')
const { nudge, close} = require('./functions/globalFunctions')
const { reportdiscord, submitreport} = require('./functions/reportDiscordUser')
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const { reportxprofile, submitxprofilereport} = require('./functions/reportxprofileuser')
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
    if(commandName =="projects"){
      await projects(interaction)
    }
    if(commandName =="reportproblem"){
      await reportproblem(interaction)
    }
    if(commandName =="reportuser"){
      await reportdiscord(interaction)
    }
    if(commandName =="reportprofile"){
      await reportxprofile(interaction)
    }
  }else if(interaction.isButton()){
    if(interaction.customId == "open_ticket_org"){
      await ticketclick(interaction)
    }else if(interaction.customId == "nudgeReportProblem"){
      await nudge(interaction)
    }else if(interaction.customId =="closeReportProblem"){
      await close(interaction, client)
    }
    
  }else if(interaction.isModalSubmit()){
    if(interaction.customId ==="modalTicketJoin"){
      await ModalSubmit(interaction, client)
    }else if(interaction.customId ==="reportproblemForm"){
      await reportproblemsubmitted(interaction, client)
    }else if(interaction.customId == "reportdiscorduser"){
      await submitreport(interaction, client)
    }else if(interaction.customId =="reportxprofileuser"){
      await submitxprofilereport(interaction, client)
    }
    
  }
});

client.login(token);
