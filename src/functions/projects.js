const axios = require('axios')
const {EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js')
module.exports = {
    projects: async function projects(interaction){
        const url = "https://api.github.com/orgs/Youth-Icon/repos";
        axios.get(url)
        .then(async (response) =>{
            const embedMessage = new EmbedBuilder()
            .setTitle('Projects')
            .setDescription('These are the organization projects')
            .setColor("#FF5400")
            .setThumbnail('https://avatars.githubusercontent.com/u/143860530?s=200&v=4')
            const data = response.data;
            data.forEach((repo, index) => {
                embedMessage.addFields({name: `${index + 1}`, value: repo.name});
                
            });
            const gitorg = new ButtonBuilder()
            .setURL('https://github.com/Youth-Icon')
            .setLabel('Open Github Organization')
            .setStyle(ButtonStyle.Link)
            
            const row = new ActionRowBuilder()
            .addComponents(gitorg)
            
            await interaction.reply({embeds: [embedMessage], components: [row]})
        });
        

    }
}