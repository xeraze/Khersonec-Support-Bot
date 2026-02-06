import { ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js';
import Form from '../../models/Form.model.js';

export const execute = async (interaction: ChatInputCommandInteraction, currentForm: Form) => {
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
    try {
        const embed = new EmbedBuilder()
            .setTitle(`Налаштування: ${currentForm.getDataValue('title')}`)
            .setDescription('Виберіть параметр для зміни:')
            .setColor(0xFFA500);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId(`edit_title_${currentForm.id}`).setLabel('Заголовок').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(`edit_desc_${currentForm.id}`).setLabel('Опис').setStyle(ButtonStyle.Secondary)
        );

        await interaction.editReply({ embeds: [embed], components: [row] });
    } catch (err) {
        console.error(err);
        await interaction.editReply('💥 Помилка при відкритті меню редагування.');
    }
};

export default { execute };