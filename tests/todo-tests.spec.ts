// Test Cases task
// The app we're testing is the example React todomvc app located here - https://todomvc.com/examples/react/dist/
// General Scenario:
// As a user of the React todomvc app, I want to be able to add, delete and mark todo items as complete

// Test case #1
// Given I am a user of todomvc (go to url, there is no login)
// When I create a new todo item (act)
// Then it appears last on my todo list (verify)

// Test case #2
// Given I have created a todo item (before test -> utils)
// When I edit a todo item (act)
// Then the todo item gets updated with the new changes (verify)

// Test case #3
// Given I have created a todo item (before test)
// When I delete a todo item using the red X (act)
// Then the todo item is removed from my todo list (verify)

// Test case #4
// Given I have created a todo item (before test)
// When I mark a todo item as completed (act)
// Then it is marked with a green check mark (verify)
// And it is crossed off my todo list with a Strikethrough (verify)

// Test case #5
// Given I have marked a todo item as complete (before test - utils)
// When I view the Active list (act)
// Then only Active (Not Completed) todo items are shown (verify)

// Test case #6
// Given I have marked a todo item as complete (before test - utils)
// When I click “Clear Completed” (act)
// Then the completed todo item is removed from my todo list (verify)
// And the todo item is moved to the Completed list (verify)

import { test, expect } from '@playwright/test';
import { clearCompletedTodos, createNewTodoItem, deleteTodoItem, filterActiveTodos, markTodoItemAsCompleted } from '../utils/todoUtils';
//import { checkNumberOfCompletedTodosInLocalStorage, checkNumberOfTodosInLocalStorage } from '../src/todo-app';

const APP_URL = 'https://todomvc.com/examples/react/dist/'; // can be stored in ENV variables 

test.describe('Run Todomvc app 6 tests', () => {

  const TODO_ITEMS = {
    first: 'First active todo',
    second: 'Second completed todo',
    updated: 'Updated todo item'
  };

  test.beforeEach(async ({ page }) => {
    // Navigate to the todomvc app before each test
    await page.goto(APP_URL);
    console.log('Successfully navigated to the TodoMVC app URL');
  });

  // Test case #1: Create new todo item
  test('Create a new todo item and check if it appears last in the list', async ({ page }) => {
    console.log('Starting test: Create a new todo item...');

    // ACT --- Using the util function to create-a-new-todo-item
    await createNewTodoItem(page, TODO_ITEMS['first'])

    // ASSERT --- Then it appears last on my todo list
    const lastTodoItem = await page.locator('.todo-list li').last();

    await expect(lastTodoItem).toHaveText(TODO_ITEMS['first']);
    console.log('Last To Do is: ' + TODO_ITEMS['first']);
  });

  // Test case #2: Edit a todo item
  test('Edit a todo item and ensure it gets updated', async ({ page }) => {
    console.log('Starting test: Edit a todo item...');

    // ACT --- Using the util function to create-a-new-todo-item
    await createNewTodoItem(page, TODO_ITEMS['first'])

    // ACT --- Edit todo item
    const todoItem = await page.locator('.todo-list li').first();
    await todoItem.dblclick();

    // ACT --- Update text to the new one
    const editInput = todoItem.locator('input[type="text"]');
    await editInput.fill(TODO_ITEMS['second']);
    await editInput.press('Enter');

    // ASSERT --- Then the todo item gets updated with the new changes
    await expect(todoItem).toHaveText(TODO_ITEMS['second']);
  });

  // Test case #3: Delete a todo item using the red X
  test('Delete a todo item using the red X and ensure it is removed from the list', async ({ page }) => {
    console.log('Starting test: Delete a todo item using the red X...');

    // ACT --- Using the util function to create-a-new-todo-item
    await createNewTodoItem(page, TODO_ITEMS['first'])
    const todoItem = page.locator('.todo-list li').first();
    await todoItem.hover();

    // ACT --- Deleting the todo item
    await deleteTodoItem(page, 0);

    // ASSERT --- Verifying the todo item is removed from the list
    await expect(todoItem).toHaveCount(0);
    console.log('Todo item successfully deleted');
  });

  // Test case #4: Mark a todo item as completed
  test('Mark a todo item as completed and verify it is crossed off', async ({ page }) => {
    console.log('Starting test: Mark a todo item as completed...');

    // ACT --- Using the util function to create-a-new-todo-item
    await createNewTodoItem(page, TODO_ITEMS['first']);

    //ACT --- Mark to do
    const todoItemLocator = page.locator('.todo-list li');
    const todoCheckbox = todoItemLocator.first().locator('input.toggle');
    await todoCheckbox.click();
    console.log('Marked the todo item as completed');

    //ASSERT --- Verify that item has the 'completed' class = strikethrough
    await expect(todoItemLocator.first()).toHaveClass(/completed/);

    //ASSERT --- Verify that the checkbox is checked
    await expect(todoCheckbox).toBeChecked();
  });

  // Test case #5: View only Active (Not Completed) todo items  
  test('View only Active todo items when the Active filter is selected', async ({ page }) => {
    console.log('Starting test: View only Active todo items...');

    // ACT --- Using the util function to create-a-new-todo-item * 2
    await createNewTodoItem(page, TODO_ITEMS['first']);
    await createNewTodoItem(page, TODO_ITEMS['second']);
    //await checkNumberOfTodosInLocalStorage(page, 2);
    const todoItemLocator = page.locator('.todo-list li');

    // ASSERT --- that 2 items been created
    await expect(todoItemLocator).toHaveCount(2);

    // ACT --- mark second item as a completed using util function
    await markTodoItemAsCompleted(page, 1);

    // ASSERT --- the second item has the 'completed' class
    await expect(todoItemLocator.nth(1)).toHaveClass(/completed/);

    // ACT --- Click the "Active" filter
    await filterActiveTodos(page);

    // ASSERT --- that only the active (not completed) todo item is shown
    const activeTodoItemLocator = page.locator('.todo-list li');
    await expect(activeTodoItemLocator).toHaveCount(1); // Only one active todo item should be visible
    await expect(activeTodoItemLocator.first()).toContainText(TODO_ITEMS['first']);
    console.log('Verified only the active todo item is displayed');
  });

  // Test case #6: Clear Completed todo items
  test('Clear completed todo items and verify they are removed', async ({ page }) => {
    console.log('Starting test: Clear completed todo items...');

    // ACT --- Using the util function to create-a-new-todo-item *2
    await createNewTodoItem(page, TODO_ITEMS['first']);
    await createNewTodoItem(page, TODO_ITEMS['second']);
    //await checkNumberOfTodosInLocalStorage(page, 2);

    // ACT --- Mark the second item as completed
    await markTodoItemAsCompleted(page, 1);

    // ACT --- Click on "Clear completed" button
    await clearCompletedTodos(page);

    //ASSERT --- That completed item has been removed from the list
    const todoItemLocator = page.locator('.todo-list li');
    await expect(todoItemLocator).toHaveCount(1);
    await expect(todoItemLocator.first()).toContainText(TODO_ITEMS['first']);

    //Taking a screenshot after that flow is completed
    await page.screenshot({ path: `screenshots/deleted-todo-${Date.now()}.png` });

  });
});

