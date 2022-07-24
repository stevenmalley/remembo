const url = "http://localhost:3000";

console.log(process.env);

describe('Rememo', () => {
    it('should login with valid credentials', async () => {
        await browser.url(url);

        await $('#loginButton').click();

        await $('#username').setValue('mary');
        await $('#password').setValue('mary0');
        await $('input[type="submit"]').click();

        await expect($('#usernameSpan')).toBeExisting();
        await expect($('#usernameSpan')).toHaveTextContaining('mary');
    });

    
    it('should create a list', async () => {
        await browser.url(url);

        await $('#createQuizButton').click();

        await $('#quizBuilderTitle').setValue('test quiz title');
        await $('#text0').setValue('test quiz item');
        await $('button[type="submit"]').click();
        
        await $('#rememoHeader').click();

        await expect($('#localOrPrivateLists')).toHaveTextContaining('test quiz title');
    });
});

