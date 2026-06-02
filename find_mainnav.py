import os
import re

base_dir = "c:\\Users\\pc\\Downloads\\stitch_sudaneel_logistics_platform\\stitch_sudaneel_logistics_platform"

for root, dirs, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.html') and not 'node_modules' in root:
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8') as file:
                    content = file.read()
                    if 'mainNav' in content or 'pt-' in content:
                        print(f"Found match: {os.path.relpath(path, base_dir)}")
                        # Print header tag and main tag
                        header = re.findall(r'<header[^>]*mainNav[^>]*>', content)
                        main = re.findall(r'<main[^>]*pt-[^>]*>', content)
                        print(f"  Header: {header}")
                        print(f"  Main: {main}")
            except Exception as e:
                pass
