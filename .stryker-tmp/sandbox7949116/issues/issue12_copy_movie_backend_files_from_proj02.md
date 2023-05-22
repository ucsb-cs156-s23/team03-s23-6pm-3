Bring over backend crud files for Movie from team02

Throughout this issue, `Movie` is whatever the second model (in addition to `Movie` was in team02. You may want to search and replace `Movie` with your class name and `movie` with your class name (lowercase) before adding this issue to your project.

# Acceptance Criteria:

-   [ ] The `@Entity` class called Movie.java has been copied from the team02 repo to the team03 repo and committed.
-   [ ] The `@Repository` class called `MovieRepository.java` has been copied from the team02 repo to the team03 repo and committed. (Note that the file should be `MovieRepository.java`; the team02 instrutions erronously called it `Movie.java`; if you called it `Movie.java` please update the name now)
-   [ ] The `@Repository` class called `MovieRepository.java` has been copied from the team02 repo to the team03 repo and committed. (Note that the file should be `MovieRepository.java`; the team02 instrutions erronously called it `Movie.java`; if you called it `Movie.java` please update the name now)
-   [ ] The controller file `MovieController.java` is copied from team02 to team03
-   [ ] The controller tests file `MovieControllerTests.java` is copied from team02 to team03

-   [ ] You can see the `movies` table when you do these steps: 1. Connect to postgres command line with
        `       dokku postgres:connect team03-qa-db
      ` 2. Enter `\dt` at the prompt. You should see
        `movies` listed in the table. 3. Use `\q` to quit

-   [ ] The backend POST,GET,PUT,DELETE endpoints for `Restauarant` all work properly in Swagger.
