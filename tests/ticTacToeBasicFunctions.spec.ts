import { test, expect } from '@playwright/test';
import * as ticTacToeApp from '../fixtures/ticTacToeVercelApp.json'

test.describe('Tic Tac Toe Vercel App - Basic Functions', async ()=>{

  test.beforeEach('Navigate to main page', async ({page}) => {

    // Making sure our landing page was loaded successfully
    await page.goto(ticTacToeApp.gameUrl);
    await expect(page).toHaveURL(ticTacToeApp.gameUrl)

  })

  test('Clicking "Leaderboard" and asserting redirection', async ({ page }) => {

    // Clicking "Leaderboard" and making sure we're redirected
    await page.getByText('Leaderboard').click();
    await expect(page).toHaveURL(ticTacToeApp.leaderboardUrl)

  });

  test('Clicking "About" and asserting redirection', async ({ page }) => {
    
    // Clicking "About" and making sure we're redirected
    await page.getByText('About').click();
    await expect(page).toHaveURL(ticTacToeApp.aboutUrl)

  });

  test('Clicking "About" and asserting redirection, then clicking "Play" and asserting redirection', async ({ page }) => {
    
    // Clicking "About" to leave home page
    await page.getByText('About').click();
    await expect(page).toHaveURL(ticTacToeApp.aboutUrl)

    // Clicking "Play" and making sure we're redirected
    await page.locator('nav .jsx-2a2e5baca28c3daa').getByText('Play').click();
    await expect(page).toHaveURL(ticTacToeApp.gameUrl)

  });

  test('Playing a game and checking result', async ({ page }) => {
    // Storing order of buttons that would make X win the game
    const orderOfButtons = ['#cell-0','#cell-3','#cell-1','#cell-4','#cell-2']
    
    // Loop through buttons to simulate X winning the game
    for(const button of orderOfButtons){

      const buttonLocator =  page.locator(button)

      await buttonLocator.click();
      const text = await buttonLocator.textContent();
      expect(text === 'O' || text === 'X').toBe(true);

    }

    await expect(page.getByText('Winner: X')).toBeVisible();

  });

  test('Clicking buttons and checking if "Restart" button works as expected', async ({ page }) => {

    // Storing the location of all rows to parse through
    const rowsOfButtons = await page.locator('.board-row').all()
    
    // Clicking one cell to initialize the game
    await page.locator('#cell-0').click();
    await expect(page.getByText('Next player: O')).toBeVisible();

    // Looping through each button of each row and make sure none of them are clicked
    await page.getByRole('button', {name: 'Restart'}).click();
    for(const rowOfButtons of rowsOfButtons){
      let buttons = await rowOfButtons.getByRole('button').all();
      for(const button of buttons){
        const text = await button.textContent();
        expect(text === 'O' || text === 'X').toBe(false);
      }
    }

  })
})

test('Extra Exercise (Challenge)', async ({page}) => {
 
 // Navigating and ensuring page has loaded
 await page.goto(ticTacToeApp.leaderboardUrl);
 await expect(page).toHaveURL(ticTacToeApp.leaderboardUrl);
 await expect(page.getByText('Henri Leconte')).toBeVisible();

 // Sorting names alphabetically
 await page.getByText('Name').click();
 await page.getByText('Name').click();

 // Storing all rows' location in a constant
 const allRows = await page.locator('tbody tr').all();
 let listOfNames: string[] = [];
 
 for (const row of allRows) {
   const columns = await row.locator('td').all();
   let name = await columns[1].textContent();
   if (name !== null) {
     listOfNames.push(name);
   }
 }

 // Checking that each element in the array is ordered correctly
 for (let i = 0; i < listOfNames.length - 1; i++) {
   const currentName = listOfNames[i];
   const nextName = listOfNames[i + 1];
   
   const currentFirstLetter = currentName[0];
   const nextFirstLetter = nextName[0];

   if (currentFirstLetter === nextFirstLetter) {
     // Compare by second letter if the first letters are the same
     const currentSecondLetter = currentName[1];
     const nextSecondLetter = nextName[1];
     expect(currentSecondLetter < nextSecondLetter).toBe(true);
   } else {
     // Compare by first letter
     expect(currentFirstLetter < nextFirstLetter).toBe(true);
   }
 }
});