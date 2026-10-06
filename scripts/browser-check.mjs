import { chromium, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { categoryPaths, quadrantPages, quadrantPageExamples, technologies, technologyArticles } from '../src/data.ts';
import { currentRadarLogos } from '../src/components/currentRadarLogos.ts';
import { radarConnections } from '../src/components/radarLogos.ts';

const browser=await chromium.launch({channel:'chrome',headless:true});
const errors=[];
const rows=[];
const screens=[['home','/'],['techniques','/techniques'],['platforms','/platforms'],['tools','/tools'],['languages-frameworks','/languages-frameworks'],...technologyArticles.map(article=>[article.id,article.detail]),['explanation','/techradar']];
const categoryRoutes=[['Platforms','/platforms'],['Tools','/tools'],['Languages & Frameworks','/languages-frameworks']];
async function checkQuadrantKeyboardOrder(page, category) {
  // Preserve the separate skip link, then verify the requested sequence starting at the brand.
  await expect(page.locator('.skip-link')).toHaveAttribute('href','#content');
  await page.locator('.brand').focus();
  await page.keyboard.press('Tab');await expect(page.locator('.hero-breadcrumb a')).toBeFocused();
  for (const link of await page.locator('.category-jumps a').all()) {
    await page.keyboard.press('Tab');await expect(link).toBeFocused();
  }
  await page.keyboard.press('Tab');await expect(page.locator('.scroll-cue')).toBeFocused();
  const cards=page.locator('.techniques-content .technology-card');
  await expect(cards).toHaveCount(quadrantPageExamples[category].length);
  for (const card of await cards.all()) {
    const before=await card.boundingBox();
    await page.keyboard.press('Tab');await expect(card).toBeFocused();
    const focus=await card.evaluate(el=>({border:getComputedStyle(el).borderTopWidth,color:getComputedStyle(el).borderTopColor,outline:getComputedStyle(el).outlineStyle}));
    assert.deepEqual(focus,{border:'3px',color:'rgb(0, 53, 238)',outline:'none'});
    const after=await card.boundingBox();assert.equal(after.width,before.width);assert.equal(after.height,before.height);
  }
  if (category==='Techniques') await expect(cards.first()).toHaveText('Automated Security Testing');
  const firstUnavailable=page.locator('.techniques-content .technology-card[aria-disabled=true]').first();
  if (await firstUnavailable.count()) {
    const url=page.url();await firstUnavailable.focus();await firstUnavailable.press('Enter');
    assert.equal(page.url(),url);await expect(firstUnavailable).toBeFocused();
    await expect(firstUnavailable).toHaveAttribute('title','Detailseite noch nicht verfügbar');
  }
}
async function checkHeaderArtwork(page,viewportWidth) {
  const articlePage=await page.locator('.hero-detail').count()>0;
  if(viewportWidth<768||articlePage) {
    const artwork=page.locator(viewportWidth<768?'.hero-art-mobile-static':'.hero-art-desktop');
    await expect(artwork.locator('img')).toHaveAttribute('src',viewportWidth<768?'/assets/b4102.svg':'/assets/7b448.svg');
    await expect(artwork.locator('img')).toBeVisible();
    await expect(artwork.locator('.hero-quadrant')).toHaveCount(0);
    await expect(viewportWidth<768?page.locator('.hero-art-region'):artwork).toHaveAttribute('aria-hidden','true');
    if(articlePage) await expect(page.locator('.hero-detail .hero-quadrant')).toHaveCount(0);
    return;
  }
  const artwork=page.locator('.hero-quadrant-desktop');
  const native=artwork.locator('.hero-quadrant-native');
  await expect.poll(async()=> (await native.boundingBox())?.width || 0).toBeGreaterThan(0);
  const box=await artwork.boundingBox();const quadrant=await native.boundingBox();
  assert(quadrant.width>0&&quadrant.height>0,'quadrant is visible');
  assert(quadrant.x>=box.x-1&&quadrant.y>=box.y-1,'quadrant fits at top/right');
  assert(quadrant.x+quadrant.width<=box.x+box.width+1,'quadrant fits horizontally');
  assert(quadrant.y+quadrant.height<=box.y+box.height+1,'quadrant fits vertically');
  assert(quadrant.y+quadrant.height<=await page.evaluate(()=>innerHeight),'quadrant stays inside the hero');
  const key=await native.getAttribute('data-quadrant');
  const dimensions=await native.evaluate(el=>({width:parseFloat(el.style.width),height:parseFloat(el.style.height)}));
  assert(Math.abs(quadrant.width/quadrant.height-dimensions.width/dimensions.height)<.001,'quadrant preserves proportions');
  const logos=native.locator('.hero-quadrant-logo');
  await expect(logos).toHaveCount({techniques:5,platforms:9,tools:13,'languages-frameworks':13}[key]);
  if(key==='techniques') await expect(native.locator('[data-quadrant-logo]')).toHaveCount(5);
  else await expect(native.locator(`[data-asset="/assets/category-${key}-radar.svg"]`)).toHaveCount(1);
  for(const logo of await logos.all()) {
    await expect(logo).toHaveAttribute('tabindex','-1');
    const name=(await logo.getAttribute('aria-label')).split(',')[0];
    await logo.focus();await expect(native.getByRole('tooltip')).toHaveText(name);
    const highlight=logo.locator('.hero-quadrant-highlight');
    await expect(highlight).toHaveCSS('background-color','rgb(0, 0, 1)');
    await expect(highlight).toHaveCSS('opacity','1');
    await page.keyboard.press('Escape');await expect(native.getByRole('tooltip')).toHaveCount(0);
  }
  await page.locator('.brand').focus();
  // Use a fully visible logo as the pointer target; some Figma variants contain edge fragments.
  const pointerLogo=logos.nth(1);
  await pointerLogo.hover();
  await expect(native).toHaveAttribute('data-active-logo',await pointerLogo.getAttribute('data-logo'));
  await expect(native.getByRole('tooltip')).toHaveText((await pointerLogo.getAttribute('aria-label')).split(',')[0]);
  await expect(pointerLogo.locator('.hero-quadrant-highlight')).toHaveCSS('opacity','1');
  await pointerLogo.focus();await page.keyboard.press('Escape');
}
try {
  for(const width of [1440,900,393]) {
    const context=await browser.newContext({viewport:{width,height:width===393?852:902},deviceScaleFactor:1});
    const page=await context.newPage();
    page.on('pageerror',e=>errors.push(e.message));
    for(const [name,path] of screens){
      await page.setViewportSize({width,height:width===1440?902:width===393?852:1000});
      await page.goto('http://127.0.0.1:5173'+path);await page.evaluate(()=>document.fonts.ready);await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.complete?Promise.resolve():new Promise(resolve=>img.addEventListener('load',resolve,{once:true})))));
      await page.screenshot({path:`verification/${name}-${width}.png`,fullPage:true});
      const metrics=await page.evaluate(()=>({width:innerWidth,viewportHeight:innerHeight,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,font:getComputedStyle(document.querySelector('h1')).fontFamily,fontsLoaded:document.fonts.check('400 24px "Proxima Nova A"')&&document.fonts.check('600 60px "Proxima Nova A"'),h1:document.querySelector('h1').getBoundingClientRect().toJSON(),images:[...document.images].filter(i=>i.getBoundingClientRect().width&&i.getBoundingClientRect().height).map(i=>({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0,width:i.getBoundingClientRect().width,height:i.getBoundingClientRect().height}))}));
      assert.equal(metrics.scrollWidth,width,`${name} overflow at ${width}`);assert(metrics.images.every(i=>i.ok),`${name} broken image`);
      const brand=await page.locator('.brand').boundingBox();
      assert(Math.abs(brand.x+brand.width/2-width/2)<1,`${name}: logo is centered`);
      if(name!=='explanation') {
        assert.equal(await page.locator('.hero').evaluate(el=>el.getBoundingClientRect().height),metrics.viewportHeight);
        if(width===393) {
          const region=await page.locator('.hero-art-region').boundingBox();
          const copy=await page.locator('.hero-copy').boundingBox();
          const graphic=await page.locator('.hero-art-mobile').boundingBox();
          assert(region.y+region.height<=copy.y,`${name}: clipped graphic cannot overlap text`);
          assert(graphic.x+graphic.width>width,`${name}: static artwork remains cropped at right edge`);
          assert(Math.abs(graphic.y-region.y)<1,`${name}: artwork starts at top of its region`);
        } else {
          const graphic=await page.locator('.hero-art-desktop').boundingBox();
          assert(graphic.x+graphic.width>=width-1,`${name}: graphic stays at viewport right edge`);
        }
      }
      if(name!=='home'&&name!=='explanation') await checkHeaderArtwork(page,width);
      const quadrant=quadrantPages[path.slice(1)];
      if(quadrant) await checkQuadrantKeyboardOrder(page,quadrant.category);
      rows.push({name,width,...metrics});
    }
    await page.goto('http://127.0.0.1:5173');
    await page.getByRole('link',{name:width===393?'Zu Techniques':'Alle ansehen',exact:true}).first().click();await page.waitForURL('**/techniques');
    await page.getByRole('link',{name:'DevOps',exact:true}).click();await page.waitForURL('**/techniques/devops');await expect(page.locator('h1')).toContainText('DevOps');
    await page.getByRole('navigation',{name:'Brotkrümelnavigation'}).getByRole('link',{name:'Techniques',exact:true}).filter({visible:true}).click();await page.waitForURL('**/techniques');
    await page.getByRole('link',{name:'Techradar – zur Homepage'}).click();await page.waitForURL('http://127.0.0.1:5173/');
    await page.getByRole('link',{name:'Weitere Details zum Techradar'}).click();await page.waitForURL('**/techradar');await page.goBack();await page.waitForURL('http://127.0.0.1:5173/');
    for(const [category,path] of categoryRoutes) {
      await page.goto('http://127.0.0.1:5173/');
      const teaser=page.locator(width===393?'.mobile-category-list .category-teaser':'.radar-overview .category-teaser').filter({has:page.getByRole('heading',{name:category,exact:true})});
      await teaser.getByRole('link').click();await page.waitForURL('**'+path);
      await expect(page.locator('h1')).toHaveText(category);
      await expect(page.getByRole('heading',{name:`Alles in ${category}`,exact:true})).toBeVisible();
      await expect(page.locator('.technology-card')).toHaveCount(quadrantPageExamples[category].length);
      const nav=page.getByRole('navigation',{name:'Andere Quadranten'});
      await expect(nav.getByRole('link')).toHaveCount(3);
      const target=await nav.getByRole('link').first().getAttribute('href');
      await nav.getByRole('link').first().click();await page.waitForURL('**'+target);
      await page.getByRole('navigation',{name:'Brotkrümelnavigation'}).getByRole('link',{name:'Techradar',exact:true}).click();await page.waitForURL('http://127.0.0.1:5173/');
    }
    for(const article of technologyArticles.filter(item=>item.sourceScreenshot)) {
      if(width===393) {
        await page.goto('http://127.0.0.1:5173'+categoryPaths[article.category]);
        await page.locator(`.techniques-content .technology-card[href="${article.detail}"]`).click();
      } else {
        await page.goto('http://127.0.0.1:5173/?view=list&category=all');
        await page.getByLabel('Schlagwortsuche').fill(article.name);
        await page.getByLabel('Schlagwortsuche').press('Enter');
        await page.locator(`.list-overview .technology-card[href="${article.detail}"]`).click();
      }
      await page.waitForURL('**'+article.detail);
      await expect(page.locator('h1')).toHaveText(article.headline);
      await expect(page).toHaveTitle(`${article.name} · SYZYGY Techsolutions`);
      await expect(page.locator('.prose p')).toHaveText(article.paragraphs.map(paragraph=>paragraph.text));
      await expect(page.locator('.related .technology-card')).toHaveCount(article.relatedNames.length);
      if(article.id==='figma') {
        await page.locator('.related .technology-card[href="/languages-frameworks/typescript"]').click();
        await page.waitForURL('**/languages-frameworks/typescript');await page.goBack();
        await page.waitForURL('**'+article.detail);
      }
      if(width===393) {
        const combo=page.getByRole('combobox',{name:new RegExp(article.category.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+' durchsuchen')});
        await combo.scrollIntoViewIfNeeded();await expect(combo).toHaveText(article.name);
        await combo.click();const list=page.getByRole('listbox');
        await expect(list.getByRole('group')).toHaveCount(4);
        await expect(list.getByRole('option')).toHaveCount(technologies.filter(item=>item.category===article.category).length);
        const sibling=technologyArticles.find(item=>item.category===article.category&&item.id!==article.id);
        if(sibling) {
          await list.getByRole('option',{name:sibling.name,exact:true}).click();
          await page.waitForURL('**'+sibling.detail);
          await expect(page.locator('h1')).toHaveText(sibling.headline);
          await expect(page.locator('h1')).toBeFocused();
        } else await combo.press('Escape');
      }
      await page.getByRole('navigation',{name:'Brotkrümelnavigation'}).getByRole('link',{name:article.category,exact:true}).click();
      await page.waitForURL('**'+categoryPaths[article.category]);
    }
    if(width===393) {
      // Explicitly exercise the requested TypeScript → Figma → OpenTofu → TypeScript flow.
      await page.goto('http://127.0.0.1:5173/languages-frameworks/typescript');
      const combo=page.getByRole('combobox',{name:/Languages & Frameworks durchsuchen/});
      await combo.scrollIntoViewIfNeeded();await combo.click();
      const list=page.getByRole('listbox');
      for(const name of ['Figma','OpenTofu','TypeScript']) {
        await expect(list.getByRole('option',{name,exact:true})).not.toHaveAttribute('aria-disabled','true');
      }
      await expect(list.getByRole('group',{name:'Adopt',exact:true}).getByRole('option',{name:'Figma',exact:true})).toBeVisible();
      await expect(list.getByRole('group',{name:'Trial',exact:true}).getByRole('option',{name:'OpenTofu',exact:true})).toHaveCount(1);
      await list.getByRole('option',{name:'Figma',exact:true}).click();
      await page.waitForURL('**/languages-frameworks/figma');
      await expect(combo).toHaveText('Figma');await expect(combo).toHaveAttribute('aria-expanded','false');
      await expect(page.locator('h1')).toHaveText('Das Design Tool der Wahl');await expect(page.locator('h1')).toBeFocused();
      for(const id of ['opentofu','typescript']) {
        const article=technologyArticles.find(item=>item.id===id);
        await combo.scrollIntoViewIfNeeded();await combo.press('Enter');
        await combo.press(article.name[0]);await combo.press('Enter');
        await page.waitForURL('**'+article.detail);
        await expect(combo).toHaveText(article.name);await expect(combo).toHaveAttribute('aria-expanded','false');
        await expect(page.locator('h1')).toHaveText(article.headline);await expect(page.locator('h1')).toBeFocused();
      }
    }
    await page.goto('http://127.0.0.1:5173/');
    if(width!==393){
      await page.getByRole('radio',{name:'List',exact:true}).click();
      const typeAndTab=await page.evaluate(()=>({
        category:getComputedStyle(document.querySelector('.list-heading h3')).fontSize,
        ring:getComputedStyle(document.querySelector('.list-overview .ring-title')).fontSize,
        ringTag:document.querySelector('.list-overview .ring-title').tagName,
        activeBackground:getComputedStyle(document.querySelector('.category-tabs .active')).backgroundColor,
        activeColor:getComputedStyle(document.querySelector('.category-tabs .active')).color
      }));
      assert.equal(typeAndTab.category,width===1440?'34px':'30px');
      assert.equal(typeAndTab.ring,width===1440?'30px':'26px');
      assert.equal(typeAndTab.ringTag,'H4');
      assert.equal(typeAndTab.activeBackground,'rgb(29, 29, 29)');
      assert.equal(typeAndTab.activeColor,'rgb(255, 255, 255)');
      const keyword=page.getByLabel('Schlagwortsuche');
      const inputBefore=await keyword.boundingBox();await keyword.focus();
      const inputFocus=await keyword.evaluate(el=>({border:getComputedStyle(el).borderTopWidth,color:getComputedStyle(el).borderTopColor,outline:getComputedStyle(el).outlineStyle}));
      assert.equal(inputFocus.border,'3px');assert.equal(inputFocus.color,'rgb(0, 53, 238)');assert.equal(inputFocus.outline,'none');
      assert.deepEqual(await keyword.boundingBox(),inputBefore);
      const topicCombo=page.getByRole('combobox',{name:/^Thema /});
      const topicBefore=await topicCombo.boundingBox();await topicCombo.focus();
      const topicFocus=await topicCombo.evaluate(el=>({border:getComputedStyle(el).borderTopWidth,color:getComputedStyle(el).borderTopColor,outline:getComputedStyle(el).outlineStyle}));
      assert.deepEqual(topicFocus,inputFocus);assert.deepEqual(await topicCombo.boundingBox(),topicBefore);
      await keyword.fill('unsubmitted-draft');
      await topicCombo.press('Enter');await expect(topicCombo).toHaveAttribute('aria-expanded','true');
      const topicOptions=page.getByRole('listbox',{name:'Thema',exact:true});
      await expect(topicOptions.getByRole('option')).toHaveCount(10);
      await expect(topicOptions.getByRole('option',{name:'Alle',exact:true})).toHaveCSS('background-color','rgb(242, 242, 242)');
      await expect(topicOptions.getByRole('option',{name:'Alle',exact:true})).toHaveCSS('font-size','16px');
      await expect(topicOptions.getByRole('option',{name:'Backend',exact:true})).toHaveCSS('font-size','20px');
      const topicBox=await topicCombo.boundingBox(),menuBox=await topicOptions.boundingBox();
      assert(Math.abs(menuBox.width-254)<1);assert(Math.abs(menuBox.x+menuBox.width-topicBox.x-topicBox.width)<1);
      assert(menuBox.y>=12&&menuBox.y+menuBox.height<=await page.evaluate(()=>innerHeight)-11);
      await topicCombo.press('ArrowDown');await topicCombo.press('ArrowDown');
      assert.equal(new URL(page.url()).searchParams.has('topic'),false);
      await topicCombo.press('Escape');await expect(topicCombo).toHaveAttribute('aria-expanded','false');
      assert.equal(new URL(page.url()).searchParams.has('q'),false);
      await expect(keyword).toHaveValue('unsubmitted-draft');
      await topicCombo.press('Enter');await topicCombo.press('c');await topicCombo.press('Enter');
      await expect(topicCombo).toHaveText('Cloud');await expect(topicCombo).toBeFocused();
      assert.equal(new URL(page.url()).searchParams.get('topic'),'Cloud');
      assert.equal(new URL(page.url()).searchParams.has('q'),false);
      await expect(keyword).toHaveValue('unsubmitted-draft');
      await topicCombo.click();await topicOptions.getByRole('option',{name:'Alle',exact:true}).click();
      await topicCombo.click();await keyword.click();await expect(topicCombo).toHaveAttribute('aria-expanded','false');
      await topicCombo.press('End');await topicCombo.press('Tab');await expect(topicCombo).toHaveAttribute('aria-expanded','false');
      assert.equal(new URL(page.url()).searchParams.get('topic'),'Alle');
      await keyword.fill('React');await expect(page.locator('#search-status')).toBeEmpty();
      assert.equal(new URL(page.url()).searchParams.has('q'),false);
      await keyword.press('Enter');await expect(page.locator('#search-status')).toContainText('5 Ergebnisse');
      const hero=await page.locator('.hero').evaluate(el=>el.getBoundingClientRect().toJSON());
      await page.getByRole('radio',{name:'List',exact:true}).click();await expect(page.getByRole('radio',{name:'List',exact:true})).toBeChecked();await expect(page.locator('.list-overview')).toBeVisible();assert.deepEqual(await page.locator('.hero').evaluate(el=>el.getBoundingClientRect().toJSON()),hero);
      await page.screenshot({path:`verification/filtered-list-${width}.png`,fullPage:true});
      await page.getByRole('button',{name:/Alle 5/}).click();await expect(page.locator('.technology-card')).toHaveCount(5);
      await keyword.fill('zz-no-result');await expect(page.locator('#search-status')).toContainText('5 Ergebnisse');
      assert.equal(new URL(page.url()).searchParams.get('q'),'React');
      await keyword.press('Enter');await expect(page.getByText('Keine passenden Beispieleinträge gefunden.')).toBeVisible();
      await page.getByRole('button',{name:'Suchbegriff löschen'}).click();await page.getByRole('button',{name:/Techniques/}).click();await topicCombo.click();await topicOptions.getByRole('option',{name:'Cloud',exact:true}).click();await expect(page.locator('#search-status')).toContainText(`${technologies.filter(item=>item.topic==='Cloud').length} Ergebnisse`);
      await topicCombo.click();await topicOptions.getByRole('option',{name:'Alle',exact:true}).click();await page.getByRole('radio',{name:'Radar',exact:true}).click();await expect(page.locator('.radar-overview')).toBeVisible();
      await page.screenshot({path:`verification/home-restored-${width}.png`,fullPage:true});
      await expect(page.locator('.radar-logo')).toHaveCount(33);
      for(const logo of await page.locator('.radar-logo').all()) await expect(logo).toHaveAttribute('tabindex','-1');
      const categoryLinks=page.locator('.radar-overview .category-teaser .text-link');
      await categoryLinks.first().focus();
      for(const link of (await categoryLinks.all()).slice(1)) {
        await page.keyboard.press('Tab');await expect(link).toBeFocused();
      }
      await page.keyboard.press('Shift+Tab');await expect(categoryLinks.nth(2)).toBeFocused();
      await expect(page.locator('.radar-imported-base')).toHaveCount(25);
      const sprite=await page.request.get('http://127.0.0.1:5173/assets/current-techradar-logos.svg');
      assert(sprite.ok());assert((await sprite.text()).includes('id="typescript"'));
      for(const logo of currentRadarLogos) {
        const target=page.locator(`.radar-logo[data-logo="${logo.id}"]`);
        await expect(target.locator('use')).toHaveAttribute('href',`/assets/current-techradar-logos.svg#${logo.symbol}`);
        await target.focus();
        await expect(page.getByRole('tooltip')).toHaveText(logo.name);
        await expect(page.locator('.radar-logo[data-highlighted=true]')).toHaveCount(1+radarConnections[logo.id].length);
        await expect(target.locator('.radar-highlight')).toHaveCSS('opacity','1');
      }
      const radarUrl=page.url();
      for(const article of technologyArticles) {
        await page.getByRole('link',{name:`${article.name} im Radar`,exact:true}).click();
        await page.waitForURL('**'+article.detail);await expect(page.locator('h1')).toHaveText(article.headline);
        await page.goBack();await page.waitForURL(radarUrl);
      }
      const radarButton=page.getByRole('button',{name:'AWS im Radar'});await radarButton.focus();assert(await page.getByRole('tooltip').isVisible());await page.keyboard.press('Escape');await expect(page.getByRole('tooltip')).toHaveCount(0);
      await page.getByLabel('Schlagwortsuche').focus();await radarButton.hover();
      await expect(page.locator('.radar-logo[data-highlighted=true]')).toHaveCount(4);
      await expect(radarButton.locator('.radar-highlight')).toHaveCSS('opacity','1');
      await page.locator('.radar-native').screenshot({path:`verification/radar-aws-${width}.png`});
      await page.getByRole('button',{name:'Abstract im Radar',exact:true}).hover();
      assert.equal(await page.locator('.radar-native').getAttribute('data-active-logo'),'aws');
      await expect(page.locator('.radar-native')).toHaveAttribute('data-active-logo','abstract');
      await expect(page.locator('.radar-logo[data-highlighted=true]')).toHaveCount(5);
      await expect(page.locator('[data-logo=abstract] .radar-highlight')).toHaveCSS('opacity','1');
      await page.locator('.radar-native').screenshot({path:`verification/radar-abstract-${width}.png`});
      await page.getByRole('button',{name:'Ansible im Radar',exact:true}).focus();
      await expect(page.locator('.radar-logo[data-highlighted=true]')).toHaveCount(2);
    } else {
      assert.equal(await page.getByLabel('Schlagwortsuche').isVisible(),false);
      await page.goto('http://127.0.0.1:5173/techniques/devops');
      const combo=page.getByRole('combobox',{name:/Techniques durchsuchen/});
      await combo.scrollIntoViewIfNeeded();
      await expect(combo).toHaveText('DevOps');
      await expect(page.locator('.mobile-detail-select select')).toHaveCount(0);
      const select=await page.locator('#technique-select').boundingBox();
      const arrow=await page.locator('.detail-select-arrow img').boundingBox();
      assert(Math.abs(arrow.width-11.8407)<.1);assert(Math.abs(arrow.height-6.98106)<.1);
      assert(Math.abs(arrow.y+arrow.height/2-(select.y+select.height/2))<.5);
      assert(Math.abs(select.x+select.width-(arrow.x+arrow.width)-11)<.2);
      await combo.click();
      const list=page.getByRole('listbox',{name:'Techniques durchsuchen'});
      await expect(list).toBeVisible();
      await expect(list.getByRole('group')).toHaveCount(4);
      await expect(list.getByRole('option')).toHaveCount(18);
      await expect(list.locator('[role=option][aria-disabled=true]')).toHaveCount(17);
      await expect(list.getByRole('option',{selected:true})).toHaveText('DevOps');
      for(const [name,count] of [['Adopt',8],['Trial',7],['Assess',3],['Hold',0]]) {
        await expect(list.getByRole('group',{name,exact:true}).getByRole('option')).toHaveCount(count);
      }
      await expect(list.getByRole('group',{name:'Hold',exact:true})).toContainText('Aktuell keine Einträge vorhanden.');
      const panel=await list.boundingBox();
      assert(panel.y>=0&&panel.y+panel.height<=852,'custom popup fits the viewport');
      const check=await list.locator('.detail-select-check img').boundingBox();
      assert(Math.abs(check.width-14.3326)<.01&&Math.abs(check.height-11.2525)<.01);
      await page.screenshot({path:'verification/devops-dropdown-393.png',fullPage:true});
      await combo.press('End');
      const lastOption=await list.getByRole('option',{name:'RAG',exact:true}).getAttribute('id');
      await expect(combo).toHaveAttribute('aria-activedescendant',lastOption);
      await combo.press('Enter');
      await expect(combo).toHaveAttribute('aria-expanded','true');
      await expect(combo).toHaveText('DevOps');
      await combo.press('Home');await combo.press('d');
      const currentOption=await list.getByRole('option',{name:'DevOps',exact:true}).getAttribute('id');
      await expect(combo).toHaveAttribute('aria-activedescendant',currentOption);
      await combo.press('Enter');await expect(combo).toHaveAttribute('aria-expanded','false');
      await expect(combo).toBeFocused();
      await combo.click();await combo.press('Escape');await expect(list).toHaveCount(0);
      await combo.click();await page.mouse.click(2,100);await expect(list).toHaveCount(0);
    }
    await page.goto('http://127.0.0.1:5173');await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').innerText(),'Zum Inhalt springen');await page.keyboard.press('Enter');assert.equal(await page.locator(':focus').getAttribute('id'),'content');
    await context.close();
  }
  // Extra header-only checks for wide monitors and smaller mobile viewports.
  const layoutContext=await browser.newContext();
  const layoutPage=await layoutContext.newPage();
  for(const viewport of [{width:2560,height:1440},{width:1440,height:700},{width:900,height:600},{width:393,height:640},{width:320,height:568}]) {
    await layoutPage.setViewportSize(viewport);
    for(const [,path] of screens) {
      await layoutPage.goto('http://127.0.0.1:5173'+path);
      await layoutPage.evaluate(()=>document.fonts.ready);
      const brand=await layoutPage.locator('.brand').boundingBox();
      assert(Math.abs(brand.x+brand.width/2-viewport.width/2)<1);
      if(path==='/techradar') continue;
      if(viewport.width<768) {
        const region=await layoutPage.locator('.hero-art-region').boundingBox();
        const copy=await layoutPage.locator('.hero-copy').boundingBox();
        const nav=await layoutPage.locator('.brand-row').boundingBox();
        assert(region.y>=nav.y+nav.height);
        assert(region.y+region.height<=copy.y);
        const menu=await layoutPage.locator('.mobile-menu').boundingBox();
        assert(brand.x+brand.width<=menu.x);
      } else {
        const art=await layoutPage.locator('.hero-art-desktop').boundingBox();
        assert(art.x+art.width>=viewport.width-1);
      }
      if(path!=='/'&&path!=='/techradar') await checkHeaderArtwork(layoutPage,viewport.width);
    }
  }
  await layoutContext.close();
  assert.equal(errors.length,0,errors.join('\n'));
  await fs.writeFile('verification/browser-report.json',JSON.stringify({passed:true,widths:[1440,900,393],errors,rows},null,2));
  console.log(`PASS: all ${screens.length} routes at 1440/900/393; article/category navigation, content, search, views, filters, keyboard, quadrants and original assets.`);
} finally {await browser.close();}
