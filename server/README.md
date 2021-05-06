cd /server
node app.js

database:explorer otsing psql
enter enter enter enter
password: awesome99

\c harlogusers


harlogusers
    users
        user_id PK
        name TEXT
        email TEXT
        password_hash TEXT
    
    group_instance
        group_id PK Int
        group_name TEXT
        user_id FK(users) Int

    

*example
Create Table Group_instance ( group_id SERIAL Primary Key, group_name TEXT);

Create Table activity_instance ( activity_id, activity_name TEXT, global_answer Integer, incognito Boolean)

alter table users add column user_id integer, add constraint fk_test foreign key (user_id) references users (user_id);