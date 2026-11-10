package com.cycleaware.backend.repository;

import com.cycleaware.backend.entity.Destination;
import com.cycleaware.backend.enums.DestinationCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {

    @Query("SELECT d FROM Destination d WHERE " +
           "(:category IS NULL OR d.category = :category) AND " +
           "(:maxEntryFee IS NULL OR d.entryFee <= :maxEntryFee) AND " +
           "(:search IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(d.location) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Destination> findWithFilters(
        @Param("category") DestinationCategory category,
        @Param("maxEntryFee") Double maxEntryFee,
        @Param("search") String search,
        Pageable pageable
    );

    List<Destination> findAllByIdIn(List<Long> ids);
}
