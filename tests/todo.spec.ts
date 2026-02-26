import { test, expect } from '@playwright/test';

test('[smoke] Todo: add item and mark as completed', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/');

  const todoInput = page.locator('.new-todo');
  await todoInput.fill('Buy milk');
  await todoInput.press('Enter');

  const firstLabel = page.locator('.todo-list li label').first();
  await expect(firstLabel).toHaveText('Buy milk');

  // 체크박스 클릭(또는 check)
  const firstToggle = page.locator('.todo-list li .toggle').first();
  await firstToggle.check();

  // 완료 상태 확인 (li에 completed 클래스)
  await expect(page.locator('.todo-list li').first()).toHaveClass(/completed/);
});

// ✅ Negative test: 빈 입력은 추가되지 않는다
test('[negative] Todo: does not add item when input is empty', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/');

  const todoInput = page.locator('.new-todo');

  // 빈 값 그대로 Enter
  await todoInput.fill('');
  await todoInput.press('Enter');

  // 아이템이 없어야 함
  await expect(page.locator('.todo-list li')).toHaveCount(0);

  // 공백만 입력해도 추가되지 않아야 함(방어적으로)
  await todoInput.fill('   ');
  await todoInput.press('Enter');

  await expect(page.locator('.todo-list li')).toHaveCount(0);
});

test('[regression] Todo: filters and counter behave correctly', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/');

  const input = page.locator('.new-todo');

  // 1) 2개 추가
  await input.fill('Task A');
  await input.press('Enter');
  await input.fill('Task B');
  await input.press('Enter');

  // 2) 카운트: 2 items left
  await expect(page.locator('.todo-count')).toContainText('2');

  // 3) 첫 번째 완료 처리
  await page.locator('.todo-list li .toggle').first().check();

  // 4) Active 필터: 완료되지 않은 1개만 보여야 함
  await page.getByRole('link', { name: 'Active' }).click();
  await expect(page.locator('.todo-list li')).toHaveCount(1);
  await expect(page.locator('.todo-list li label').first()).toHaveText('Task B');

  // 5) Completed 필터: 완료된 1개만 보여야 함
  await page.getByRole('link', { name: 'Completed' }).click();
  await expect(page.locator('.todo-list li')).toHaveCount(1);
  await expect(page.locator('.todo-list li label').first()).toHaveText('Task A');

  // 6) All 필터: 다시 2개 모두
  await page.getByRole('link', { name: 'All' }).click();
  await expect(page.locator('.todo-list li')).toHaveCount(2);

  // 7) 카운트: 1 item left (Task B만 남음)
  await expect(page.locator('.todo-count')).toContainText('1');
});

test('[regression] Todo: can delete an item and clear completed', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/');

  const input = page.locator('.new-todo');

  // 1) 아이템 3개 추가
  for (const t of ['A', 'B', 'C']) {
    await input.fill(`Task ${t}`);
    await input.press('Enter');
  }
  await expect(page.locator('.todo-list li')).toHaveCount(3);
  await expect(page.locator('.todo-count')).toContainText('3');

  // 2) 첫 번째 아이템 완료 처리
  await page.locator('.todo-list li .toggle').nth(0).check();
  await expect(page.locator('.todo-count')).toContainText('2');

  // 3) Completed 필터에서 완료된 1개만 보이는지 확인
  await page.getByRole('link', { name: 'Completed' }).click();
  await expect(page.locator('.todo-list li')).toHaveCount(1);

  // 4) Clear completed 클릭 → 완료 항목 삭제되어야 함
  const clearCompleted = page.getByRole('button', { name: 'Clear completed' });
  await expect(clearCompleted).toBeVisible();
  await clearCompleted.click();

  // 5) All로 돌아가면 2개만 남아야 함
  await page.getByRole('link', { name: 'All' }).click();
  await expect(page.locator('.todo-list li')).toHaveCount(2);
  await expect(page.locator('.todo-count')).toContainText('2');

  // 6) 한 아이템 삭제(hover 후 destroy 버튼 클릭)
  // TodoMVC는 삭제 버튼(.destroy)이 hover해야 나타나는 경우가 많음
  const firstItem = page.locator('.todo-list li').first();
  await firstItem.hover();
  await firstItem.locator('.destroy').click();

  // 7) 1개만 남는지 확인
  await expect(page.locator('.todo-list li')).toHaveCount(1);
  await expect(page.locator('.todo-count')).toContainText('1');
});