const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { Octokit } = require('@octokit/rest');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Request a YouthIcon Github organization invitation')
        .addStringOption(option => option.setName('github_username').setDescription('Your Github username').setRequired(true))
        .addStringOption(option => option.setName('email').setDescription('Your email address').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for joining YouthIcon Github org').setRequired(false)),

    async execute(interaction, client) {
        var github_username = interaction.options.getString('github_username');
        var email = interaction.options.getString('email');
        var reason = interaction.options.getString('reason');

        // TODO: Add a check to see if the user is already in the org

        // send a github organisation invitation to the user

        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN,
          })

        const sendInvite = async (email, github_username, reason) => {
            try {
                const response = await octokit.request('POST /orgs/Youth-Icon/invitations', {
                    org: 'Youth-Icon',
                    email,
                    role: 'direct_member',
                }, {
                    headers: {
                        'X-GitHub-Api-Version': '2022-11-28'
                    },
                });
                console.log('Invitation sent to', email);
                // send a confirmation message to the user
                await interaction.reply(`Invitation has been sent to ${email}.`);

                // send a confirmation message to the YouthIcon team
                const channel = client.channels.cache.get(process.env.NEW_ORGMEMBER_LOG);
                await channel.send(`Invitation sent to ${email}. \nGithub username: [${github_username}](https://github.com/${github_username}) \nReason: ${reason}`);
                return response;
            }
            catch (error) {
                console.error('Error sending invitation', error.response?.data || error.message);
                // send an error message to the user
                await interaction.reply(`An error occured while sending the invitation to ${email} due to ${error.message}`);

                // send an error message to the YouthIcon team
                const channel = client.channels.cache.get(process.env.NEW_ORGMEMBER_LOG);
                await channel.send(`An error occured while sending the invitation to ${email}. \nGithub username: [${github_username}](https://github.com/${github_username}) \nReason: ${reason} \n`+ `${error.message}`);
            }
        }

        // email validation
        var email_regex = /\S+@\S+\.\S+/;
        if (!email_regex.test(email)) {
            await interaction.reply(`Invalid email address.`, { ephemeral: true });
            return;
        }

        // github username validation
        var github_username_regex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
        if (!github_username_regex.test(github_username)) {
            await interaction.reply(`Invalid Github username.`, { ephemeral: true });
            return;
        }

        sendInvite(email, github_username, reason);
        // To make the reply private to the user, use interaction.reply('Pong!', {ephemeral: true});
    },
}