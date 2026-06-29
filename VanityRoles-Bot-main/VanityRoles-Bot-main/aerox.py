"""
: ! Aegis !
    + Discord: itsfizys
    + Community: https://discord.gg/aerox (AeroX Development )
    + for any queries reach out Community or DM me.
"""

import asyncio
import logging
import sys

import discord
from discord import ui
from discord.ext import commands

import config
import database
from logger import logger

logging.basicConfig(
    level=logging.WARNING,
    format="[%(asctime)s] [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[logging.FileHandler("logs/discord.log")],
)

EXTENSIONS = [
    "commands.help",
    "commands.vanityroles",
]


class BotMode:
    pass


class AeroxContext(commands.Context):
    async def fail(self, message: str):
        container = ui.Container(accent_color=0xFFFFFF)
        container.add_item(ui.TextDisplay(f"-# {message}"))
        view = ui.LayoutView(timeout=None)
        view.add_item(container)
        await self.send(view=view, allowed_mentions=discord.AllowedMentions.none())

    async def usage(self, usage_str: str):
        container = ui.Container(accent_color=0xFFFFFF)
        container.add_item(ui.TextDisplay(f"-# Usage: `{self.prefix}{self.command} {usage_str}`"))
        view = ui.LayoutView(timeout=None)
        view.add_item(container)
        await self.send(view=view, allowed_mentions=discord.AllowedMentions.none())


class Aerox(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.members = True
        intents.message_content = True
        intents.presences = True

        super().__init__(
            command_prefix=config.PREFIX,
            intents=intents,
            case_insensitive=True,
        )

        self.cxn: database.SQLitePool | None = None
        self.mode = BotMode()

    async def get_context(self, message, *, cls=AeroxContext):
        return await super().get_context(message, cls=cls)

    async def setup_hook(self):
        logger.banner()
        logger.info("INIT", "Aerox is starting up")

        logger.info("DB", f"Opening database: {config.DATABASE_PATH}")
        try:
            self.cxn = await database.create_pool(config.DATABASE_PATH)
            logger.success("DB", "Database connection established")
            await self._create_tables()
        except Exception as e:
            logger.error("DB", f"Failed to open database: {e}", e)

        logger.info("INIT", "Loading extensions")
        for ext in EXTENSIONS:
            try:
                await self.load_extension(ext)
                logger.success("INIT", f"Loaded: {ext}")
            except Exception as e:
                logger.error("INIT", f"Failed to load {ext}: {e}", e)

    async def _create_tables(self):
        if not self.cxn:
            return
        await self.cxn.execute("""
            CREATE TABLE IF NOT EXISTS vanity_config (
                server_id   INTEGER PRIMARY KEY,
                enabled     INTEGER NOT NULL DEFAULT 0,
                vanity      TEXT,
                channel_id  INTEGER,
                message     TEXT,
                roles       TEXT
            )
        """)
        await self.cxn.execute("""
            CREATE TABLE IF NOT EXISTS vanity_users (
                server_id   INTEGER NOT NULL,
                user_id     INTEGER NOT NULL,
                adopted_at  TEXT NOT NULL DEFAULT (datetime('now')),
                PRIMARY KEY (server_id, user_id)
            )
        """)
        logger.success("DB", "Database tables verified")

    async def on_ready(self):
        logger.success("READY", f"Logged in as {self.user} (ID: {self.user.id})")
        logger.info("READY", f"Serving {len(self.guilds)} guild(s)")
        logger.success("READY", "Aerox is online and ready!")

    async def on_message(self, message: discord.Message):
        if message.author.bot:
            return

        if self.user in message.mentions and message.content.strip() in (
            f"<@{self.user.id}>",
            f"<@!{self.user.id}>",
        ):
            container = ui.Container(accent_color=0xFFFFFF)
            container.add_item(ui.TextDisplay("### AeroX VanityRoles Bot Here :3"))
            container.add_item(ui.Separator())
            container.add_item(ui.TextDisplay(
                f"Hey there, {message.author.mention}\n"
                f"**Welcome to the AeroX VanityRoles System!**\n"
                f"**Prefix for this bot is `{config.PREFIX}`**"
            ))
            container.add_item(ui.Separator())
            container.add_item(ui.TextDisplay(
                "-# Need Assistance? [Join Support](https://discord.gg/aerox)"
            ))
            view = ui.LayoutView(timeout=None)
            view.add_item(container)
            await message.reply(view=view, allowed_mentions=discord.AllowedMentions.none())
            return

        await self.process_commands(message)

    async def on_command_error(self, ctx, error):
        if isinstance(error, commands.CommandNotFound):
            return
        if isinstance(error, commands.MissingRequiredArgument):
            await ctx.send(f"Missing required argument: `{error.param.name}`. Check `{ctx.prefix}help {ctx.command}` for usage.")
            return
        if isinstance(error, commands.MissingPermissions):
            await ctx.send("You don't have permission to use this command.")
            return
        if isinstance(error, commands.BotMissingPermissions):
            await ctx.send("I don't have the required permissions for this command.")
            return
        if isinstance(error, commands.CommandOnCooldown):
            await ctx.send(f"This command is on cooldown. Try again in {error.retry_after:.1f}s.")
            return
        logger.error("CMD", f"Unhandled error in {ctx.command}: {error}", error)


async def main():
    token = config.TOKEN
    if not token or token == "YOUR_BOT_TOKEN_HERE":
        logger.error("INIT", "No bot token configured. Set the DISCORD_TOKEN secret.")
        sys.exit(1)

    bot = Aerox()
    async with bot:
        await bot.start(token)


if __name__ == "__main__":
    asyncio.run(main())

"""
: ! Aegis !
    + Discord: itsfizys
    + Community: https://discord.gg/aerox (AeroX Development )
    + for any queries reach out Community or DM me.
"""
