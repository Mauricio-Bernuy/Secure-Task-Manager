import { Pool } from "pg";

let conn;

if(!conn){
  conn = new Pool({
    // user: "user",
    // password: "pass",
    // host: "database",
    // port: "5432",
    // database: "postgres"

    user: process.env.PGSQL_USER,
    password:  process.env.PGSQL_PASSWORD,
    host:  process.env.PGSQL_HOST,
    port:  process.env.PGSQL_PORT,
    database:  process.env.PGSQL_DATABASE
  })
}

export default conn
