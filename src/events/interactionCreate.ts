import { Events, BaseInteraction } from 'discord.js';

export default {
    name: Events.InteractionCreate,
    async execute(interaction: BaseInteraction) {
        if (interaction.isChatInputCommand()) {
            const command = (interaction.client as any).commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`❌ Помилка у команді ${interaction.commandName}:`, error);
                
                const errorMessage = { content: 'Виникла помилка при виконанні цієї команди!', ephemeral: true };
                
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        }
        
        else if (interaction.isAutocomplete()) {
            const client = interaction.client;
            const command = (client as any).commands.get(interaction.commandName);

            if (!command || !command.autocomplete) return;

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(`Ошибка автозаполнения:`, error);
            }
        }
    },
};