package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.Restaurants;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.RestaurantsRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@Api(description = "Restaurants")
@RequestMapping("/api/restaurants")
@RestController
public class RestaurantsController extends ApiController {

    @Autowired
    RestaurantsRepository restaurantsRepository;

    @ApiOperation(value = "List all restaurantss")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<Restaurants> allRestaurants() {
        Iterable<Restaurants> dates = restaurantsRepository.findAll();
        return dates;
    }

    @ApiOperation(value = "Get a single restaurants")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public Restaurants getById(
            @ApiParam("id") @RequestParam Long id) {
        Restaurants restaurants = restaurantsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Restaurants.class, id));

        return restaurants;
    }

    @ApiOperation(value = "Create a new restaurants")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public Restaurants postRestaurants(
            @ApiParam("name") @RequestParam String name,
            @ApiParam("description") @RequestParam String description,
            @ApiParam("location") @RequestParam String location
            )
            throws JsonProcessingException {

        Restaurants restaurants = new Restaurants();
        restaurants.setName(name);
        restaurants.setDescription(description);
        restaurants.setLocation(location);

        Restaurants savedRestaurants = restaurantsRepository.save(restaurants);

        return savedRestaurants;
    }

    @ApiOperation(value = "Delete a Restaurants")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteRestaurants(
            @ApiParam("id") @RequestParam Long id) {
        Restaurants restaurants = restaurantsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Restaurants.class, id));

        restaurantsRepository.delete(restaurants);
        return genericMessage("Restaurants with id %s deleted".formatted(id));
    }

    @ApiOperation(value = "Update a single restaurants")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public Restaurants updateRestaurants(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid Restaurants incoming) {

        Restaurants restaurants = restaurantsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Restaurants.class, id));

        restaurants.setName(incoming.getName());
        restaurants.setDescription(incoming.getDescription());
        restaurants.setLocation(incoming.getLocation());

        restaurantsRepository.save(restaurants);

        return restaurants;
    }
}
