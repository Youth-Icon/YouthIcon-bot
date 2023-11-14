const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ChannelType, PermissionsBitField, ButtonBuilder, ButtonStyle} = require('discord.js');
const data = require('./globalvars.json')
module.exports = {
    reportproblem: async function report(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('reportproblemForm')
            .setTitle("Report a problem");

        const name = new TextInputBuilder()
            .setCustomId('nameInput')
            .setRequired(true)
            .setMinLength(5)
            .setStyle(TextInputStyle.Short)
            .setLabel('Please enter your full name')
        const problem = new TextInputBuilder()
            .setCustomId('problem')
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(20)
            .setMaxLength(150)
            .setLabel('Please enter your problem')
        modal.addComponents(new ActionRowBuilder().addComponents(name), new ActionRowBuilder().addComponents(problem));
        await interaction.showModal(modal);
    },
    reportproblemsubmitted: async function submit(interaction, client){
        // Ensure the guild is accessible through the client
        const guild = client.guilds.cache.get(interaction.guildId);
        const id = data.team_role
        // Create the channel
        const channel = await guild.channels.create({
        name: 'Report problem',
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
            id: guild.roles.everyone,
            deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
            id: id,
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
            },
            {
            id: client.user.id,
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: interaction.user.id,
                allow: [
                    PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel
                ]
            }
        ],
        });
        const fullName = interaction.fields.getTextInputValue('nameInput');
        const problem = interaction.fields.getTextInputValue('problem');
        const embed = new EmbedBuilder()
        .setTitle('Problem Report')
        .setDescription('Problem Details')
        .setColor('Fuchsia')
        .addFields({
            name: 'Name: ',
            value: fullName
        })
        .addFields({
           name: 'Problem: ',
           value: problem 
        })
        const close = new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setCustomId('closeReportProblem')
        .setLabel('Close')
        const nudge = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('nudgeReportProblem')
        .setLabel('Ping Staff')
        const row = new ActionRowBuilder()
        .addComponents(close, nudge)
        channel.send({ embeds: [embed], components: [row]});
        
        await interaction.reply({content: "A ticket has been Opened", ephemeral: true})
    }

};
