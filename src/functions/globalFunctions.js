const { PermissionFlagsBits, PermissionsBitField} = require('discord.js')
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
        message.reply('This command is not available at this time')

    }
}