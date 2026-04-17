Endpoints

1. Membuat user : http://localhost:5000/api/users
Butuh memakai post dan input json dengan parameter berikut :
```
{
  "email" : "EMAIL",
  "full_name" : "FULLNAME",
  "password" : "password",
  "confirm_password" : "confirm_password"
}

```
2. Gacha : http://localhost:5000/api/users/gacha
Butuh memakai post dan input json dengan parameter berikut : 
```
{
  "id" : "ID"
}

```

3. melihat semua history gacha yang tercatet di db : http://localhost:5000/api/users/history
Butuh menggunakan get

4.  melihat history gacha dari suatu user : http://localhost:5000/api/users/:id/history
butuh menggunakan get serta menaruh id dari user di :id
cth :
```
http://localhost:5000/api/users/69e104b4dca912ee64cf018a/history
```

5. melihat sisa prize yang bisa didapatkan : http://localhost:5000/api/users/prizes
menggunakan get

6. melihat semua user yang berasil mendapatkan hadiah : http://localhost:5000/api/users/history/winners
menggunakan get
