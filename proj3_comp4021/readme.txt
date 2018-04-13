1.The project can run in Chrome, FireFox, Microsoft Edge.
2.Some bug may happen if refresh the website without logout, which randomly happens on random browsers and I dont know why. So please DON'T do it.
3.I write some code to handle users with the same username. The user's login request will be rejected if he uses a username that is being used by another user.
4.It will be rejected if the user upload a too big file.
5.Two different users can upload the file with the same name. It is handled in login.php to add username in front of the file name when the server store the file.
