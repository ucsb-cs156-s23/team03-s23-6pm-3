Bring over backend crud files for Song from team02

Throughout this issue, `Song` is whatever the second model (in addition to `Song` was in team02. You may want to search and replace `Song` with your class name and `song` with your class name (lowercase) before adding this issue to your project.

# Acceptance Criteria:

-   [ ] The `@Entity` class called Song.java has been copied from the team02 repo to the team03 repo and committed.
-   [ ] The `@Repository` class called `SongRepository.java` has been copied from the team02 repo to the team03 repo and committed. (Note that the file should be `SongRepository.java`; the team02 instrutions erronously called it `Song.java`; if you called it `Song.java` please update the name now)
-   [ ] The `@Repository` class called `SongRepository.java` has been copied from the team02 repo to the team03 repo and committed. (Note that the file should be `SongRepository.java`; the team02 instrutions erronously called it `Song.java`; if you called it `Song.java` please update the name now)
-   [ ] The controller file `SongController.java` is copied from team02 to team03
-   [ ] The controller tests file `SongControllerTests.java` is copied from team02 to team03

-   [ ] You can see the `songs` table when you do these steps: 1. Connect to postgres command line with
        `       dokku postgres:connect team03-qa-db
      ` 2. Enter `\dt` at the prompt. You should see
        `songs` listed in the table. 3. Use `\q` to quit

-   [ ] The backend POST,GET,PUT,DELETE endpoints for `Restauarant` all work properly in Swagger.
