import { 
    ChannelType, 
    SlashCommandBuilder, 
    PermissionFlagsBits, 
    ChatInputCommandInteraction, 
    AutocompleteInteraction,
    TextChannel,
    NewsChannel
} from 'discord.js';
import Form from '../models/Form.model.js';
import listCommand from './action/list.js';
import addCommand from './action/add.js';
import removeCommand from './action/remove.js';

export const data = new SlashCommandBuilder()
    .setName('action')
    .setDescription('Configures the actions for the current form')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand => subcommand.setName('list')
        .setDescription('Lists the actions for the current form'),
    )
    .addSubcommandGroup(subcommandGroup => subcommandGroup.setName('add')
        .setDescription('Add an action to take on approval or rejection')
        .addSubcommand(subcommand => subcommand.setName('addrole')
            .setDescription('Add a role to the user')
            .addStringOption(option => option.setName('name').setDescription('Name to identify the action with').setRequired(true))
            .addStringOption(option => option.setName('when').setDescription('When to take the action').setRequired(true)
                .addChoices({ name: 'Approved', value: 'approved' }, { name: 'Rejected', value: 'rejected' }))
            .addRoleOption(option => option.setName('role').setDescription('The role to add').setRequired(true)),
        )
        .addSubcommand(subcommand => subcommand.setName('removerole')
            .setDescription('Remove a role from the user')
            .addStringOption(option => option.setName('name').setDescription('Name to identify the action with').setRequired(true))
            .addStringOption(option => option.setName('when').setDescription('When to take the action').setRequired(true)
                .addChoices({ name: 'Approved', value: 'approved' }, { name: 'Rejected', value: 'rejected' }))
            .addRoleOption(option => option.setName('role').setDescription('The role to remove').setRequired(true)),
        )
        .addSubcommand(subcommand => subcommand.setName('ban')
            .setDescription('Ban the user')
            .addStringOption(option => option.setName('name').setDescription('Name to identify the action with').setRequired(true))
            .addStringOption(option => option.setName('when').setDescription('When to take the action').setRequired(true)
                .addChoices({ name: 'Approved', value: 'approved' }, { name: 'Rejected', value: 'rejected' }))
            .addStringOption(option => option.setName('reason').setDescription('The reason for the ban').setRequired(false)),
        )
        .addSubcommand(subcommand => subcommand.setName('kick')
            .setDescription('Kick the user')
            .addStringOption(option => option.setName('name').setDescription('Name to identify the action with').setRequired(true))
            .addStringOption(option => option.setName('when').setDescription('When to take the action').setRequired(true)
                .addChoices({ name: 'Approved', value: 'approved' }, { name: 'Rejected', value: 'rejected' }))
            .addStringOption(option => option.setName('reason').setDescription('The reason for the kick').setRequired(false)),
        )
        .addSubcommand(subcommand => subcommand.setName('sendmessage')
            .setDescription('Send a message to a channel')
            .addStringOption(option => option.setName('name').setDescription('Name to identify the action with').setRequired(true))
            .addStringOption(option => option.setName('when').setDescription('When to take the action').setRequired(true)
                .addChoices({ name: 'Approved', value: 'approved' }, { name: 'Rejected', value: 'rejected' }))
            .addChannelOption(option => option.setName('channel').setDescription('The channel to send the message to').setRequired(true)
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement))
            .addStringOption(option => option.setName('message').setDescription('The message to send').setRequired(true)),
        )
        .addSubcommand(subcommand => subcommand.setName('sendmessagedm')
            .setDescription('Send a message to the user')
            .addStringOption(option => option.setName('name').setDescription('Name to identify the action with').setRequired(true))
            .addStringOption(option => option.setName('when').setDescription('When to take the action').setRequired(true)
                .addChoices({ name: 'Approved', value: 'approved' }, { name: 'Rejected', value: 'rejected' }))
            .addStringOption(option => option.setName('message').setDescription('The message to send').setRequired(true)),
        )
        .addSubcommand(subcommand => subcommand.setName('delete')
            .setDescription('Delete the application')
            .addStringOption(option => option.setName('name').setDescription('Name to identify the action with').setRequired(true))
            .addStringOption(option => option.setName('when').setDescription('When to take the action').setRequired(true)
                .addChoices({ name: 'Approved', value: 'approved' }, { name: 'Rejected', value: 'rejected' })),
        ),
    )
    .addSubcommand(subcommand => subcommand.setName('remove')
        .setDescription('Removes an action')
        .addStringOption(option => option.setName('name').setDescription('Action name').setRequired(true).setAutocomplete(true)),
    );

export async function autocomplete(interaction: AutocompleteInteraction) {
    if (!interaction.channel) return;
    
    const subcommand = interaction.options.getSubcommand();
    const currentForm = await Form.findOne({ where: { form_channel_id: interaction.channel.id } });

    if (!currentForm) return await interaction.respond([]);

    if (subcommand === 'remove') {
        const actions = await (currentForm as any).$get('action');
        const focusedValue = interaction.options.getFocused();
        const filtered = actions.filter((a: any) => a.name.startsWith(focusedValue)).slice(0, 25);
        await interaction.respond(filtered.map((a: any) => ({ name: a.name, value: a.name })));
    }
}

export async function execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.channel) return;

    const subcommand = interaction.options.getSubcommand();
    const currentForm = await Form.findOne({ where: { form_channel_id: interaction.channel.id } });

    if (!currentForm) {
        await interaction.reply({ content: 'This channel is not a form channel!', ephemeral: true });
        return;
    }

    switch (subcommand) {
        case 'list':
            await listCommand(interaction, currentForm);
            break;
        case 'remove':
            await removeCommand(interaction, currentForm);
            break;
        default:
            await addCommand(interaction, currentForm, subcommand);
            break;
    }
}

export default { data, autocomplete, execute };