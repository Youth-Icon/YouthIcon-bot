const { TextInputBuilder, TextInputStyle, ModalBuilder, ActionRowBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const data = require('./globalvars.json')
module.exports = {
    reportxprofile: async function report(interaction){
        const modal = new ModalBuilder()
            .setCustomId('reportxprofileuser')
            .setTitle("Report Xprofile User");

        const name = new TextInputBuilder()
            .setCustomId('nameInput')
            .setRequired(true)
            .setMinLength(5)
            .setStyle(TextInputStyle.Short)
            .setLabel('Please enter your full name')
        const username = new TextInputBuilder()
        .setCustomId('xprofileuserid')
        .setLabel('Please enter the Xprofile url for the user')
        .setRequired(true)
        .setPlaceholder('https://xprofile.us/...')
        .setStyle(TextInputStyle.Short)
        const message = new TextInputBuilder()
            .setCustomId('messageReason')
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(20)
            .setMaxLength(150)
            .setLabel('Why do you want to report this user')
        modal.addComponents(new ActionRowBuilder().addComponents(name), new ActionRowBuilder().addComponents(message), new ActionRowBuilder().addComponents(username));
        await interaction.showModal(modal);
    },
    submitxprofilereport: async function submit(interaction, client){
        // Ensure the guild is accessible through the client
        const guild = client.guilds.cache.get(interaction.guildId);
        const id = data.team_role
        // Create the channel
        const channel = await guild.channels.create({
        name: 'Report Xprofile User',
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
            allow: [PermissionsBitField.Flags.SendMessages],
            },
        ],
        });
        const fullName = interaction.fields.getTextInputValue('nameInput');
        const report = interaction.fields.getTextInputValue('messageReason');
        const userid = interaction.fields.getTextInputValue('xprofileuserid')
        const embed = new EmbedBuilder()
        .setTitle('X profile Report')
        .setDescription('We will try to take this as serious as we can. Our users privacy is our top priority')
        .setColor('Fuchsia')
        .addFields({
            name: 'Name: ',
            value: fullName
        })
        .addFields({
            name: 'Xprofile username',
            value: userid
        })
        .addFields({
           name: 'Report: ',
           value: report 
        })
        
        const close = new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setCustomId('closeReportProblem')
        .setLabel('Close')
       
        const row = new ActionRowBuilder()
        .addComponents(close)
        channel.send({ embeds: [embed], components: [row]});
        
        await interaction.reply({content: "A ticket has been Opened", ephemeral: true})
    }
}