import { ChatInputCommandInteraction, EmbedBuilder, ChannelType, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Form from '../../models/Form.model.js';

export const execute = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
    try {
        const channel = interaction.channel;
        if (!channel || channel.type !== ChannelType.GuildText) {
            return await interaction.editReply('❌ Команду можна використовувати тільки в текстових каналах.');
        }

        const [form, created] = await Form.findOrCreate({
            where: { form_channel_id: interaction.channelId },
            defaults: {
                title: 'Заявка на підтримку',
                description: 'Натисніть кнопку нижче, щоб відкрити форму',
                button_text: 'Відкрити форму',
                enabled: true
            }
        });

        if (!created) return await interaction.editReply('❌ У цьому каналі вже є налаштована форма.');

        const embed = new EmbedBuilder()
            .setTitle(form.getDataValue('title'))
            .setDescription(form.getDataValue('description'))
            .setColor(0x00FF00);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId(`create_app_${form.id}`)
                .setLabel(form.getDataValue('button_text'))
                .setStyle(ButtonStyle.Primary)
        );

        await channel.send({ embeds: [embed], components: [row] });
        await interaction.editReply('✅ Форму успішно створено!');
    } catch (err) {
        console.error(err);
        await interaction.editReply('💥 Помилка при створенні форми.');
    }
};

export default { execute };