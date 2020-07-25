const fs = require(`fs`);
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const { config } = require('process');
const { permissions } = require('discord.js');
const { waitForDebugger } = require('inspector');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.on('ready', () => {  //when the bot is ready
	console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
	client.user.setActivity(`Helping out in, ${client.guilds.cache.size} servers!`)
});

client.on("guildCreate", guild => {   //when da bot joins a new server
	console.log(`New guild joined: ${guild.name} (id: ${guid.id}). This guild has ${guild.memberCount} members!`)
	client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
})

client.on("guildDelete", guild => {
	console.log(`I have been removed from ${guild.name} (id: ${guild.id}).`)
	client.user.setActivity(`Helping out in, ${client.guilds.cache.size} servers!`)
})




client.on("message", async message => {

	if(message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();


	if (command === "kick"){ //controls the kick script

		let member = message.mentions.members.first() || message.guild.members.get(args[0]);
		let reason = args.slice(1).join(' ');

		if(!message.member.hasPermission('ADMINISTRATOR')){
			return message.reply("you do not have permission to use this command.");
		} else if (!member) {
			return message.reply("please mention a user in this server.");
		} else if (!member.kickable) {
			return message.reply("I cannot kick them, do they have a higher role than you?");
		}

		await member.kick(reason)
			.catch(error => message.reply(`${member.author} cannot be kicked because of : ${error}.`));
		message.channel.send(`${member.user} has been kicked.`) 
	
	} //end of kick


	if (command === "ban") { //controls the ban script

		let member = message.mentions.members.first () || message.guild.members.get(args[0]);
		let reason = args.slice(1).join(' ');
		
		if(!message.member.hasPermission('ADMINISTRATOR')){
			return message.reply("you do not have permission to use this command."); //review this , potential spam issue
		} else if (!member) {
			return message.reply("please mention a user in this server!");
		} else if (!member.bannable) {
			return message.reply("I cannot ban this user! Do they have a higher role than you? Do I have permissions to ban?")
		}

		await member.ban(reason) 
			.catch(error => message.reply(`${member.author} cannot be banned because of : ${error}`));
		message.channel.send(`${member.user} has been banned.`)

	} //end of ban


	if (command === "purge") { //deletes meesages
		if(!message.member.hasPermission('ADMINISTRATOR')){
			return message.reply("you do not have permission to use this command!")
		}

		const deleteCount = parseInt(args[0], 10);

		if (!deleteCount || deleteCount < 2 || deleteCount > 100)
			return message.reply("Please provide a number between 2 and 100 for the purge to complete!");
			
		const fetched = await message.channel.messages.fetch({limit: deleteCount});
		message.channel.bulkDelete(fetched)
		   .catch (error => message.reply(`The purge was failed due to, ${error}!`));



	} //end of purge







		
	if (command === "brian") {
		message.channel.send("he is a simp.");
	}

})



client.login(token);