import { ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import Form from '../../models/Form.model.js';
import Application from '../../models/Application.model.js';

export const execute = async (interaction: ChatInputCommandInteraction, currentForm: Form) => {
    try {
		await Application.destroy({ where: { form_id: currentForm.id } });
        await interaction.reply({ content: '✅ Всі заявки цієї форми було очищено!', flags: [MessageFlags.Ephemeral] });
    } catch (err) {
        await interaction.reply({ content: '❌ Не вдалося очистити заявки.', flags: [MessageFlags.Ephemeral] });
    }
};

export default { execute };