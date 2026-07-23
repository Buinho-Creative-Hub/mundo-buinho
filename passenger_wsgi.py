"""Entrada para cPanel/Passenger (Webtuga). Ver DEPLOY.md."""
import os
os.environ.setdefault("SITE", "mundo-buinho")
from app import app as application  # noqa
