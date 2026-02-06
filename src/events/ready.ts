import { ActivityType, Events } from 'discord.js';
import { client as botClient } from '../index.js'; 

export default {
    name: Events.ClientReady,
    once: true,
    execute(readyClient: any) {
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);

        readyClient.user.setActivity('Kherson, Ukraine | <>', { type: ActivityType.Watching });
    },
};