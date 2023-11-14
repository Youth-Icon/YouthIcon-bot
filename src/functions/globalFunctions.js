const { PermissionsBitField} = require('discord.js')
const data = require('./globalvars.json')
module.exports = {
    nudge: async function nudge(interaction){
        const channel = interaction.channel;
        const id = data.team_role
        await channel.send({
            content: `<@${id}>`
        })
        await interaction.reply('We nudge the team')
        
    },
    close: async function close(message, client){
        const channel = message.channel;
        await message.reply('This channel is closed. We hope you had a good experience');
        await channel.permissionOverwrites.set(
            [
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
                    id: message.user.id,
                    deny: [PermissionsBitField.Flags.SendMessages]
                }
            ]
        )
        
    }
}