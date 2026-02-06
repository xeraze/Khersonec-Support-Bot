import { readdirSync, readFileSync, existsSync } from 'fs';
import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import { fileURLToPath } from 'url';
import configInit from './initializers/configInit.js';
import * as pathModule from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathModule.dirname(__filename);

const commandsPath = pathModule.resolve(__dirname, 'commands');
const eventsPath = pathModule.resolve(__dirname, 'events');
const parentDirectory = pathModule.resolve(__dirname, '..');

console.log('--- ПЕРЕВІРКА ДИРЕКТОРІЙ ---');
console.log('Шлях до команд:', commandsPath, '| Існує:', existsSync(commandsPath));
console.log('Шлях до подій:', eventsPath, '| Існує:', existsSync(eventsPath));
console.log('---------------------------');

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildMessageReactions
    ] 
});

(client as any).commands = new Collection();

export function loadConfig() {
    const configFile = readFileSync(pathModule.join(parentDirectory, 'config.json'), 'utf8');
    return JSON.parse(configFile);
}

async function registerEvents(botClient: Client) {
    try {
        const eventFiles = readdirSync(eventsPath);
        for (const file of eventFiles) {
            if (file.endsWith('.js') || file.endsWith('.ts')) {
                const filePath = pathModule.join(eventsPath, file);
                const fileUrl = `file://${filePath.replace(/\\/g, '/')}`;
                const eventModule = await import(fileUrl);
                const event = eventModule.default || eventModule;
                
                if (event.name) {
                    botClient[event.once ? 'once' : 'on'](event.name, (...args) => event.execute(...args));
                    console.log(`✅ Подію завантажено: ${event.name}`);
                }
            }
        }
    } catch (err) {
        console.error('❌ Помилка реєстрації подій:', err);
    }
}

async function registerCommands(botClient: Client) {
    try {
        const commandFiles = readdirSync(commandsPath);
        for (const file of commandFiles) {
            if (file.endsWith('.js') || file.endsWith('.ts')) {
                const filePath = pathModule.join(commandsPath, file);
                const fileUrl = `file://${filePath.replace(/\\/g, '/')}`;
                const commandModule = await import(fileUrl);
                const command = commandModule.default || commandModule;

                if (command.data && command.execute) {
                    (botClient as any).commands.set(command.data.name, command);
                    console.log(`📦 Команду завантажено: ${command.data.name}`);
                }
            }
        }
    } catch (err) {
        console.error('❌ Помилка реєстрації команд:', err);
    }
}

async function main() {
    try {
        const config = loadConfig();
        await registerCommands(client);
        await registerEvents(client);
        
        await client.login(config.token);

        const rest = new REST({ version: '10' }).setToken(config.token);
        const commandsData = (client as any).commands.map((c: any) => c.data.toJSON());

        console.log('🔄 Оновлюю слеш-команди в Discord...');
        await rest.put(
            Routes.applicationGuildCommands(client.user!.id, "1408921154491518998"),
            { body: commandsData },
        );
        console.log('✨ Слеш-команди успішно оновлено!');

        client.user?.setPresence({
            activities: [{ name: 'Kherson, Ukraine | <>', type: 3 }],
            status: 'online',
        });
        
        console.log(`🚀 Бот запущений як ${client.user?.tag}!`);
    } catch (error) {
        console.error('💥 Не вдалося запустити бота:', error);
    }
}

process.on('unhandledRejection', error => {
    console.error('❌ Необроблене відхилення промісу:', error);
});

console.log('--- ЗАПУСК БОТА ---');
configInit(parentDirectory).then(configSuccess => {
    if (configSuccess) {
        console.log('✅ Конфігурацію ініціалізовано успішно.');
        main();
    }
});

export default client;