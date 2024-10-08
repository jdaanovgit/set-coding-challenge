import { Page, expect } from '@playwright/test';

// Create a new todo item
export async function createNewTodoItem(page: Page, todoText: string) {
    await page.fill('.new-todo', todoText);
    await page.press('.new-todo', 'Enter');
}

// Mark a specific todo item as a completed by list index #
export async function markTodoItemAsCompleted(page: Page, index: number) {
    const todoItemLocator = page.locator('.todo-list li');
    const toggleCheckbox = todoItemLocator.nth(index).locator('input.toggle');

    // Click the checkbox to mark the todo item as completed
    await toggleCheckbox.click();

    // Verify that the item is marked as completed
    await expect(todoItemLocator.nth(index)).toHaveClass(/completed/);

    console.log(`Marked todo item at index ${index} as completed.`);
}
// Clear completed todos by click on a clear action button
export async function clearCompletedTodos(page: Page) {
    const clearCompletedButton = page.locator('button.clear-completed');
    await clearCompletedButton.click();
}
// Filter only active todos by clicking Active button
export async function filterActiveTodos(page: Page) {
    const activeFilter = page.locator('a[href="#/active"]');
    await activeFilter.click();
}

// Filter only completed todos by clicking Completed button
export async function filterCompletedTodos(page: Page) {
    const completedFilter = page.locator('a[href="#/completed"]');
    await completedFilter.click();
}

export async function deleteTodoItem(page: Page, index: number) {
    // Locate the todo item by index
    const todoItem = page.locator('.todo-list li').nth(index);
    
    // Hover over the todo item 
    await todoItem.hover();

    // Locate the delete button (red X) and click on
    const deleteButton = todoItem.locator('button.destroy');
    await deleteButton.hover();
    await deleteButton.click();

}