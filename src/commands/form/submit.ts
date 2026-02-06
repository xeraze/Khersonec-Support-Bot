import { ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import Form from '../../models/Form.model.js';

export const execute = async (interaction: ChatInputCommandInteraction, currentForm: Form) => {
    const newState = interaction.options.getBoolean('state', true);
    await currentForm.update({ enabled: newState });
    await interaction.reply({ 
        content: `✅ Прийом заявок тепер **${newState ? 'увімкнено' : 'вимкнено'}**!`, 
        flags: [MessageFlags.Ephemeral] 
    });
};

export default { execute };