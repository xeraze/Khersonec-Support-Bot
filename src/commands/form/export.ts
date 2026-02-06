import { ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import Form from '../../models/Form.model.js';

export const execute = async (interaction: ChatInputCommandInteraction, currentForm: Form) => {
    await interaction.reply({ content: '📊 Генерація файлу експорту... (функція в розробці)', flags: [MessageFlags.Ephemeral] });
};

export default { execute };