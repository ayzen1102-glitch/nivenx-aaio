"""
: ! Aegis !
    + Discord: itsfizys
    + Community: https://discord.gg/aerox (AeroX Development )
    + for any queries reach out Community or DM me.
"""

import discord
from discord.ext import commands
from discord import ui


async def setup(bot):
    await bot.add_cog(Help(bot))


class HelpView(ui.LayoutView):
    def __init__(self):
        super().__init__(timeout=None)

        container = ui.Container(accent_color=0xFFFFFF)

        container.add_item(ui.TextDisplay("## Help Centre"))
        container.add_item(ui.Separator())
        container.add_item(ui.TextDisplay("-# You can use the following commands to manage the guildtag system."))
        container.add_item(ui.Separator())

        container.add_item(ui.TextDisplay(
            "- **guildtag** - Show the current guild tag configuration\n"
            "- **guildtag enable** - Enable the guild tag system\n"
            "- **guildtag disable** - Disable the guild tag system\n"
            "- **guildtag channel set** - Set the channel where messages are sent\n"
            "- **guildtag channel remove** - Remove the configured channel\n"
            "- **guildtag role add** - Add a role as a guild tag reward\n"
            "- **guildtag role remove** - Remove a role from guild tag rewards\n"
            "- **guildtag role list** - List all configured reward roles\n"
            "- **guildtag message** - Set a plain text message for tag adoption\n"
            "- **guildtag message variables** - Show available message variables\n"
            "- **guildtag message remove** - Remove the current message\n"
            "- **guildtag list** - List all users who have adopted the guild tag\n"
            "- **guildtag config** - Show full guild tag settings"
        ))

        container.add_item(ui.Separator())

        container.add_item(ui.ActionRow(
            ui.Button(label="Support", style=discord.ButtonStyle.link, url="https://discord.gg/aerox"),
            ui.Button(label="AeroX", style=discord.ButtonStyle.link, url="https://youtube.com/@aeroxdevs?si=IktH1HhWgSBKonJh"),
        ))

        self.add_item(container)


class Help(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        bot.remove_command("help")

    @commands.command(name="help", aliases=["h", "cmds", "commands"])
    async def help_command(self, ctx):
        await ctx.send(view=HelpView())

"""
: ! Aegis !
    + Discord: itsfizys
    + Community: https://discord.gg/aerox (AeroX Development )
    + for any queries reach out Community or DM me.
"""
