import { expect, Page } from '@playwright/test';

export const TODO_URL = 'https://demo.playwright.dev/todomvc/';

export async function openApp(page: Page) {
  await page.goto(TODO_URL);
  await expect(page.locator('.new-todo')).toBeVisible();
}

export async function addTodo(page: Page, title: string) {
  const input = page.locator('.new-todo');
  await input.fill(title);
  await input.press('Enter');
}

export async function expectTodoCount(page: Page, count: number) {
  await expect(page.locator('.todo-list li')).toHaveCount(count);
}

export async function toggleTodo(page: Page, index = 0) {
  await page.locator('.todo-list li .toggle').nth(index).check();
}

export async function expectTodoLabel(page: Page, index: number, text: string) {
  await expect(page.locator('.todo-list li label').nth(index)).toHaveText(text);
}

export async function expectTodoCompleted(page: Page, index = 0) {
  await expect(page.locator('.todo-list li').nth(index)).toHaveClass(/completed/);
}

export async function expectItemsLeft(page: Page, count: number) {
  await expect(page.locator('.todo-count')).toContainText(String(count));
}

export async function setFilter(page: Page, name: 'All' | 'Active' | 'Completed') {
  await page.getByRole('link', { name }).click();
}

export async function clearCompleted(page: Page) {
  const btn = page.getByRole('button', { name: 'Clear completed' });
  await expect(btn).toBeVisible();
  await btn.click();
}

export async function deleteTodo(page: Page, index = 0) {
  const item = page.locator('.todo-list li').nth(index);
  await item.hover();
  await item.locator('.destroy').click();
}