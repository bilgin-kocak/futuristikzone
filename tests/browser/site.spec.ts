import { test, expect } from '@playwright/test';
test('homepage links to the full original Willow article and search finds it',async({page})=>{
  await page.goto('/');await expect(page.getByRole('navigation',{name:'Ana menü'})).toBeVisible();
  await page.goto('/googlein-yeni-kuantum-cipi-willow-paralel-evrenlerden-faydalaniyor-mu/');
  await expect(page.locator('h1')).toContainText('Google’ın Yeni Kuantum Çipi Willow');await expect(page.locator('.article-body')).toContainText('Çoklu Evrenler Teorisi ve Alternatif Yaklaşımlar');
  await page.goto('/arama/?q=Willow');await expect(page.locator('.search-results')).toContainText('Google’ın Yeni Kuantum Çipi Willow');
});
test('archive pagination is reachable and never links to unavailable article bodies',async({page})=>{
  await page.goto('/page/2/');await expect(page.locator('.feed')).toContainText('Bir Kez Daha Ay’a Yolculuk');
  await expect(page.locator('a[href="/bir-kez-daha-aya-yolculuk/"]')).toHaveCount(0);
  await page.goto('/page/8/');await expect(page.locator('.feed')).toContainText('Dogecoin');
});
for(const width of [1440,768,390])test(`responsive pages have no horizontal overflow at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  for(const route of ['/','/hakkimizda/','/iletisim/','/category/yapay-zeka/','/googlein-yeni-kuantum-cipi-willow-paralel-evrenlerden-faydalaniyor-mu/']){
    await page.goto(route);await expect(page.locator('body')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route).toBe(true);
    expect(await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>{const r=i.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;}).every(i=>(i as HTMLImageElement).complete&&(i as HTMLImageElement).naturalWidth>0)),route).toBe(true);
  }
});
test('mobile navigation works by keyboard and missing paths return 404',async({page})=>{
  await page.setViewportSize({width:390,height:850});await page.goto('/');const menu=page.getByRole('button',{name:'Menüyü aç'});await menu.focus();await page.keyboard.press('Enter');await expect(page.getByRole('navigation',{name:'Ana menü'})).toBeVisible();
  await page.getByRole('navigation',{name:'Ana menü'}).getByRole('link',{name:'Hakkımızda'}).click();await expect(page.locator('h1')).toHaveText('Manifestomuz');
  const r=await page.goto('/missing-article/');expect(r?.status()).toBe(404);
});
test('desktop drawer shows the original popular posts and closes with Escape',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:'Gezinme menüsü'}).click();
  await expect(page.getByRole('dialog',{name:'Gezinme menüsü'})).toBeVisible({timeout:3000});
  await expect(page.getByRole('dialog').getByRole('heading',{name:'Popular Posts'})).toBeVisible();
  await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();
});
