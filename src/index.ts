import { Client, Intents, MessageEmbed, TextChannel } from 'discord.js';

import config from './config.json';

const DISCORD_CLIENT = new Client({ ws: { intents: Intents.ALL } });

DISCORD_CLIENT.on('ready', async () => {
    console.log(`Logged in as ${DISCORD_CLIENT.user?.tag}!`);
});

DISCORD_CLIENT.on('message', async (message) => {
    if (message.author.bot) return;

    if (config.watchlist.some((word) => message.content.toLowerCase().includes(word.toLowerCase()))) {
        const logChannel = (await DISCORD_CLIENT.channels.fetch(config.logChannelId)) as TextChannel; // canal bot-testing do mib

        const embed = new MessageEmbed();

        const refMsgUrl = `https://discord.com/channels/${message.guild?.id}/${message.channel.id}/${message.id}`;

        embed.setAuthor(message.author.username, message.author.avatarURL() || '', refMsgUrl);
        embed.setDescription(`[ir para mensagem](${refMsgUrl})\n\n${message.content}`);
        embed.setURL(refMsgUrl);
        embed.setFooter(message.author.username);
        embed.setTimestamp(message.createdAt);
        embed.setColor(0x008fff);

        await logChannel.send(embed);
    }
});

DISCORD_CLIENT.login(config.bot.token);
