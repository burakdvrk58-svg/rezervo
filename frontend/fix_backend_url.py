#!/usr/bin/env python3
import re, os

# Server-side API routes -> process.env.BACKEND_URL
api_files = [
    'src/app/api/messages/route.ts',
    'src/app/api/bookings/route.ts',
    'src/app/api/academicians/route.ts',
    'src/app/api/auth/register/route.ts',
    'src/app/api/auth/login/route.ts',
    'src/app/api/business/requests/route.ts',
    'src/app/api/admin/users/route.ts',
    'src/app/api/files/upload/route.ts',
    'src/app/api/school/bookings/route.ts',
    'src/app/api/school/bookings/[id]/route.ts',
    'src/app/api/school/rooms/route.ts',
    'src/app/api/notifications/route.ts',
    'src/app/api/analytics/route.ts',
    'src/app/api/reviews/route.ts',
]

# Client-side components -> process.env.NEXT_PUBLIC_BACKEND_URL
client_files = [
    'src/app/meeting/[id]/page.tsx',
    'src/app/(dashboard)/business/messages/page.tsx',
    'src/app/(dashboard)/customer/messages/page.tsx',
]

def fix_file(filepath, env_var):
    base = '/Users/burakdivriklioglu/Desktop/rezervo/frontend'
    full = os.path.join(base, filepath)
    if not os.path.exists(full):
        print(f"  SKIP (not found): {filepath}")
        return

    with open(full, 'r') as f:
        content = f.read()

    const_line = f"const BACKEND_URL = process.env.{env_var} || 'http://localhost:8081'\n"

    # Replace 'http://localhost:8081/...' (single quotes)
    content = re.sub(r"'http://localhost:8081(/[^']*)'", r'`${BACKEND_URL}\1`', content)
    # Replace `http://localhost:8081/...` (template literals)
    content = re.sub(r'`http://localhost:8081(/[^`]*)`', r'`${BACKEND_URL}\1`', content)
    # Replace remaining exact matches
    content = content.replace("'http://localhost:8081'", '`${BACKEND_URL}`')

    # Add the const if BACKEND_URL is now used but not defined
    if '${BACKEND_URL}' in content and 'const BACKEND_URL' not in content:
        # Insert after last import line
        lines = content.split('\n')
        last_import = 0
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                last_import = i
        lines.insert(last_import + 1, const_line)
        content = '\n'.join(lines)

    with open(full, 'w') as f:
        f.write(content)
    print(f"  FIXED: {filepath}")

print("=== Fixing server-side API routes ===")
for f in api_files:
    fix_file(f, 'BACKEND_URL')

print("\n=== Fixing client-side components ===")
for f in client_files:
    fix_file(f, 'NEXT_PUBLIC_BACKEND_URL')

print("\nDone! Now set these env vars:")
print("  BACKEND_URL=https://rezervo-production-f85f.up.railway.app")
print("  NEXT_PUBLIC_BACKEND_URL=https://rezervo-production-f85f.up.railway.app")
