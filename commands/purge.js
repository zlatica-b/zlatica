
module.exports = {
    name: 'purge',
    description: 'lets you purge up to 500 messages',
    execute(message, args) {
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.reply('that is not a vaild number.');
        } else if (amount <= 1 || amount > 100) {
            return message.reply('You need to put a number between 1 and 99!');
        }

        message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.channel.send('There was an error trying to purge messages in this channel!');
        })

        }
    }
