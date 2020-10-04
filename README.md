# Vevericka Auth Service
* * *
## Scripts
* `npm run start`
* `npm run dev`
* * *
## API
* POST /auth/register  
    * Request body:  
        * email
        * username
        * name
        * password
    * Response:
        * Saved user
* POST /auth/login
    * Request body:
        * email
        * password
    * Response:
        * JWT in response header `auth-token`.
* GET /posts
    * Request headers:
        * auth-token
    * Response:
        * Posts

