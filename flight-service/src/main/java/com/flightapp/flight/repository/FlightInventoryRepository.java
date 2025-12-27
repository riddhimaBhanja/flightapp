package com.flightapp.flight.repository;

import com.flightapp.flight.entity.FlightInventory;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Repository
public interface FlightInventoryRepository extends R2dbcRepository<FlightInventory, Long> {

    @Query("SELECT * FROM flight_inventory WHERE UPPER(origin) = UPPER(:origin) AND UPPER(destination) = UPPER(:destination) AND departure_time BETWEEN :start AND :end")
    Flux<FlightInventory> findByOriginAndDestinationAndDepartureTimeBetween(
            String origin, String destination, LocalDateTime start, LocalDateTime end);

    Mono<FlightInventory> findByFlightNumber(String flightNumber);

    @Modifying
    @Query("UPDATE flight_inventory SET available_seats = available_seats - :seats WHERE id = :id AND available_seats >= :seats")
    Mono<Integer> reduceAvailableSeats(Long id, Integer seats);

    @Modifying
    @Query("UPDATE flight_inventory SET available_seats = available_seats + :seats WHERE id = :id")
    Mono<Integer> increaseAvailableSeats(Long id, Integer seats);
}
