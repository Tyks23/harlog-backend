cd /server
node app.js

database:explorer otsing psql
enter enter enter enter
password: awesome99

\c harlogusers


harlogusers
    users
        user_id PK uuid
        name TEXT
        email TEXT
        password_hash TEXT
    
    group_instance
        group_id PK uuid
        group_name TEXT
        user_id FK(users) Int

    activity_instance
        activity_id uuid PK
        group_id uuid FK
        activity_name TEXT
        incognito bool
    
    participant
        part_id uuid PK
        activity_id uuid FK
        part_name TEXT
        part_email  TEXT
        answer Int Array

    

*example

Create Table activity_instance ( activity_id, activity_name TEXT, global_answer Integer, incognito Boolean)

alter table users add column user_id integer ;




ALTER TABLE users ALTER COLUMN user_id SET DATA TYPE UUID USING (uuid_generate_v4());


CREATE TABLE users (
    user_id uuid DEFAULT uuid_generate_v4 (),
    name TEXT,
    email TEXT,
    password_hash TEXT,
    PRIMARY KEY (user_id)
);

CREATE TABLE group_instance (
    group_id uuid DEFAULT uuid_generate_v4 (),
    user_id uuid,
    group_name TEXT,
    PRIMARY KEY (group_id),
    CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	  REFERENCES users(user_id)
);

CREATE TABLE activity_instance (
    activity_id uuid DEFAULT uuid_generate_v4 (),
    group_id uuid,
    activity_name TEXT,
    PRIMARY KEY (activity_id),
    CONSTRAINT fk_group
      FOREIGN KEY(group_id) 
	  REFERENCES group_instance(group_id)
);

CREATE TABLE participant (
    part_id uuid DEFAULT uuid_generate_v4 (),
    activity_id uuid,
    part_name TEXT,
    part_email TEXT,
    answer Int [],
    PRIMARY KEY (part_id),
    CONSTRAINT fk_act
      FOREIGN KEY(activity_id) 
	  REFERENCES activity_instance(activity_id)
);



alter table activity_instance rename column numbkey to roomkey;
alter table activity_instance add column numbkey TEXT;

ALTER TABLE activity_instance ALTER COLUMN roomkey SET DATA TYPE text;


delete rookmey from activity_instance where activity_instance.roomkey =

select participant.part_name from group_instance join activity_instance on group_instance.group_id=activity_instance.group_id join participant on activity_instance.activity_id=participant.activity_id where activity_instance.activity_id = 'fb908f86-2fd6-4973-a26d-45de15bcaec0';