//This Javascript file will be activated upon pressing the login button on the main login page
//(overview.html)
//It simply just grabs information from the main login page
//For now, if the login is not 'admin' and 'admin', then the login will not be successful.

const loginForm = document.getElementById("login-form");   //Grab the login form from index.html
const loginButton = document.getElementById("login-form-submit");   //Get the submit button
const loginErrorMsg = document.getElementById("login-error-msg");  //And the error message handler

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;         //Grab both the inputted username and password fields on the loginform
    const password = loginForm.password.value;

    if (username === "admin" && password === "admin") {         //For now, if they are both admin and admin, then there is a successful login
        alert("You have successfully logged in.");          //Will change this in the future so that login information will be stored via an SQL database
        window.location.replace("overview.html");            //And redirect to the main employee management system
    } else {
        loginErrorMsg.style.opacity = 1;                 //Otherwise, display the error message handler on screen
    }
})