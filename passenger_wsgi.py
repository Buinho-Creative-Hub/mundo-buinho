"""
Entrada para cPanel/Passenger (Webtuga). Ver DEPLOY.md.

O Passenger arranca com um working directory imprevisível — por isso metemos a
pasta desta app no sys.path explicitamente, em vez de contar com o cwd.
(Armadilha registada em workflows/deploy-webtuga-CHECKLIST.md, ponto A4.)
"""
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
if AQUI not in sys.path:
    sys.path.insert(0, AQUI)

from app import app as application  # noqa: E402
