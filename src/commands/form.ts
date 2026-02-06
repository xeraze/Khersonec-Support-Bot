import { channelMention, SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import Form from '../models/Form.model.js';

import setup from './form/setup.js';
import edit from './form/edit.js';
import erase from './form/erase.js';
import submit from './form/submit.js';
import exportCmd from './form/export.js';
import setmax from './form/setmax.js';

const subcommands: Record<string, any> = { 
    setup, edit, erase, submit, 
    export: exportCmd, 
    setmax 
};

export const data = new SlashCommandBuilder()
    .setName('form')
    .setDescription('Керування формами')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(s => s.setName('setup').setDescription('Створити нову форму'))
    .addSubcommand(s => s.setName('edit').setDescription('Редагувати форму'))
    .addSubcommand(s => s.setName('list').setDescription('Список всіх форм'))
    .addSubcommand(s => s.setName('erase').setDescription('Очистити всі заявки'))
    .addSubcommand(s => s.setName('submit').setDescription('Увімкнути прийом')
        .addBooleanOption(o => o.setName('state').setDescription('Стан').setRequired(true)))
    .addSubcommand(s => s.setName('export').setDescription('Експортувати форму'))
    .addSubcommand(s => s.setName('setmax').setDescription('Встановити максимальну кількість заявок'))
    ;

export async function execute(interaction: ChatInputCommandInteraction) {
    const subcommandName = interaction.options.getSubcommand();
    
    if (subcommandName === 'list') {
        const forms = await Form.findAll();
        const list = forms.length > 0 
            ? forms.map(f => `${channelMention(f.form_channel_id)} - **${f.title}**`).join('\n')
            : 'Форм не знайдено.';
        return interaction.reply({ content: list, flags: [MessageFlags.Ephemeral] });
    }

    const currentForm = await Form.findOne({ where: { form_channel_id: interaction.channelId } });

    if (!currentForm && subcommandName !== 'setup') {
        return interaction.reply({ content: '❌ Цей канал не є каналом форми!', flags: [MessageFlags.Ephemeral] });
    }

    const command = subcommands[subcommandName];
    if (command?.execute) {
        await command.execute(interaction, currentForm);
    } else {
        await interaction.reply({ content: '⚠️ Команду ще не реалізовано.', flags: [MessageFlags.Ephemeral] });
    }
}

export default { data, execute };