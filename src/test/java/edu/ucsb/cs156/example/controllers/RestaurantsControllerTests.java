package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.Restaurants;
import edu.ucsb.cs156.example.repositories.RestaurantsRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = RestaurantsController.class)
@Import(TestConfig.class)
public class RestaurantsControllerTests extends ControllerTestCase {

        @MockBean
        RestaurantsRepository restaurantsRepository;

        @MockBean
        UserRepository userRepository;

        // Authorization tests for /api/restaurants/admin/all

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/restaurants/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/restaurants/all"))
                                .andExpect(status().is(200)); // logged
        }

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/restaurants?id=7"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        // Authorization tests for /api/restaurants/post
        // (Perhaps should also have these for put and delete)

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/restaurants/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/restaurants/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        // // Tests with mocks for database actions

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
                Restaurants restaurants = Restaurants.builder()
                                .name("Name1")
                                .description("Description1")
                                .location("Location1")
                                .build();

                when(restaurantsRepository.findById(eq(7L))).thenReturn(Optional.of(restaurants));

                // act
                MvcResult response = mockMvc.perform(get("/api/restaurants?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(restaurantsRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(restaurants);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(restaurantsRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/restaurants?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(restaurantsRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("Restaurants with id 7 not found", json.get("message"));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_restaurants() throws Exception {

                // arrange
                Restaurants restaurants1 = Restaurants.builder()
                                .name("Name1")
                                .description("Description1")
                                .location("Location1")
                                .build();

                Restaurants restaurants2 = Restaurants.builder()
                                .name("Name2")
                                .description("Description2")
                                .location("Location2")
                                .build();

                ArrayList<Restaurants> expectedDates = new ArrayList<>();
                expectedDates.addAll(Arrays.asList(restaurants1, restaurants2));

                when(restaurantsRepository.findAll()).thenReturn(expectedDates);

                // act
                MvcResult response = mockMvc.perform(get("/api/restaurants/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(restaurantsRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedDates);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_restaurants() throws Exception {
                // arrange
                Restaurants restaurants1 = Restaurants.builder()
                                .name("Name1")
                                .description("Description1")
                                .location("Location1")
                                .build();

                when(restaurantsRepository.save(eq(restaurants1))).thenReturn(restaurants1);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/restaurants/post?name=Name1&description=Description1&location=Location1")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(restaurantsRepository, times(1)).save(restaurants1);
                String expectedJson = mapper.writeValueAsString(restaurants1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_date() throws Exception {
                // arrange
                Restaurants restaurants1 = Restaurants.builder()
                                .name("Name1")
                                .description("Description1")
                                .location("Location1")
                                .build();

                when(restaurantsRepository.findById(eq(15L))).thenReturn(Optional.of(restaurants1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/restaurants?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(restaurantsRepository, times(1)).findById(15L);
                verify(restaurantsRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("Restaurants with id 15 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_restaurants_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(restaurantsRepository.findById(eq(15L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/restaurants?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(restaurantsRepository, times(1)).findById(15L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("Restaurants with id 15 not found", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_restaurants() throws Exception {
                // arrange
                Restaurants restaurantsOrig = Restaurants.builder()
                                .name("Name1")
                                .description("Description1")
                                .location("Location1")
                                .build();

                Restaurants restaurantsEdited = Restaurants.builder()
                                .name("Name2")
                                .description("Description2")
                                .location("Location2")
                                .build();

                String requestBody = mapper.writeValueAsString(restaurantsEdited);

                when(restaurantsRepository.findById(eq(67L))).thenReturn(Optional.of(restaurantsOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/restaurants?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(restaurantsRepository, times(1)).findById(67L);
                verify(restaurantsRepository, times(1)).save(restaurantsEdited); // should be saved with correct user
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_restaurants_that_does_not_exist() throws Exception {
                // arrange

                Restaurants restaurantsEdited = Restaurants.builder()
                                .name("Name2")
                                .description("Description2")
                                .location("Location2")
                                .build();

                String requestBody = mapper.writeValueAsString(restaurantsEdited);

                when(restaurantsRepository.findById(eq(67L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/restaurants?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(restaurantsRepository, times(1)).findById(67L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("Restaurants with id 67 not found", json.get("message"));

        }
}
