"""Adapt only the fixed Figma illustration geometry to CSS; app layouts are responsive."""
import pathlib, re, json

def extract(source, node):
    start = source.rfind('<div', 0, source.index('data-node-id="'+node+'"'))
    depth = 0
    for m in re.finditer(r'</?div\b[^>]*>', source[start:]):
        depth += -1 if m.group().startswith('</') else 1
        if depth == 0:
            return source[start:start+m.end()]
    raise ValueError(node)

rules = {}
unknown = set()
def declarations(classes):
    css = {}; tx = ty = rot = None
    simple = {'absolute': ('position','absolute'), 'relative': ('position','relative'), 'block': ('display','block'), 'flex': ('display','flex'), 'contents': ('display','contents'), 'flex-col': ('flex-direction','column'), 'items-center': ('align-items','center'), 'justify-center': ('justify-content','center'), 'overflow-clip': ('overflow','hidden'), 'overflow-hidden': ('overflow','hidden'), 'whitespace-nowrap': ('white-space','nowrap'), 'max-w-none': ('max-width','none'), 'shrink-0': ('flex-shrink','0'), 'flex-none': ('flex','none'), 'not-italic': ('font-style','normal'), 'content-stretch': ('align-content','stretch')}
    for c in classes.split():
        if c in simple: k,v=simple[c];css[k]=v
        elif c == '-translate-x-1/2': tx='-50%'
        elif c == '-translate-y-1/2': ty='-50%'
        elif c == 'rotate-90': rot='90deg'
        elif c == 'size-full': css.update(width='100%',height='100%')
        elif c == 'w-full': css['width']='100%'
        elif c == 'h-0': css['height']='0'
        elif c in ['inset-0','top-0']: css['inset' if c=='inset-0' else 'top']='0'
        elif c in ['top-1/2','left-1/2','bottom-1/4']: css[c.split('-')[0]]='50%' if '1/2' in c else '25%'
        elif c.startswith('font-'): css['font-family']='"Proxima Nova A", Arial, sans-serif';css['font-weight']='600' if 'Semibold' in c else '400'
        elif c=='[word-break:break-word]': css['overflow-wrap']='break-word'
        else:
            m=re.match(r'([\w-]+)-\[(.*)\]$',c)
            if not m: unknown.add(c);continue
            key,v=m.groups();v=v.replace('_',' ').replace('\\/','/')
            v=re.sub(r'calc\((50%)([+-])',r'calc(\1 \2 ',v)
            v=re.sub(r'var\([^,]+,([^)]+)\)',r'\1',v)
            if key=='size':css.update(width=v,height=v)
            elif key in ['w','h','left','top','right','bottom','inset','gap','rounded','mask-position','mask-size','leading']:
                css[{'w':'width','h':'height','gap':'gap','rounded':'border-radius','leading':'line-height'}.get(key,key)]=v
            elif key=='px':css['padding-left']=css['padding-right']=v
            elif key=='py':css['padding-top']=css['padding-bottom']=v
            elif key=='bg':css['background']=v
            elif key=='text':css['color' if v.startswith(('color:', '#','var(')) else 'font-size']=v.removeprefix('color:').removeprefix('length:')
            else:unknown.add(c)
    if tx or ty or rot:css['transform']=' '.join([f'translate({tx or "0"}, {ty or "0"})']+([f'rotate({rot})'] if rot else []))
    return ';'.join(k+':'+v for k,v in css.items())

