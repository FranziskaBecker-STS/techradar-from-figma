"""Download unchanged MCP assets and reference screenshots; never edit sources/."""
import pathlib, json, subprocess, concurrent.futures

assets = json.loads(pathlib.Path('design-reference/assets.json').read_text())
shots = json.loads(pathlib.Path('design-reference/screenshots.json').read_text())
jobs = [(url, 'public/assets/' + name) for name, url in assets.items()]
jobs += [(v['image_url'], 'verification/figma-' + k.replace(':', '-') + '.png') for k, v in shots.items()]

if any(not url.startswith('https://') for url, _ in jobs):
    raise SystemExit('Temporary Figma download URLs were removed from this export. Runtime assets are already included. Obtain fresh URLs via Figma MCP before using this optional downloader.')

def download(job):
    url, path = job
    result = subprocess.run(['curl', '--fail', '--silent', '--show-error', '-L', url, '-o', path], capture_output=True, text=True)
    return path, result.returncode, result.stderr

with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    results = list(pool.map(download, jobs))
failed = [r for r in results if r[1]]
print(json.dumps({'downloaded': len(jobs) - len(failed), 'failed': failed}))
if failed:
    raise SystemExit(1)
