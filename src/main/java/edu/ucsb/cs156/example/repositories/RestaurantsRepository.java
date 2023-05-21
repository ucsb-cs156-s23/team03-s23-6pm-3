package edu.ucsb.cs156.example.repositories;

import edu.ucsb.cs156.example.entities.Restaurants;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RestaurantsRepository extends CrudRepository<Restaurants, Long> {
  Iterable<Restaurants> findAllByName(String name);
}