parts=[]
for name,file,node,w,h in [('FullRadar','287-2479','287:2579',661,677),('TechniqueRadar','174-1045','174:1208',649.011,673.973),('RingDiagram','244-1054','244:1936',339,358)]:
    source=pathlib.Path('design-reference/'+file+'.txt').read_text()
    aliases=dict(re.findall(r'const (img\w+) = `\$\{assetPathPrefix\}/([\w.]+)`;',source))
    jsx=extract(source,node)
    if name=='TechniqueRadar':
        bounds=json.loads(pathlib.Path('design-reference/technique-bounds.json').read_text())
        root=bounds[node]['bounds'];stack=[];layers=[]
        for m in re.finditer(r'<div\b[^>]*>|</div>|<img\b[^>]*>',jsx):
            tag=m.group()
            if tag.startswith('</'):stack.pop()
            elif tag.startswith('<div'):
                idmatch=re.search(r'data-node-id="([^"]+)"',tag)
                stack.append(idmatch.group(1) if idmatch else None)
            else:
                alias=re.search(r'src=\{(\w+)\}',tag).group(1)
                nodeid=next(i for i in reversed(stack) if i)
                b=bounds[nodeid]['bounds']
                # Render bounds are clipped by the quadrant's parent frame.
                # Restore the full exported vector box, including stroke overflow.
                svg=pathlib.Path('public/assets/'+aliases[alias]).read_text()
                svgroot=re.search(r'<svg[^>]+>',svg).group()
                sw=float(re.search(r'width="([\d.]+)"',svgroot).group(1));sh=float(re.search(r'height="([\d.]+)"',svgroot).group(1))
                rotated=b['height']>100*b['width'] and sw>100*sh
                b=dict(b);b['x']-=(sw-b['width'])/2;b['y']-=(sh-b['height'])/2;b['width']=sw;b['height']=sh
                properties={'position':'absolute','left':b['x']-root['x'],'top':b['y']-root['y'],'width':b['width'],'height':b['height']}
                if rotated:properties['transform']='rotate(90deg)'
                logo_ids={'I174:1208;266:4048':'alpine-lower','I174:1208;266:4052':'alpine-upper','I174:1208;266:4075':'kafka','I174:1208;266:4077':'abstract-inner','I174:1208;266:4083':'abstract-outer'}
                logo=logo_ids.get(nodeid)
                marker=f' data-quadrant-logo="{logo}"' if logo else ''
                style=json.dumps(properties)
                if logo:style=style[:-1]+f', "opacity": highlightedLogo === "{logo}" ? 0 : 1'+'}'
                layers.append(f'<FigmaAsset key="{len(layers)}" src="/assets/{aliases[alias]}" data-node-id="{nodeid}"'+marker+' style='+ '{'+style+'} />')
        parts.append(f'export function {name}({{ highlightedLogo = null }}: {{ highlightedLogo?: string | null }}) {{return <div style={{{{position:"relative",width:{w},height:{h},overflow:"hidden"}}}}>'+''.join(layers)+'</div>;}')
        continue
    # The caller positions and scales the native illustration as a single unit.
    jsx=re.sub(r'className="[^"]+"',f'style={{{{position:"relative",width:{w},height:{h},overflow:"hidden"}}}}',jsx,count=1)
    def replace(m):
        value=m.group(1)
        if value not in rules:rules[value]=(f'f{len(rules)}',declarations(value))
        return 'className="'+rules[value][0]+'"'
    jsx=re.sub(r'className="([^"]+)"',replace,jsx)
    for alias,asset in aliases.items():
        jsx=jsx.replace('src={'+alias+'}','src="/assets/'+asset+'"').replace('${'+alias+'}','/assets/'+asset)
    jsx=jsx.replace('<img ','<FigmaAsset ')
    props=''
    if name=='FullRadar':
        # Persistent original layers crossfade with the interactive blue overlays.
        logos={'Abstract 4':'abstract','amazonrekognition 4':'aws','adyen 4':'adyen','ansible 1':'ansible','apachekafka 4':'kafka','api-gateway 1':'api','Abstract 6':'abstract-outer','alpinejs 2':'alpine'}
        for label,key in logos.items():
            jsx=jsx.replace('data-name="'+label+'"', 'data-name="'+label+'" data-radar-logo="'+key+'" style={{opacity:highlightedLogos.includes("'+key+'")?0:1}}')
        props='{ highlightedLogos = [] }: { highlightedLogos?: string[] }'
    parts.append(f'export function {name}({props}) {{return (\n{jsx}\n);}}')
pathlib.Path('src/components/FigmaIllustrations.tsx').write_text('// Fixed vector artwork from high fidelity Figma MCP output. Do not use screenshots as assets.\nimport { FigmaAsset } from "./FigmaAsset";\nimport "./illustrations.css";\n'+'\n\n'.join(parts))
pathlib.Path('src/components/illustrations.css').write_text('\n'.join('.'+name+'{'+css+'}' for name,css in rules.values()))
print(json.dumps({'illustrationClasses':len(rules),'unhandled':sorted(unknown)}))
