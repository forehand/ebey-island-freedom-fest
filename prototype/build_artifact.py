"""Bundles the prototype into one self-contained HTML file for publishing as a claude.ai artifact."""
import base64, re, pathlib
here = pathlib.Path(__file__).parent
def uri(p):
    mime = {'.woff2': 'font/woff2', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png'}[p.suffix]
    return f'data:{mime};base64,' + base64.b64encode(p.read_bytes()).decode()
def inline_assets(s):
    return re.sub(r'assets/([\w.-]+\.(?:woff2|webp|svg|png))', lambda m: uri(here / 'assets' / m.group(1)), s)
css = inline_assets((here / 'app.css').read_text())
css = css.replace('main{padding:calc(env(safe-area-inset-top) + 12px) 16px',
                  'main{padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:12px')
css = css.replace('padding:calc(env(safe-area-inset-top) + 12px) 16px calc(var(--tab-h) + env(safe-area-inset-bottom) + 24px)', '')
js = inline_assets((here / 'app.js').read_text())
js = js.replace("if ('serviceWorker' in navigator", "if (false && 'serviceWorker' in navigator")
out = f'''<title>Pitch In</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="robots" content="noindex">
<style>{css}
main{{padding-bottom:calc(var(--tab-h) + env(safe-area-inset-bottom,0px) + 24px)}}
.tabs{{padding-left:env(safe-area-inset-left,0px);padding-right:env(safe-area-inset-right,0px)}}
:root{{color-scheme:light}} body{{background:#E9E3BF}}
</style>
<div class="app"><main id="main"></main><nav id="tabs" class="tabs" aria-label="Main"></nav></div>
<script>{js}</script>
'''
pathlib.Path(__import__('sys').argv[1]).write_text(out)
print(len(out))
