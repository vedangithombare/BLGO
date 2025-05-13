# BLGO - A Medium-Inspired Blog Platform
BLGO is a feature-rich blog platform inspired by Medium, designed to let users create, share, and engage with blog posts. Users can create accounts, upload their stories, and interact with others through reactions. The platform provides a seamless and responsive user experience with a modern UI.

# Watch it here !!

### Sign in, Login, Publish article functionality
[BLGO](https://drive.google.com/file/d/1rM8KfN3I1yqfYFY1VRbw9BkEmew5j2tT/view?usp=sharing)

### Edit and Delete article functionality
[BLGO](https://drive.google.com/file/d/1o0UC8Z26MbN-WXVD5D-wJx4PmdVSyEXm/view?usp=sharing)


## Tech Stack
### **Frontend:**
- ReactJS
- HTML, CSS
- TailwindCSS
- CKEditor

### **Backend:**
- Java Spring Boot
- PostgreSQL

---
# Blog Setup Guide
Welcome! This guide will help you set up the **Blog** project locally.

---

##  1. Unzip the Folder
Unzip the folder containing the `blog_frontend` and `blog_backend` directories.

---

##  2. Frontend Setup (React)

Navigate to the `blog_frontend` directory and run:

```bash
npm install
npm start
```

This will start the frontend server on [http://localhost:3000](http://localhost:3000).

---

##  3. Backend Setup (Spring Boot)

Navigate to the `blog_backend` directory.

---

###  Update `application.properties`

Edit the file:  
`src/main/resources/application.properties`

Update the following values:

```properties
# JWT Secret Key (Generate from: https://jwtsecret.com/generate)
spring.security.jwt.secret=your_jwt_secret_key

# PostgreSQL Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password
```

---

###  Run Backend Server

#### Using IntelliJ IDEA
1. Open IntelliJ.
2. Choose **File > Open** and select the `blog_backend` folder.
3. Wait for Maven dependencies to load (or click *Load Maven Project*).
4. Locate the `BlogBackendApplication.java` file.
5. Right-click it and choose **Run 'BlogBackendApplication'**.

####  Using Eclipse
1. Open Eclipse and go to **File > Import > Existing Maven Projects**.
2. Browse and select the `blog_backend` folder.
3. Ensure all projects are checked and click **Finish**.
4. Wait for Maven dependencies to resolve.
5. Right-click `BlogBackendApplication.java` → **Run As > Java Application**.

---

##  4. PostgreSQL Setup

Ensure PostgreSQL is installed and running.

If needed, create a new database:

```sql
CREATE DATABASE blog_db;
```
### Update the `spring.datasource.url` if you used a custom name.
---
##  5. Final Integration Check

-  Ensure both servers (frontend on localhost:3000 and backend on e.g., localhost:8080) are running.
