const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, PermissionsBitField} = require('discord.js');

module.exports = {
  join: async function join(interaction) {
    const embed = new EmbedBuilder()
      .setColor("#15172a")
      .setTitle('Join Organization')
      .setDescription("To join our GitHub organization, please open a GitHub issue or open a ticket from the buttons below");
    const githubissue = new ButtonBuilder()
      .setLabel("Open issue")
      .setStyle(ButtonStyle.Link)
      .setURL('https://github.com/Youth-Icon/.github/issues/new?assignees=&labels=invite+me+to+the+organisation&template=invitation.yml&title=Please+invite+me+to+the+GitHub+Community+Organization');
    const ticket = new ButtonBuilder()
      .setLabel("Ticket")
      .setStyle(ButtonStyle.Primary)
      .setCustomId('open_ticket_org');
    const row = new ActionRowBuilder()
      .addComponents(githubissue, ticket);

    await interaction.reply({ embeds: [embed], ephemeral: true, components: [row] });
  },
  ticketclick: async function ticket(interaction) {
    const modal = new ModalBuilder()
      .setTitle('Join Youth Icon Github Organization')
      .setCustomId('modalTicketJoin');

    const nameInput = new TextInputBuilder()
      .setCustomId('nameInput')
      .setLabel('Please enter your full name')
      .setStyle(TextInputStyle.Short);

    const githubInput = new TextInputBuilder()
      .setCustomId('usernameInput')
      .setLabel('Please enter your GitHub username')
      .setRequired(true)
      .setStyle(TextInputStyle.Short);
    const email = new TextInputBuilder()
    .setCustomId('emailInput')
    .setLabel('Please enter your email address')
    .setRequired(true)
    .setStyle(TextInputStyle.Short)
    modal.addComponents(new ActionRowBuilder().addComponents(nameInput), new ActionRowBuilder().addComponents(githubInput), new ActionRowBuilder().addComponents(email));
    await interaction.showModal(modal);
  },
  ModalSubmit: async function submit(interaction, client) {
    // Ensure the guild is accessible through the client
    const guild = client.guilds.cache.get(interaction.guildId);

    // Create the channel
    const channel = await guild.channels.create({
      name: 'Ticket',
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: '1155351330471284797',
          allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: client.user.id,
          allow: [PermissionsBitField.Flags.SendMessages],
        },
      ],
    });
    const username = interaction.fields.getTextInputValue('nameInput');
    const githubUsername = interaction.fields.getTextInputValue('usernameInput');
    const email = interaction.fields.getTextInputValue('emailInput');
    const embed = new EmbedBuilder()
      .setTitle('Application')
      .setColor('Green')
      .addFields({ name: 'Full name: ', value: username })
      .addFields({ name: 'Github username: ', value: githubUsername })
      .addFields({ name: 'Email: ', value: email });
    // Send a message in the new channel
    channel.send({ embeds: [embed] });
    await interaction.reply({content: "A ticket has been Opened", ephemeral: true})
  },
};
