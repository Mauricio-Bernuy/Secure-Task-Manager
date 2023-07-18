DROP DATABASE IF EXISTS postgres;    

CREATE DATABASE postgres;    


\c postgres; 


CREATE TABLE users (
	id int PRIMARY KEY NOT NULL,
	first_name varchar,
	last_name varchar,	
	email varchar UNIQUE,
	is_admin bool,
	password varchar
);

CREATE TABLE _2fa (
	email varchar,
	_2fa_code varchar,
	datetime timestamp DEFAULT now()
);

create sequence users_id_seq owned by users.id;
alter table users
   alter column id set default nextval('users_id_seq');
commit;

CREATE TABLE projects (
	id int PRIMARY KEY NOT NULL,
	-- user_id int NOT NULL,
	title varchar NOT NULL,
	description varchar NOT NULL
);

create sequence project_id_seq owned by projects.id;
alter table projects
   alter column id set default nextval('project_id_seq');
commit;

CREATE TABLE users_projects_table (
	user_id int NOT NULL REFERENCES users (id) ON UPDATE CASCADE, 
	project_id int NOT NULL REFERENCES projects (id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT user_projects_pkey PRIMARY KEY (user_id, project_id)  -- explicit pk
);

CREATE TABLE epics (
	id int PRIMARY KEY NOT NULL,
	title varchar NOT NULL,
	description varchar,
	project_id int NOT NULL,
	FOREIGN KEY (project_id) REFERENCES projects(id)
);

create sequence epic_id_seq owned by epics.id;
alter table epics
   alter column id set default nextval('epic_id_seq');
commit;

CREATE TABLE stories(
	id int PRIMARY KEY NOT NULL,
	title varchar NOT NULL,
	description varchar,
	epic_id int NOT NULL,
	FOREIGN KEY (epic_id) REFERENCES epics(id)
);
create sequence story_id_seq owned by stories.id;
alter table stories
   alter column id set default nextval('story_id_seq');
commit;

CREATE TABLE tasks (
	id int PRIMARY KEY NOT NULL,
	title varchar NOT NULL,
	description varchar,
	user_id int NOT NULL,
	points int DEFAULT 0, 
	start_date timestamp  DEFAULT now(),
	end_date timestamp DEFAULT null,
	completed bool DEFAULT FALSE,
	stage varchar NOT NULL,
	story_id int NOT NULL,
	score int DEFAULT 0,
	FOREIGN KEY (story_id) REFERENCES stories(id),
	FOREIGN KEY (user_id) REFERENCES users(id)
);
create sequence task_id_seq owned by tasks.id;
alter table tasks
   alter column id set default nextval('task_id_seq');
commit;

CREATE TABLE employer (
	boss_id int NOT NULL,
	employee_id int NOT NULL,
	PRIMARY KEY (boss_id, employee_id),
	FOREIGN KEY (boss_id) REFERENCES users(id),
	FOREIGN KEY (employee_id) REFERENCES users(id)
);

CREATE TABLE attendance (
	user_id int NOT NULL,
	datetime timestamp DEFAULT now(),
	event varchar,
	FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE comments (
	id int PRIMARY KEY NOT NULL,
	user_id int NOT NULL,
	task_id int NOT NULL,
	datetime timestamp DEFAULT now(),
	contents varchar NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (task_id) REFERENCES tasks(id)
);
create sequence comment_id_seq owned by comments.id;
alter table comments
   alter column id set default nextval('comment_id_seq');
commit;

--USERS DUMP
INSERT INTO users(
	first_name, 
	last_name, 
	email, 
	is_admin, 
	password
)
VALUES 
(
	'TASK',
	'ADMIN',
	'admin@utec.edu.pe',
	TRUE,
	'$2a$11$8JdHuebljWXcTYbxpwU5s.iyUlC7D9imwH7H/nZmddKD1rTxUunWm'-- 'passwordhasheada'
),
(	
	'Jose',
	'de Lama',
	'jose.delama@utec.edu.pe',
	FALSE,
	'$2a$11$PlZB3PQvL0vS/ycFtunt/.ZrL12GKo9XfX.ZMEUC19QzS8S217RjW'-- 'a'
),
(
	'Mauricio',
	'Bernuy',
	'mauricio.bernuy@utec.edu.pe',
	TRUE,
	'$2a$11$6ffGkutwxwACAM8XVyoYeOJLqr3YzS5h/fALsDfhqRUcU5.a7KFjW'-- 'contrase;a'
),
(
	'Ignacio',
	'Rubio',
	'ignacio.rubio@utec.edu.pe',
	FALSE, 
	'$2a$11$cZYgHfSCvmnhtqCW4/8xVul0.N0fuw/4AqHEjfHZWzi8gQ90OxvJO'-- 'la mejor'
),
(
	'Claudia',
	'Noche',
	'claudia.noche@utec.edu.pe',
	FALSE,
	'$2a$11$mCSvWye85afgZlgyXVWfZeNcEQwYM4IErAfxiWpMEEQbf6A72WIlK' -- 'si'
),
(
	'Esteban',
	'Principe',
	'esteban.principe@utec.edu.pe',
	FALSE,
	'$2a$11$nHnVBVg1mQZaweqgGuQnyuhA2/B0tA21GBFwGY8lujC9f0rtdn112'	-- 'contra'
);

-- --PROJECTS
-- INSERT INTO projects 
-- (
-- 	user_id,
-- 	title,
-- 	description
-- )
-- VALUES 
-- (
-- 	6,
-- 	'App para trackear animalitos perdidos' que?? xd,
-- 	'Una aplicacion que registrara fotos y ubicaciones de animales que podrian estar perdidos, para que cualquiera pueda verlos publicamente'
-- ),
-- (
-- 	6,
-- 	'Proyecto dummy',
-- 	'Proyecto dummy'
-- );
