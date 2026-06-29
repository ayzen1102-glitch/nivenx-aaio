"""
: ! Aegis !
    + Discord: itsfizys
    + Community: https://discord.gg/aerox (AeroX Development )
    + for any queries reach out Medicine or DM me.
"""

import asyncio

import discord
from discord import ui
from discord.ext import commands

from utilities import checks
from utilities import converters
from utilities import decorators
from logger import logger


async def setup(bot):
    await bot.add_cog(VanityRoles(bot))


def _simple(text: str) -> ui.LayoutView:
    view = ui.LayoutView(timeout=None)
    container = ui.Container(accent_color=0xFFFFFF)
    container.add_item(ui.TextDisplay(text))
    view.add_item(container)
    return view


def _has_vanity(member: discord.Member, vanity: str) -> bool:
    vanity_lower = vanity.lower()
    for activity in member.activities:
        if isinstance(activity, discord.CustomActivity):
            text = (activity.name or '') + ' ' + (activity.state or '')
            if vanity_lower in text.lower():
                return True
        elif getattr(activity, 'type', None) == discord.ActivityType.custom:
            name = getattr(activity, 'name', '') or ''
            state = getattr(activity, 'state', '') or ''
            text = name + ' ' + state
            if vanity_lower in text.lower():
                return True
    return False


