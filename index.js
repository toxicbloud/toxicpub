const Discord = require('discord.js');
const {
    token,
    prefix
} = require('./config.json');
const client = new Discord.Client();
var bannedMemberID = [];
var channels = require('./channels.json');

class ToxicMembre {
    /**
     * 
     * @param {String} memberid id du membre
     * @param {Number} xp 
     */
    constructor(memberid, xp) {
      this.memberid = memberid;
      this.xp = xp;
    }
  }
client.once('ready', async () => {
    console.log('Ready!');
    // client.api.applications(client.user.id).guilds('846839358597496854').commands.post({data: {
    //     name: 'ping',
    //     description: 'ping pong!'
    // }})
    const commands = await client.api.applications(client.user.id).guilds('846839358597496854').commands.get()
    console.log(commands)
    await client.api.applications(client.user.id)
});

client.on('message', message => {
    if (message.author.bot) return;
    if (message.content.startsWith('§ban')) {
        if (message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])) {
            toxicBan(message);
            return;
        }
        message.reply("Tu n'as pas les permissions nécessaires cette action sera enregistré.")
        const logs = message.member.guild.channels.cache.get('849321654105669713');
        logs.send(`${message.member} a essayé d'utiliser la commande §ban`);
        return;
    }
    if (message.channel.parentID === "846887098660945920") {
            pubEmbed(message);
            return;
    }
});
client.on("guildMemberRemove", member => {
    if (bannedMemberID.includes(member.id)) return;
    const logs = member.guild.channels.cache.get('849321654105669713');
    logs.send(`${member} quitte il a rejoins le ${member.joinedAt.toLocaleDateString()}`)
    member.ban({
        days: 7
    }).then(membre => {
        membre.guild.members.unban(member.id);
    })
    console.log("quelqu'un quitte")
    // member.guild.members.unban(member.id)
})
client.ws.on('INTERACTION_CREATE', async interaction => {
    console.log(interaction)
    const command = interaction.data.name.toLowerCase();
    if (command === "ping") {
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: 'pong',
                },
            },
        })
    }
})
/**
 * 
 * @param {Discord.Message} message 
 */
function toxicBan(message) {
    const arguments = message.content.split(/[ ]+/)
    arguments.shift();
    const user = getUserFromMention(arguments[0], client);
    const split = message.content.split('"');
    const reason = split[1];
    bannedMemberID.push(user.id)
    console.log(bannedMemberID)
    user.send("Tu es banni de ToxicPub, raison : " + reason).then(
        message.guild.members.ban(user, {
            reason,
            days: 7
        }).catch(error => {
            return message.channel.send(`Failed to ban **${user.tag}**: ${error}`);
        }))
    return;
}
/**
 * 
 * @param {String} mention string of id
 * @returns {Discord.User} mentioned user
 */
function getUserFromMention(mention, client) {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }

        return client.users.cache.get(mention);
    }
}
/**
 * 
 * @param {Discord.Message} message 
 */
function pubEmbed(message) {
    // message.channel.messages.fetch({around:"862509898130522123",limit:1}).then(msg=>{
    //     msg.delete()
    // })
    try {
        channels[message.channel.id].embed.delete();
    } catch (err) {
        console.log("pas d'embed a delete")
    }
    //    const msg = message.channel.messages.cache.get("862503798533390357");

    const embed = new Discord.MessageEmbed()
        .setColor("#4BCD4B")
        .setTitle("ToxicPub")
        .setThumbnail('https://i.imgur.com/AEnQrln.gif')
        .setDescription(`Respectez le <#846839552903741460> \nVous avez un slowmode de ${channels[message.channel.id].cooldown} \nVotre publicité a besoin d'une description`)
    message.channel.send(embed).then(msg => {
        channels[message.channel.id].embed = msg;
    })
    return;
}
/**
 * 
 * @param {Discord.Message} message 
 */
function xpUp(message){

}
client.login(token);