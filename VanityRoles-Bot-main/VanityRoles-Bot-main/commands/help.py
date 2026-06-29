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
        container.add_item(ui.TextDisplay("-# You can use the following commands to manage the VanityRoles system."))
        container.add_item(ui.Separator())

        container.add_item(ui.TextDisplay(
            "- **vanityroles** `(vr)` — Show the current vanity roles configuration\n"
            "- **vanityroles enable** — Enable the system *(asks for vanity text)*\n"
            "- **vanityroles disable** — Disable the system\n"
            "- **vanityroles vanity set** `<text>` — Update the monitored vanity text\n"
            "- **vanityroles vanity remove** — Remove the configured vanity text\n"
            "- **vanityroles channel set** `<#channel>` — Set the announcement channel\n"
            "- **vanityroles channel remove** — Remove the configured channel\n"
            "- **vanityroles role add** `<@role>` — Add a vanity reward role\n"
            "- **vanityroles role remove** `<@role>` — Remove a vanity reward role\n"
            "- **vanityroles role list** — List all configured reward roles\n"
            "- **vanityroles message** `<text>` — Set the vanity adoption message\n"
            "- **vanityroles message variables** — Show available message placeholders\n"
            "- **vanityroles message remove** — Remove the current message\n"
            "- **vanityroles list** — List all users currently holding the vanity role\n"
            "- **vanityroles config** — Show full vanity roles settings"
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
