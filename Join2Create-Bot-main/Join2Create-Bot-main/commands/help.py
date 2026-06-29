"""
: ! Aegis !
    + Discord: itsfizys
    + Community: https://discord.gg/aerox (AeroX Development )
    + for any queries reach out Community or DM me.
"""

import discord
from discord.ext import commands
from discord import ui

SUPPORT_URL   = "https://discord.gg/aerox"
AEROX_URL     = "https://youtube.com/@aeroxdevs?si=IktH1HhWgSBKonJh"
COLOR_DEFAULT = 0xFFFFFF

HELP_PAGES = {
    "home": (
        "### Setup\n"
        "- **join2create setup** — Configure VoiceMaster for your server\n"
        "- **join2create sendinterface** — Send the VC control panel\n"
        "- **join2create reset** — Reset all VoiceMaster settings\n"
        "- **join2create category** — Set the category for temporary VCs"
    ),
    "controls": (
        "### Channel Controls\n"
        "- **join2create lock** — Lock your voice channel\n"
        "- **join2create unlock** — Unlock your voice channel\n"
        "- **join2create ghost** — Hide your voice channel\n"
        "- **join2create unghost** — Reveal your voice channel\n"
        "- **join2create claim** — Claim an inactive voice channel\n"
        "- **join2create name <name>** — Rename your voice channel\n"
        "- **join2create limit <number>** — Set user limit (0 = no limit)\n"
        "- **join2create bitrate <kbps>** — Set bitrate (8–384)\n"
        "- **join2create status [text]** — Set or clear a channel status\n"
        "- **join2create configuration** — View your channel info"
    ),
    "members": (
        "### Member Management\n"
        "- **join2create permit <member/role>** — Allow someone to join\n"
        "- **join2create reject <member/role>** — Block someone from joining\n"
        "- **join2create transfer <member>** — Transfer channel ownership\n"
        "- **join2create role <role>** — Assign a role to channel members"
    ),
    "defaults": (
        "### Default Settings\n"
        "- **join2create default** — View current defaults\n"
        "- **join2create default name <name>** — Set default channel name template\n"
        "- **join2create default limit <number>** — Set default user limit\n"
        "- **join2create default bitrate <kbps>** — Set default bitrate\n"
        "- **join2create default region [region]** — Set default region"
    ),
}


class HelpCategorySelect(discord.ui.Select):
    def __init__(self, current: str):
        options = [
            discord.SelectOption(label="Home",              value="home",     default=(current == "home")),
            discord.SelectOption(label="Channel Controls",  value="controls", default=(current == "controls")),
            discord.SelectOption(label="Member Management", value="members",  default=(current == "members")),
            discord.SelectOption(label="Default Settings",  value="defaults", default=(current == "defaults")),
        ]
        super().__init__(placeholder="Select a category...", options=options)

    async def callback(self, interaction: discord.Interaction):
        await interaction.response.edit_message(view=HelpView(self.values[0]))


class HelpView(ui.LayoutView):
    def __init__(self, category: str = "home"):
        super().__init__(timeout=None)

        container = ui.Container(accent_color=COLOR_DEFAULT)
        container.add_item(ui.TextDisplay("## Help Centre"))
        container.add_item(ui.Separator())
        container.add_item(ui.TextDisplay("-# Use the Menu Below to switch between different categories and view Join2Create commands."))
        container.add_item(ui.Separator())
        container.add_item(ui.TextDisplay(HELP_PAGES[category]))
        container.add_item(ui.ActionRow(HelpCategorySelect(category)))
        container.add_item(ui.Separator())
        container.add_item(ui.ActionRow(
            ui.Button(label="Support", style=discord.ButtonStyle.link, url=SUPPORT_URL),
            ui.Button(label="AeroX",   style=discord.ButtonStyle.link, url=AEROX_URL),
        ))
        self.add_item(container)


class Help(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        bot.remove_command("help")

    @commands.command(name="help", aliases=["h", "cmds", "commands"])
    async def help_command(self, ctx):
        await ctx.send(view=HelpView())


async def setup(bot):
    await bot.add_cog(Help(bot))
