import { test, expect } from '@playwright/test';
import { 
  openApp, 
  addTodo, 
  expectTodoCount, 
  toggleTodo, 
  expectTodoLabel, 
  expectTodoCompleted,
  expectItemsLeft,
  setFilter,
  clearCompleted,
  deleteTodo, 
  makeTitle
} from './utils/todo';

test('[smoke] Todo: add item and mark as completed', async ({ page }) => {
  await openApp(page);

  await addTodo(page, 'Buy milk');
  await expectTodoLabel(page, 0, 'Buy milk');

  await toggleTodo(page, 0);
  await expectTodoCompleted(page, 0);
});

// ✅ Negative test: 빈 입력은 추가되지 않는다
test('[negative] Todo: does not add item when input is empty', async ({ page }) => {
  await openApp(page);

  const todoInput = page.locator('.new-todo');

  // 빈 값 그대로 Enter
  await todoInput.fill('');
  await todoInput.press('Enter');
  await expectTodoCount(page, 0);

  // 공백만 입력해도 추가되지 않아야 함(방어적으로)
  await todoInput.fill('   ');
  await todoInput.press('Enter');
  await expectTodoCount(page, 0);
});

test('[negative][policy] Todo: allows duplicate titles (duplicates are treated as separate items)', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/');

  const todoInput = page.locator('.new-todo');

  // 동일 텍스트를 2번 입력
  const title = 'Duplicate Item';
  await todoInput.fill(title);
  await todoInput.press('Enter');
  await todoInput.fill(title);
  await todoInput.press('Enter');

  // 정책 확인: 중복이 "허용"된다면 2개가 생긴다
  await expect(page.locator('.todo-list li')).toHaveCount(2);

  // 두 개 모두 같은 라벨 텍스트를 가진다(정합성 강화)
  await expect(page.locator('.todo-list li label').nth(0)).toHaveText(title);
  await expect(page.locator('.todo-list li label').nth(1)).toHaveText(title);

  // 카운터도 2로 표시되는지(정책 일관성)
  await expect(page.locator('.todo-count')).toContainText('2');
});

test('[regression] Todo: filters and counter behave correctly', async ({ page }) => {
  const taskA = makeTitle('Task A');
  const taskB = makeTitle('Task B');

  await page.goto('https://demo.playwright.dev/todomvc/');

  const input = page.locator('.new-todo');

  // 1) 2개 추가
  await input.fill(taskA);
  await input.press('Enter');
  await input.fill(taskB);
  await input.press('Enter');

  // 2) 카운트: 2 items left
  await expect(page.locator('.todo-count')).toContainText('2');

  // 3) taskA 완료 처리(순서 의존 제거)
  await page.locator('.todo-list li', { hasText: taskA }).locator('.toggle').check();

  // 4) Active: taskB만 남아야 함
  await page.getByRole('link', { name: 'Active' }).click();
  await expect(page.locator('.todo-list li')).toHaveCount(1);
  await expect(page.locator('.todo-list li', { hasText: taskB })).toHaveCount(1);

  // 5) Completed: taskA만 보여야 함
  await page.getByRole('link', { name: 'Completed' }).click();
  await expect(page.locator('.todo-list li')).toHaveCount(1);
  await expect(page.locator('.todo-list li', { hasText: taskA })).toHaveCount(1);

  // 6) All 필터: 다시 2개 모두
  await page.getByRole('link', { name: 'All' }).click();
  await expect(page.locator('.todo-list li')).toHaveCount(2);

  // 7) 카운트: 1 item left (Task B만 남음)
  await expect(page.locator('.todo-count')).toContainText('1');
});

test('[regression] Todo: can delete an item and clear completed', async ({ page }) => {
  await openApp(page);

  // 1) 아이템 3개 추가
  await addTodo(page, 'Task A');
  await addTodo(page, 'Task B');
  await addTodo(page, 'Task C');

  await expectTodoCount(page, 3);
  await expectItemsLeft(page, 3);

  // 2) 첫 번째 아이템 완료 처리 → 남은 개수 2
  await toggleTodo(page, 0);
  await expectItemsLeft(page, 2);

  // 3) Completed 필터에서 완료된 1개만 보이는지
  await setFilter(page, 'Completed');
  await expectTodoCount(page, 1);

  // 4) Clear completed → 완료 항목 삭제
  await clearCompleted(page);

  // 5) All로 돌아가면 2개만 남아야 함
  await setFilter(page, 'All');
  await expectTodoCount(page, 2);
  await expectItemsLeft(page, 2);

  // 6) 한 아이템 삭제(hover 후 destroy)
  await deleteTodo(page, 0);

  // 7) 1개만 남는지
  await expectTodoCount(page, 1);
  await expectItemsLeft(page, 1);
});

test('[regression] Todo: persists items and completion after reload', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/');

  const persistA = makeTitle('Persist A');
  const persistB = makeTitle('Persist B');

  const input = page.locator('.new-todo');

  // 1) 2개 추가
  await input.fill(persistA);
  await input.press('Enter');
  await input.fill(persistB);
  await input.press('Enter');

  // task A를 완료로 만들기(순서 의존 제거)
  await page.locator('.todo-list li', { hasText: persistA }).locator('.toggle').check();

  // 3) 새로고침
  await page.reload();

  // 4) 새로고침 후에도 2개가 남아있어야 함
  await expect(page.locator('.todo-list li')).toHaveCount(2);

  // 5) 완료 상태가 유지되는지 확인 (첫 번째 li가 completed 클래스)
  await expect(page.locator('.todo-list li', { hasText: persistA })).toHaveClass(/completed/);
  
  // 6) 카운터가 1 item left 인지 확인 (1개만 미완료)
  await expect(page.locator('.todo-count')).toContainText('1');

  // 7) 필터도 정상 동작하는지 간단 확인
  await page.getByRole('link', { name: 'Active' }).click();
  await expect(page.locator('.todo-list li')).toHaveCount(1);
  await expect(page.locator('.todo-list li', { hasText: persistB })).toHaveCount(1);

  await page.getByRole('link', { name: 'Completed' }).click();
  await expect(page.locator('.todo-list li')).toHaveCount(1);
  await expect(page.locator('.todo-list li', { hasText: persistA })).toHaveCount(1);
});