--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2 (Debian 14.2-1.pgdg110+1)
-- Dumped by pg_dump version 14.2 (Debian 14.2-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: attendance; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.attendance (
    user_id integer NOT NULL,
    datetime timestamp without time zone DEFAULT now(),
    event character varying
);


ALTER TABLE public.attendance OWNER TO "user";

--
-- Name: comments; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    user_id integer NOT NULL,
    task_id integer NOT NULL,
    datetime timestamp without time zone DEFAULT now(),
    contents character varying NOT NULL
);


ALTER TABLE public.comments OWNER TO "user";

--
-- Name: comment_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comment_id_seq OWNER TO "user";

--
-- Name: comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.comment_id_seq OWNED BY public.comments.id;


--
-- Name: employer; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.employer (
    boss_id integer NOT NULL,
    employee_id integer NOT NULL
);


ALTER TABLE public.employer OWNER TO "user";

--
-- Name: epics; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.epics (
    id integer NOT NULL,
    title character varying NOT NULL,
    description character varying,
    project_id integer NOT NULL
);


ALTER TABLE public.epics OWNER TO "user";

--
-- Name: epic_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.epic_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.epic_id_seq OWNER TO "user";

--
-- Name: epic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.epic_id_seq OWNED BY public.epics.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL
);


ALTER TABLE public.projects OWNER TO "user";

--
-- Name: project_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.project_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.project_id_seq OWNER TO "user";

--
-- Name: project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.project_id_seq OWNED BY public.projects.id;


--
-- Name: stories; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.stories (
    id integer NOT NULL,
    title character varying NOT NULL,
    description character varying,
    epic_id integer NOT NULL
);


ALTER TABLE public.stories OWNER TO "user";

--
-- Name: story_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.story_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.story_id_seq OWNER TO "user";

--
-- Name: story_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.story_id_seq OWNED BY public.stories.id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    title character varying NOT NULL,
    description character varying,
    user_id integer NOT NULL,
    points integer DEFAULT 0,
    start_date timestamp without time zone DEFAULT now(),
    end_date timestamp without time zone,
    completed boolean DEFAULT false,
    stage character varying NOT NULL,
    story_id integer NOT NULL,
    score integer DEFAULT 0
);


ALTER TABLE public.tasks OWNER TO "user";

--
-- Name: task_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.task_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.task_id_seq OWNER TO "user";

--
-- Name: task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.task_id_seq OWNED BY public.tasks.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying,
    last_name character varying,
    email character varying,
    is_admin boolean,
    password character varying,
    salt character varying
);


ALTER TABLE public.users OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comment_id_seq'::regclass);


--
-- Name: epics id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.epics ALTER COLUMN id SET DEFAULT nextval('public.epic_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.project_id_seq'::regclass);


--
-- Name: stories id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.stories ALTER COLUMN id SET DEFAULT nextval('public.story_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.task_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.attendance (user_id, datetime, event) FROM stdin;
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.comments (id, user_id, task_id, datetime, contents) FROM stdin;
\.


--
-- Data for Name: employer; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.employer (boss_id, employee_id) FROM stdin;
\.


--
-- Data for Name: epics; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.epics (id, title, description, project_id) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.projects (id, user_id, title, description) FROM stdin;
1	6	App para trackear animalitos perdidos	Una aplicacion que registrara fotos y ubicaciones de animales que podrian estar perdidos, para que cualquiera pueda verlos publicamente
2	6	Proyecto dummy	Proyecto dummy
\.


--
-- Data for Name: stories; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.stories (id, title, description, epic_id) FROM stdin;
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.tasks (id, title, description, user_id, points, start_date, end_date, completed, stage, story_id, score) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.users (id, first_name, last_name, email, is_admin, password, salt) FROM stdin;
1	Arnol	Castillo	arnol.castillo@utec.edu.pe	t	passwordhasheada	salt
2	Jose	de Lama	jose.delama@utec.edu.pe	f	a	b
3	Mauricio	Bernuy	mauricio.bernuy@utec.edu.pe	f	contrase;a	hasheadaysalteada
4	Ignacio	Rubio	ignacio.rubio@utec.edu.pe	f	la mejor	contrase;a
5	Claudia	Noche	claudia.noche@utec.edu.pe	f	si	si
6	Esteban	Principe	esteban.principe@utec.edu.pe	f	contra	se;a
\.


--
-- Name: comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.comment_id_seq', 1, false);


--
-- Name: epic_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.epic_id_seq', 1, false);


--
-- Name: project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.project_id_seq', 2, true);


--
-- Name: story_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.story_id_seq', 1, false);


--
-- Name: task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.task_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: employer employer_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.employer
    ADD CONSTRAINT employer_pkey PRIMARY KEY (boss_id, employee_id);


--
-- Name: epics epics_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.epics
    ADD CONSTRAINT epics_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: stories stories_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: attendance attendance_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: comments comments_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id);


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: employer employer_boss_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.employer
    ADD CONSTRAINT employer_boss_id_fkey FOREIGN KEY (boss_id) REFERENCES public.users(id);


--
-- Name: employer employer_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.employer
    ADD CONSTRAINT employer_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.users(id);


--
-- Name: epics epics_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.epics
    ADD CONSTRAINT epics_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: stories stories_epic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_epic_id_fkey FOREIGN KEY (epic_id) REFERENCES public.epics(id);


--
-- Name: tasks tasks_story_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.stories(id);


--
-- Name: tasks tasks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

