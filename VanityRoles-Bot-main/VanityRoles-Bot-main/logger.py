"""
: ! Aegis !
    + Discord: itsfizys
    + Community: https://discord.gg/aerox (AeroX Development )
    + for any queries reach out Community or DM me.
"""

import sys
import os
import traceback
from datetime import datetime

try:
    import pytz
    _tz = pytz.timezone("Asia/Kolkata")
except Exception:
    _tz = None

_COLORS = {
    "info":    ("#2F6FD6", "#E5E9F0"),
    "success": ("#0FA37F", "#E5E9F0"),
    "warn":    ("#C47A00", "#E5E9F0"),
    "error":   ("#C2362B", "#E5E9F0"),
    "debug":   ("#6B6B6B", "#E5E9F0"),
}

_MSG_COLOR  = "#D8DEE9"
_TIME_COLOR = "#7A7A7A"


def _rgb(hex_color):
    h = hex_color.lstrip("#")
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return lambda t: f"\x1b[38;2;{r};{g};{b}m{t}\x1b[0m"


def _badge(bg_hex, fg_hex):
    bh = bg_hex.lstrip("#")
    fh = fg_hex.lstrip("#")
    br, bgc, bb = int(bh[0:2], 16), int(bh[2:4], 16), int(bh[4:6], 16)
    fr, fg, fb = int(fh[0:2], 16), int(fh[2:4], 16), int(fh[4:6], 16)
    return lambda t: f"\x1b[48;2;{br};{bgc};{bb}m\x1b[38;2;{fr};{fg};{fb}m {t} \x1b[0m"


_msg_paint  = _rgb(_MSG_COLOR)
_time_paint = _rgb(_TIME_COLOR)

_badges = {k: _badge(bg, fg) for k, (bg, fg) in _COLORS.items()}


def _now():
    if _tz:
        return datetime.now(_tz).strftime("%H:%M:%S")
    return datetime.utcnow().strftime("%H:%M:%S")


_LOG_DIR  = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logs")
_LOG_FILE = os.path.join(_LOG_DIR, "bot.log")
os.makedirs(_LOG_DIR, exist_ok=True)


def _write_file(level, context, msg, error=None):
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    with open(_LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"[{ts}] [{level.upper()}] [{context}] {msg}\n")
        if error:
            traceback.print_exception(type(error), error, error.__traceback__, file=f)


def _log(level, context, msg, error=None):
    _write_file(level, context, msg, error)
    if level not in ("info", "success", "warn", "error"):
        return
    line = (
        f"{_time_paint(_now())} "
        f"{_badges[level](context):} "
        f"{_msg_paint(msg)}"
    )
    sys.stdout.write(line + "\n")
    sys.stdout.flush()


class _Logger:
    def info(self, context: str, msg: str):
        _log("info", context, msg)

    def success(self, context: str, msg: str):
        _log("success", context, msg)

    def warn(self, context: str, msg: str):
        _log("warn", context, msg)

    def error(self, context: str, msg: str, exc: Exception | None = None):
        _log("error", context, msg, exc)

    def debug(self, context: str, msg: str):
        _log("debug", context, msg)

    def banner(self):
        cyan  = _rgb("#4FC3F7")
        blue  = _rgb("#2F6FD6")
        dim   = _rgb("#4C566A")
        white = _rgb("#ECEFF4")
        green = _rgb("#0FA37F")

        lines = [
            "",
            cyan  ("  ██████╗  ███████╗██████╗  ██████╗ ██╗  ██╗"),
            cyan  ("  ██╔══██╗██╔════╝██╔══██╗██╔═══██╗╚██╗██╔╝"),
            blue  ("  ███████║█████╗  ██████╔╝██║   ██║ ╚███╔╝ "),
            blue  ("  ██╔══██║██╔══╝  ██╔══██╗██║   ██║ ██╔██╗ "),
            white ("  ██║  ██║███████╗██║  ██║╚██████╔╝██╔╝ ██╗"),
            white ("  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝"),
            "",
            dim   ("  ─────────────────────────────────────────────────"),
            f"  {green('●')} {white('GuildTag Bot')}   {dim('|')}   {white('discord.gg/aerox')}",
            f"  {green('●')} {white('Developer')}      {dim('|')}   {white('itsfizys · AeroX Development')}",
            dim   ("  ─────────────────────────────────────────────────"),
            "",
        ]
        for line in lines:
            sys.stdout.write(line + "\n")
        sys.stdout.flush()


logger = _Logger()
