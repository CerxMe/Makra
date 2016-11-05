// import the modules
var fs = require('fs');
const Discord = require('discord.js');
const mongorito = require('mongorito');
const Model = mongorito.Model;
class Makra extends Model {
}

mongorito.connect('localhost/Makra');


// init
const bot = new Discord.Client();

//get the token from token.json
const token = JSON.parse(fs.readFileSync('token.json', 'utf8')).token;

bot.on('ready', () => {
    console.log('I am ready!');
});

// create an event listener for messages
bot.on('message', message => {
    if(message.channel.type === 'dm') return;            //Disables Direct Messages
    if (message.content != null) {                       //What are the odds of this happening?
        if (!message.author.bot) {                       //Prevents the bot to respond to itself... and potential abuse
            if (message.content.charAt(0) == "$") {      //Using the "$" as a prefix

                let admin = message.channel.permissionsFor(message.member).hasPermission("MANAGE_MESSAGES"); //checks for admin permissions
                //Remove the prefix
                while (message.content.charAt(0) === '$')
                       message.content = message.content.substr(1);

                //Macro section
                if (/^m /.test(message.content)) {
                    message.content = message.content.replace('m ', '');            //cleanup


                    //Create new macro
                    if(/^create/.test(message.content)){
                        message.content = message.content.replace('create', '');
                        message.content = message.content.replace(/^(\s*)/, '');    //get rid of the whitespace left behind

                        //Extract the desired macro name
                        if(/^".*"/.test(message.content)){
                            //Macro is a string with spaces
                            var macrostr = /".*"/.exec(message.content)[0];
                            message.content = message.content.replace(macrostr, ''); //unfortunately, they need to be duped because of the ""
                            var macrostr = macrostr.slice(1,-1); //remove the ""
                        }
                        else{
                            //Single string, stops when a space is spotted
                            var macrostr = /[^ ]*/.exec(message.content)[0];
                            message.content = message.content.replace(macrostr, ''); // fells sad man

                        }
                        macrostr = macrostr.toLocaleLowerCase();                     //Who would ever want something like this to be case-sensitive?
                        message.content = message.content.replace(/^(\s*)/, '');     //get rid of the whitespace left behind

                        if(message.content){
                           Makra.findOne({ guild: message.guild.id, command: macrostr }).then(function (res) {
                               if(!res){
                                   let macro = new Makra({
                                       guild: message.guild.id,
                                       author: message.author.id,
                                       command: macrostr,
                                       content: message.content
                                   });

                                   macro.save();
                                   message.channel.sendMessage("Macro \""+macrostr+"\" has been set");

                                   console.log(message.author.username + " in " + message.guild.name + " created new macro \""+ macrostr+"\"");

                               }
                               else
                                   message.channel.sendMessage("This macro already exists!");
                           })
                        }
                        else
                            message.channel.sendMessage("Cannot create blank macro!");
                    } else





                    //Edit macro
                    if(/^edit/.test(message.content)){
                        message.content = message.content.replace('edit', '');
                        message.content = message.content.replace(/^(\s*)/, '');    //get rid of the whitespace left behind

                        //Extract the desired macro name
                        if(/^".*"/.test(message.content)){
                            //Macro is a string with spaces
                            var macrostr = /".*"/.exec(message.content)[0];
                            message.content = message.content.replace(macrostr, ''); //unfortunatelly, they need to be duped because of the ""
                            var macrostr = macrostr.slice(1,-1); //remove the ""
                        }
                        else{
                            //Single string, stops when a space is spotted
                            var macrostr = /[^ ]*/.exec(message.content)[0];
                            message.content = message.content.replace(macrostr, ''); // fells sad man

                        }
                        macrostr = macrostr.toLocaleLowerCase();
                        message.content = message.content.replace(/^(\s*)/, '');    //get rid of the whitespace left behind

                        if(message.content){
                            Makra.findOne({ guild: message.guild.id, command: macrostr }).then(function (res) {
                                if(res){
                                    if(res.get().author == message.author.id || admin) {
                                        console.log(message.author.username + " in " + message.guild.name + " edited macro \"" + macrostr + "\"");
                                        res.set('content', message.content);
                                        res.set('edited_at', new Date());
                                        res.save();

                                        message.channel.sendMessage("Macro \"" + macrostr + "\" has been updated!");
                                    }
                                    else
                                        message.channel.sendMessage("Sorry, but you can't do that!");
                                }
                                else
                                    message.channel.sendMessage("Macro \""+macrostr+"\" does not exist!");
                            })
                        }
                        else
                            message.channel.sendMessage("The macro cannot be blank! No changes have been done.");
                    } else






                    //Delete
                    if(/^delete/.test(message.content)){
                        message.content = message.content.replace('delete', '');
                        message.content = message.content.replace(/^(\s*)/, '');    //get rid of the whitespace left behind

                        //Extract the desired macro name
                        if(/^".*"/.test(message.content)){
                            //Macro is a string with spaces
                            var macrostr = /".*"/.exec(message.content)[0];
                            message.content = message.content.replace(macrostr, ''); //unfortunatelly, they need to be duped because of the ""
                            var macrostr = macrostr.slice(1,-1); //remove the ""
                        }
                        else{
                            //Single string, stops when a space is spotted
                            var macrostr = /[^ ]*/.exec(message.content)[0];
                            message.content = message.content.replace(macrostr, ''); // fells sad man

                        }
                        macrostr = macrostr.toLocaleLowerCase();
                        message.content = message.content.replace(/^(\s*)/, '');    //get rid of the whitespace left behind

                            Makra.findOne({ guild: message.guild.id, command: macrostr }).then(function (res) {
                                if(res){
                                    if(res.get().author == message.author.id || admin) {
                                        console.log(message.author.username + " in " + message.guild.name + " removed macro \""+ macrostr+"\"");
                                        res.remove();

                                        message.channel.sendMessage("Macro \""+macrostr+"\" has been removed!");
                                    }
                                      else
                                        message.channel.sendMessage("Sorry, but you can't do that!");

                                }
                                else
                                    message.channel.sendMessage("Macro \""+macrostr+"\" does not exist!");
                            })
                    } else









                    //Search macros!
                    if(/^find/.test(message.content)){
                        message.content = message.content.replace('find', '');
                        message.content = message.content.replace(/^(\s*)/, '');    //get rid of the whitespace left behind
                        macrostr = message.content.toLocaleLowerCase();

                        if(message.content.length > 1){
                        console.log(message.author.username + " in " + message.guild.name + " searches for \""+ macrostr+"\"");

                        let searchfor = new RegExp(macrostr, 'i');

                        var result = [];
                        var itemsProcessed = 0;
                        Makra.where('command', searchfor).find().then(res => {
                            if(res.length > 0) {
                                res.forEach(sres => {
                                    if (sres.get().guild == message.guild.id) {
                                        result.push(sres.get().command);
                                    }

                                    itemsProcessed++;
                                    if (itemsProcessed === res.length) {
                                        message.channel.sendMessage(`Found ${result.length.toString()} ${(result.length > 1 ? "items" : "item")}: "${result.join('", "')}"`)
                                    }
                                })
                            }  else
                                   message.channel.sendMessage('No results found');

                        }).catch(error => console.log(error));
                        }
                            else
                            message.channel.sendMessage('Please, use at least 2 characters to search');

                    }





                    //Send the desired macro!
                    else{
                        macrostr = message.content.toLocaleLowerCase();
                        Makra.findOne({ guild: message.guild.id, command: macrostr }).then(function (res) {
                            if(!res)
                                message.channel.sendMessage("There's no such macro");
                            else{
                                console.log(message.author.username + " in " + message.guild.name + " used \""+ macrostr+"\"");
                                macro = res.get();
                                message.channel.sendMessage(macro.content);

                                //Count number of uses
                                if(!macro.hits)
                                    macro.hits = 0;

                                res.set('hits', macro.hits+1 );
                                res.save();
                            }

                        });
                    }
                }
            }
        }
    }
});

// log our bot in
bot.login(token);