class VanityRoles(commands.Cog):

    def __init__(self, bot):
        self.bot = bot

    async def get_vanity_config(self, guild_id: int):
        query = """
                SELECT enabled, vanity, channel_id, message, roles
                FROM vanity_config
                WHERE server_id = $1
                """
        record = await self.bot.cxn.fetchrow(query, guild_id)
        if record:
            return {
                'enabled': record['enabled'],
                'vanity': record['vanity'],
                'channel_id': record['channel_id'],
                'message': record['message'],
                'roles': record['roles'] or [],
            }
        return None

    async def get_vanity_users(self, guild_id: int):
        query = """
                SELECT user_id, adopted_at
                FROM vanity_users
                WHERE server_id = $1
                ORDER BY adopted_at DESC
                """
        return await self.bot.cxn.fetch(query, guild_id)

    @decorators.group(
        name="vanityroles",
        aliases=["vr"],
        brief="Manage vanity roles settings.",
        invoke_without_command=True,
        case_insensitive=True,
    )
    @checks.guild_only()
    @checks.cooldown()
    async def vanityroles(self, ctx):
        if ctx.invoked_subcommand is None:
            await ctx.invoke(self.vanityroles_config)

    @vanityroles.command(
        name="enable",
        brief="Enable vanity roles for the server."
    )
    @checks.guild_only()
    @checks.has_perms(manage_guild=True)
    @checks.cooldown()
    async def vanityroles_enable(self, ctx):
        prompt = ui.LayoutView(timeout=None)
        container = ui.Container(accent_color=0xFFFFFF)
        container.add_item(ui.TextDisplay(
            "What vanity text should I monitor in member statuses?\n"
            "-# Reply with the text (e.g. `[AX]`). Type `cancel` to abort."
        ))
        prompt.add_item(container)
        await ctx.send(view=prompt, allowed_mentions=discord.AllowedMentions.none())

        def check(m: discord.Message):
            return m.author == ctx.author and m.channel == ctx.channel

        try:
            reply = await self.bot.wait_for('message', timeout=30.0, check=check)
        except asyncio.TimeoutError:
            return await ctx.send(
                view=_simple("Timed out waiting for a response. Run the command again."),
                allowed_mentions=discord.AllowedMentions.none()
            )

        if reply.content.strip().lower() == 'cancel':
            return await ctx.send(
                view=_simple("Cancelled."),
                allowed_mentions=discord.AllowedMentions.none()
            )

        vanity = reply.content.strip()
        if not vanity:
            return await ctx.send(
                view=_simple("Vanity text cannot be empty. Run the command again."),
                allowed_mentions=discord.AllowedMentions.none()
            )

        query = """
                INSERT INTO vanity_config (server_id, enabled, vanity)
                VALUES ($1, TRUE, $2)
                ON CONFLICT (server_id)
                DO UPDATE SET enabled = TRUE, vanity = excluded.vanity
                """
        await self.bot.cxn.execute(query, ctx.guild.id, vanity)
        await ctx.send(
            view=_simple(f"Vanity Roles system **enabled**. Monitoring for: `{vanity}`"),
            allowed_mentions=discord.AllowedMentions.none()
        )

    @vanityroles.command(
        name="disable",
        brief="Disable vanity roles for the server."
    )
    @checks.guild_only()
    @checks.has_perms(manage_guild=True)
    @checks.cooldown()
    async def vanityroles_disable(self, ctx):
        query = """
                UPDATE vanity_config
                SET enabled = FALSE
                WHERE server_id = $1
                """
        await self.bot.cxn.execute(query, ctx.guild.id)
        await ctx.send(
            view=_simple("Vanity Roles system **disabled**."),
            allowed_mentions=discord.AllowedMentions.none()
        )

    @vanityroles.group(
        name="vanity",
        brief="Manage the vanity text.",
        invoke_without_command=True,
        case_insensitive=True,
    )
    @checks.guild_only()
    @checks.cooldown()
    async def vanityroles_vanity(self, ctx):
        if ctx.invoked_subcommand is None:
            await ctx.usage("vanity <set/remove>")

    @vanityroles_vanity.command(
        name="set",
        brief="Set the vanity text to monitor."
    )
    @checks.guild_only()
    @checks.has_perms(manage_guild=True)
    @checks.cooldown()
    async def vanityroles_vanity_set(self, ctx, *, vanity: str):
        query = """
                INSERT INTO vanity_config (server_id, vanity)
                VALUES ($1, $2)
                ON CONFLICT (server_id)
                DO UPDATE SET vanity = excluded.vanity
                """
        await self.bot.cxn.execute(query, ctx.guild.id, vanity)
        await ctx.send(
            view=_simple(f"Vanity text set to: `{vanity}`"),
            allowed_mentions=discord.AllowedMentions.none()
        )

    @vanityroles_vanity.command(
        name="remove",
        aliases=["delete", "clear"],
        brief="Remove the configured vanity text."
    )
    @checks.guild_only()
    @checks.has_perms(manage_guild=True)
    @checks.cooldown()
    async def vanityroles_vanity_remove(self, ctx):
        query = """
                UPDATE vanity_config
                SET vanity = NULL
                WHERE server_id = $1
                """
        await self.bot.cxn.execute(query, ctx.guild.id)
        await ctx.send(
            view=_simple("Vanity text removed."),
            allowed_mentions=discord.AllowedMentions.none()
        )

    @vanityroles.group(
        name="channel",
        brief="Manage the announcement channel.",
        invoke_without_command=True,
        case_insensitive=True,
    )
    @checks.guild_only()
    @checks.cooldown()
    async def vanityroles_channel(self, ctx):
        if ctx.invoked_subcommand is None:
            await ctx.usage("channel <set/remove>")

    @vanityroles_channel.command(
        name="set",
        brief="Set the announcement channel."
    )
    @checks.guild_only()
    @checks.has_perms(manage_guild=True)
    @checks.cooldown()
    async def vanityroles_channel_set(self, ctx, channel: discord.TextChannel):
        query = """
                INSERT INTO vanity_config (server_id, channel_id)
                VALUES ($1, $2)
                ON CONFLICT (server_id)
                DO UPDATE SET channel_id = excluded.channel_id
                """
        await self.bot.cxn.execute(query, ctx.guild.id, channel.id)
        await ctx.send(
            view=_simple(f"Announcement channel set to {channel.mention}."),
            allowed_mentions=discord.AllowedMentions.none()
        )

    @vanityroles_channel.command(
        name="remove",
        aliases=["delete", "clear"],
        brief="Remove the announcement channel."
    )
    @checks.guild_only()
    @checks.has_perms(manage_guild=True)
    @checks.cooldown()
    async def vanityroles_channel_remove(self, ctx):
        query = """
                UPDATE vanity_config
                SET channel_id = NULL
                WHERE server_id = $1
                """
        await self.bot.cxn.execute(query, ctx.guild.id)
        await ctx.send(
            view=_simple("Announcement channel removed."),
            allowed_mentions=discord.AllowedMentions.none()
        )

    @vanityroles.group(
        name="role",
        brief="Manage vanity reward roles.",
        invoke_without_command=True,
        case_insensitive=True,
    )
    @checks.guild_only()
    @checks.cooldown()
    async def vanityroles_role(self, ctx):
        if ctx.invoked_subcommand is None:
            await ctx.invoke(self.vanityroles_role_list)

    @vanityroles_role.command(
        name="add",
        brief="Add a vanity reward role."
    )
    @checks.guild_only()
    @checks.has_perms(manage_guild=True)
    @checks.bot_has_perms(manage_roles=True)
    @checks.cooldown()
    async def vanityroles_role_add(self, ctx, *, role: converters.DiscordRole):
        res = await checks.role_priv(ctx, role)
        if res:
            return await ctx.fail(res)

        query = "SELECT roles FROM vanity_config WHERE server_id = $1"
        record = await self.bot.cxn.fetchrow(query, ctx.guild.id)
        current_roles = record['roles'] if record and record['roles'] else []

        if role.id in current_roles:
            return await ctx.fail(f"Role {role.mention} is already a vanity reward role.")

        current_roles.append(role.id)

        query = """
                INSERT INTO vanity_config (server_id, roles)
                VALUES ($1, $2)
                ON CONFLICT (server_id)
                DO UPDATE SET roles = excluded.roles
                """
        await self.bot.cxn.execute(query, ctx.guild.id, current_roles)
        await ctx.send(
            view=_simple(f"{role.mention} added as a vanity reward role."),
            allowed_mentions=discord.AllowedMentions.none()
        )

    @vanityroles_role.command(
        name="remove",
        aliases=["delete", "rm"],
        brief="Remove a vanity reward role."
    )
    @checks.guild_only()
    @checks.has_perms(manage_guild=True)
    @checks.cooldown()
    async def vanityroles_role_remove(self, ctx, *, role: converters.DiscordRole):
        query = "SELECT roles FROM vanity_config WHERE server_id = $1"
        record = await self.bot.cxn.fetchrow(query, ctx.guild.id)

        if not record or not record['roles']:
            return await ctx.fail("No vanity reward roles configured.")

        current_roles = record['roles']

        if role.id not in current_roles:
            return await ctx.fail(f"Role {role.mention} is not a vanity reward role.")

        current_roles.remove(role.id)

        query = "UPDATE vanity_config SET roles = $1 WHERE server_id = $2"
        await self.bot.cxn.execute(query, current_roles, ctx.guild.id)
        await ctx.send(
            view=_simple(f"{role.mention} removed from vanity reward roles."),
            allowed_mentions=discord.AllowedMentions.none()
        )

    @vanityroles_role.command(
        name="list",
        brief="List all vanity reward roles."
    )
    @checks.guild_only()
    @checks.has_perms(manage_guild=True)
    @checks.cooldown()
    async def vanityroles_role_list(self, ctx):
        query = "SELECT roles FROM vanity_config WHERE server_id = $1"
        record = await self.bot.cxn.fetchrow(query, ctx.guild.id)

        if not record or not record['roles']:
            return await ctx.fail("No vanity reward roles configured.")

        roles = [ctx.guild.get_role(rid).mention for rid in record['roles'] if ctx.guild.get_role(rid)]

        if not roles:
            return await ctx.fail("No valid vanity reward roles found.")

        view = ui.LayoutView(timeout=None)
        container = ui.Container(accent_color=0xFFFFFF)
        container.add_item(ui.TextDisplay("## Vanity Reward Roles"))
        container.add_item(ui.Separator())
        container.add_item(ui.TextDisplay("\n".join(roles)))
        container.add_item(ui.Separator())
        container.add_item(ui.TextDisplay(f"-# Total: {len(roles)} role{'s' if len(roles) != 1 else ''}"))
        view.add_item(container)
        await ctx.send(view=view, allowed_mentions=discord.AllowedMentions.none())

    @vanityroles.group(
        name="message",
        brief="Set the vanity adoption message.",
        invoke_without_command=True,
        case_insensitive=True,
    )
    @checks.guild_only()
    @checks.has_perms(manage_guild=True)
    @checks.cooldown()
    async def vanityroles_message(self, ctx, *, message: str = None):
        if message is None:
            view = ui.LayoutView(timeout=None)
            container = ui.Container(accent_color=0xFFFFFF)
            container.add_item(ui.TextDisplay("## vanityroles message"))
            container.add_item(ui.Separator())
            container.add_item(ui.TextDisplay(
                "Set a plain text message sent to the configured channel when a user adopts the vanity.\n\n"
                "**Arguments**\n"
                f"- `message` — The message to send *(required)*\n\n"
                "**Subcommands**\n"
                f"- `{ctx.prefix}vanityroles message variables` — View available placeholders\n"
                f"- `{ctx.prefix}vanityroles message remove` — Remove the current message"
            ))
            view.add_item(container)
            await ctx.send(view=view, allowed_mentions=discord.AllowedMentions.none())
            return

        query = """
                INSERT INTO vanity_config (server_id, message)
                VALUES ($1, $2)
                ON CONFLICT (server_id)
                DO UPDATE SET message = excluded.message
                """
        await self.bot.cxn.execute(query, ctx.guild.id, message)
        await ctx.send(
            view=_simple("Vanity adoption message updated."),
            allowed_mentions=discord.AllowedMentions.none()
        )

    @vanityroles_message.command(
        name="variables",
        aliases=["vars", "placeholders"],
        brief="Show available message variables."
    )
    @checks.guild_only()
    @checks.cooldown()
    async def vanityroles_message_variables(self, ctx):
        view = ui.LayoutView(timeout=None)
        container = ui.Container(accent_color=0xFFFFFF)
        container.add_item(ui.TextDisplay("## Message Variables"))
        container.add_item(ui.Separator())
        container.add_item(ui.TextDisplay(
            f"- `{{user.mention}}` — {ctx.author.mention}\n"
            f"- `{{user.name}}` — {ctx.author.name}\n"
            f"- `{{user.id}}` — {ctx.author.id}\n"
            f"- `{{server.name}}` — {ctx.guild.name}"
        ))
        container.add_item(ui.Separator())
        container.add_item(ui.TextDisplay("-# Use these in your message to personalise the vanity adoption notification."))
        view.add_item(container)
        await ctx.send(view=view, allowed_mentions=discord.AllowedMentions.none())

    @vanityroles_message.command(
        name="remove",
        aliases=["delete", "clear"],
        brief="Remove the vanity adoption message."
    )
    @checks.guild_only()
    @checks.has_perms(manage_guild=True)
    @checks.cooldown()
    async def vanityroles_message_remove(self, ctx):
        query = """
                INSERT INTO vanity_config (server_id, message)
                VALUES ($1, NULL)
                ON CONFLICT (server_id)
                DO UPDATE SET message = NULL
                """
        await self.bot.cxn.execute(query, ctx.guild.id)
        await ctx.send(
            view=_simple("Vanity adoption message removed."),
            allowed_mentions=discord.AllowedMentions.none()
        )

    @vanityroles.command(
        name="config",
        aliases=["settings", "show"],
        brief="Show the vanity roles settings."
    )
    @checks.guild_only()
    @checks.has_perms(manage_guild=True)
    @checks.cooldown()
    async def vanityroles_config(self, ctx):
        config = await self.get_vanity_config(ctx.guild.id)

        if not config:
            return await ctx.send(
                view=_simple("Vanity Roles system is not configured for this server."),
                allowed_mentions=discord.AllowedMentions.none()
            )

        status = "Enabled" if config['enabled'] else "Disabled"
        vanity_text = f"`{config['vanity']}`" if config['vanity'] else "Not set"
        channel = ctx.guild.get_channel(config['channel_id']) if config['channel_id'] else None
        channel_text = channel.mention if channel else "Not set"

        roles = [ctx.guild.get_role(rid).mention for rid in config['roles'] if ctx.guild.get_role(rid)]
        roles_text = "\n".join(roles) if roles else "None configured"

        message_text = config['message'] if config['message'] else "Not set"
        if len(message_text) > 1024:
            message_text = message_text[:1021] + "..."

        view = ui.LayoutView(timeout=None)
        container = ui.Container(accent_color=0xFFFFFF)
        container.add_item(ui.TextDisplay("## Vanity Roles Configuration"))
        container.add_item(ui.Separator())
        container.add_item(ui.TextDisplay(
            f"**Status** — {status}\n"
            f"**Vanity Text** — {vanity_text}\n"
            f"**Channel** — {channel_text}"
        ))
        container.add_item(ui.Separator())
        container.add_item(ui.TextDisplay(f"**Reward Roles**\n{roles_text}"))
        container.add_item(ui.Separator())
        container.add_item(ui.TextDisplay(f"**Message**\n{message_text}"))
        container.add_item(ui.Separator())
        container.add_item(ui.TextDisplay(f"-# {ctx.guild.name}"))
        view.add_item(container)
        await ctx.send(view=view, allowed_mentions=discord.AllowedMentions.none())

    @vanityroles.command(
        name="list",
        brief="List all users currently holding the vanity role."
    )
    @checks.guild_only()
    @checks.cooldown()
    async def vanityroles_list(self, ctx):
        users = await self.get_vanity_users(ctx.guild.id)

        if not users:
            return await ctx.fail("No users are currently tracked with the vanity text.")

        user_lines = []
        for record in users[:25]:
            member = ctx.guild.get_member(record['user_id'])
            if member:
                timestamp = discord.utils.format_dt(record['adopted_at'], style='R')
                user_lines.append(f"- {member.mention} — {timestamp}")

        total = len(users)

        view = ui.LayoutView(timeout=None)
        container = ui.Container(accent_color=0xFFFFFF)
        container.add_item(ui.TextDisplay("## Users with Vanity in Status"))
        container.add_item(ui.Separator())
        container.add_item(ui.TextDisplay("\n".join(user_lines) if user_lines else "No valid members found."))
        container.add_item(ui.Separator())
        container.add_item(ui.TextDisplay(f"-# Total: {total} user{'s' if total != 1 else ''} — Showing {min(25, total)}"))
        view.add_item(container)
        await ctx.send(view=view, allowed_mentions=discord.AllowedMentions.none())

    async def _apply_vanity(self, guild: discord.Guild, member: discord.Member, config: dict):
        already_tracked = await self.bot.cxn.fetchrow(
            "SELECT 1 FROM vanity_users WHERE server_id = $1 AND user_id = $2",
            guild.id, member.id
        )
        await self.bot.cxn.execute(
            """
            INSERT INTO vanity_users (server_id, user_id)
            VALUES ($1, $2)
            ON CONFLICT (server_id, user_id) DO NOTHING
            """,
            guild.id, member.id
        )
        if config['roles']:
            roles_to_add = [
                guild.get_role(rid) for rid in config['roles']
                if guild.get_role(rid)
                and guild.get_role(rid) not in member.roles
                and guild.get_role(rid).position < guild.me.top_role.position
            ]
            if roles_to_add:
                try:
                    await member.add_roles(*roles_to_add, reason="User adopted vanity in status")
                    logger.info("VANITY", f"Gave roles to {member} in {guild.name}")
                except Exception as e:
                    logger.error("VANITY", f"Failed to add roles to {member}: {e}", e)

        if not already_tracked and config['channel_id'] and config['message']:
            channel = guild.get_channel(config['channel_id'])
            if channel:
                try:
                    msg = config['message']
                    msg = msg.replace('{user.mention}', member.mention)
                    msg = msg.replace('{user.name}', member.name)
                    msg = msg.replace('{user.id}', str(member.id))
                    msg = msg.replace('{server.name}', guild.name)
                    container = ui.Container(accent_color=0xFFFFFF)
                    container.add_item(ui.TextDisplay(msg))
                    view = ui.LayoutView(timeout=None)
                    view.add_item(container)
                    await channel.send(view=view, allowed_mentions=discord.AllowedMentions(users=True))
                except Exception as e:
                    logger.error("VANITY", f"Failed to send adoption message: {e}", e)

    async def _remove_vanity(self, guild: discord.Guild, member: discord.Member, config: dict):
        await self.bot.cxn.execute(
            "DELETE FROM vanity_users WHERE server_id = $1 AND user_id = $2",
            guild.id, member.id
        )
        if config['roles']:
            roles_to_remove = [
                guild.get_role(rid) for rid in config['roles']
                if guild.get_role(rid)
                and guild.get_role(rid) in member.roles
                and guild.get_role(rid).position < guild.me.top_role.position
            ]
            if roles_to_remove:
                try:
                    await member.remove_roles(*roles_to_remove, reason="User removed vanity from status")
                    logger.info("VANITY", f"Removed roles from {member} in {guild.name}")
                except Exception as e:
                    logger.error("VANITY", f"Failed to remove roles from {member}: {e}", e)

    @commands.Cog.listener()
    async def on_presence_update(self, before: discord.Member, after: discord.Member):
        guild = after.guild
        if not guild:
            return

        config = await self.get_vanity_config(guild.id)
        if not config or not config['enabled'] or not config['vanity']:
            return

        vanity = config['vanity']
        was_match = _has_vanity(before, vanity)
        is_match = _has_vanity(after, vanity)

        if is_match == was_match:
            return

        if is_match and not was_match:
            logger.info("VANITY", f"{after} adopted vanity in {guild.name}")
            await self._apply_vanity(guild, after, config)
        elif was_match and not is_match:
            logger.info("VANITY", f"{after} dropped vanity in {guild.name}")
            await self._remove_vanity(guild, after, config)
