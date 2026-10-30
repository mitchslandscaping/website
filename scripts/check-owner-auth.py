#!/usr/bin/env python3
"""Compatibility entry point; all checks now use disposable passkey fixtures."""
import os
os.execvp('node', ['node', '--test', 'scripts/owner-passkey.test.mjs'])
