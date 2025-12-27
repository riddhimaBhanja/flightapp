package com.flightapp.auth.repository;

import com.flightapp.auth.entity.PasswordHistory;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface PasswordHistoryRepository extends ReactiveCrudRepository<PasswordHistory, Long> {

    /**
     * Find password history for a user, ordered by most recent first
     * Use take() operator to limit results in the service layer
     */
    @Query("SELECT * FROM password_history WHERE user_id = :userId ORDER BY changed_at DESC")
    Flux<PasswordHistory> findByUserIdOrderByChangedAtDesc(Long userId);

    /**
     * Count password history entries for a user
     */
    Mono<Long> countByUserId(Long userId);
}
