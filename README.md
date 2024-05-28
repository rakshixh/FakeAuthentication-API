<h1 align="center" id="title">Fake Authentication Api</h1>
<p align="center" id="description">Supercharge your frontend development with Fake Authentication API: Simple login/signup for your projects!</p>

<div align="center"> 

![GitHub watchers](https://img.shields.io/github/watchers/rakshixh/FakeAuthentication-API?label=Number%20of%20Watchers&style=flat&labelColor=purple&color=blue)
![GitHub forks](https://img.shields.io/github/forks/rakshixh/FakeAuthentication-API?label=Number%20of%20Forks&style=flat&labelColor=purple&color=blue)
![GitHub Repo stars](https://img.shields.io/github/stars/rakshixh/FakeAuthentication-API?style=flat&label=Number%20of%20Stars&labelColor=purple&color=blue)
![GitHub issues](https://img.shields.io/github/issues/rakshixh/FakeAuthentication-API?label=Number%20of%20Issues&labelColor=purple&color=blue)

</div>

![Fake Authentication Api Banner](https://github.com/rakshixh/FakeAuthentication-API/assets/83587918/269168d2-6d7e-437e-967c-5382a648c001)

<h2>👾 Motto</h2>
<p>Developing front-end applications without key features like login and signup isn't ideal. Nowadays, every web app needs these basics. But for beginners, making them work can be tough. Creating backend APIs for just the front end is not easy, and it takes a lot of time. So, I created this Fake Authentication API. These APIs will help beginners and those who want to test front-end apps. It makes implementing login and signup functionalities easier without dealing with complex backend stuff. With this, anyone can get started quickly and save time, making web development smoother for everyone, regardless of their experience level.</p>

<h2>📚 More Info </h2>

This project includes Swagger, a powerful tool for understanding each and every API. Swagger provides detailed documentation for every endpoint, making it easier to navigate and use the APIs effectively.

> [!NOTE]
> End point for Swagger Documentation `/api/api-docs`.<br>
> You can explore Swagger Documentation at [Fake Authentication API's Swagger Documentation](https://fakeauthentication-api.onrender.com/api/api-docs/).

<h2>👁️ Important Note </h2>

After creating `superadmin` account if it is inactive for `28 days` then superadmin account along with it's all associated data will be deleted.

<h2>⚙️ Local Setup</h2>

### Step 1
- Log in to your MongoDB Atlas account via [Mongo DB Atlas](https://account.mongodb.com/account/login)
- Create a new project in MongoDB Atlas.
- Create a cluster within the designated project. (You have the option to select either a free or a paid cluster)
- Within the `Collection` section of the cluster, create a database with the following collections.
- Give database name as `FakeAuthenticationDB` and collection name as `dynamicUsers`.
 ![Screenshot](https://github.com/rakshixh/FakeAuthentication-API/assets/83587918/d30e7957-b36d-482b-aad8-70b0e6e1c154)
- Clik on `Create` button.
- Now you will see a &#8853; at the top left beside the database name. Click on that icon to create more collections. <br>
 ![Screenshot](https://github.com/rakshixh/FakeAuthentication-API/assets/83587918/bba0179c-b792-41c8-b1dc-ea37a3fca4eb)
- When you click on that icon it will open a pop up modal where you can enter the collection name and click on `Create` button. Repeat this twice with other two collection names as following: `dynamicUsersData` and `staticUsers` <br>
 ![Screenshot](https://github.com/rakshixh/FakeAuthentication-API/assets/83587918/d7896be3-27cc-4f87-89f3-e53cdf6ddc6e)

### Step 2
- By clicking on the `Connect` button, Copy the Connecion String from the `overview` page. <br>
![Screenshot](https://github.com/rakshixh/FakeAuthentication-API/assets/83587918/40fd3c4d-04ef-4aae-9692-10d83058844a)
- Now clone this repo to your local system and open that in VS Code.
- Rename the `.env .txt` file into `.env`
- Paste the `connection String` that you copied earlier to MONGO_URI in `.env` file
- Now run these commands
```
npm install
npm start
```

<h2>🪄 Contribution Guidelines:</h2>

Check the [Contributing Guide](https://github.com/rakshixh/FakeAuthentication-API/blob/main/.github/CONTRIBUTING.md) out. <br>
Head over to [issue tracker](https://github.com/rakshixh/FakeAuthentication-API/issues) to check more about it. <br>
We expect all contributors to abide by the terms of our [Code of Conduct](https://github.com/rakshixh/FakeAuthentication-API/blob/main/.github/CODE_OF_CONDUCT.md).

<h2>🛡️ License</h2>

This repository is licensed under the MIT license.<br>
Illustrations by [StorySet](https://storyset.com/data) bring our [Fake Authentication API Website](https://fakeauthentication-api.onrender.com/) to life!
