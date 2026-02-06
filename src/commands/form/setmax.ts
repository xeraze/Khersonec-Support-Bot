import { ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import Form from '../../models/Form.model.js';

export const execute = async (interaction: ChatInputCommandInteraction, currentForm: Form) => {
    const max = interaction.options.getInteger('max');
    await interaction.reply({ content: `✅ Максимальна кількість заявок встановлена на: ${max || 'Безліміт'}`, flags: [MessageFlags.Ephemeral] });
};

export default { execute };