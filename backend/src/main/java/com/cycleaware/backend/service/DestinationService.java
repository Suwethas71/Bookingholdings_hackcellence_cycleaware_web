package com.cycleaware.backend.service;

import com.cycleaware.backend.dto.DestinationDTO;
import com.cycleaware.backend.dto.PagedResponseDTO;
import com.cycleaware.backend.entity.Destination;
import com.cycleaware.backend.enums.DestinationCategory;
import com.cycleaware.backend.repository.DestinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DestinationService {

    private final DestinationRepository destinationRepository;

    public PagedResponseDTO<DestinationDTO> getDestinations(
            String search,
            String category,
            Double maxEntryFee,
            String sortBy,
            int page,
            int size) {

        DestinationCategory cat = null;
        if (category != null && !category.equalsIgnoreCase("ALL") && !category.isBlank()) {
            try {
                cat = DestinationCategory.valueOf(category.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        Sort sort = switch (sortBy != null ? sortBy.toUpperCase() : "POPULARITY") {
            case "ENTRY_FEE_ASC" -> Sort.by("entryFee").ascending();
            case "ENTRY_FEE_DESC" -> Sort.by("entryFee").descending();
            case "DISTANCE" -> Sort.by("distanceFromCoimbatore").ascending();
            case "NAME" -> Sort.by("name").ascending();
            default -> Sort.by("popularityScore").descending();
        };

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Destination> results = destinationRepository.findWithFilters(cat, maxEntryFee, search, pageable);

        List<DestinationDTO> dtos = results.getContent().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return PagedResponseDTO.<DestinationDTO>builder()
                .content(dtos)
                .currentPage(results.getNumber())
                .totalPages(results.getTotalPages())
                .totalElements(results.getTotalElements())
                .pageSize(results.getSize())
                .hasNext(results.hasNext())
                .hasPrevious(results.hasPrevious())
                .build();
    }

    public List<DestinationDTO> getDestinationsByIds(List<Long> ids) {
        return destinationRepository.findAllByIdIn(ids).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private DestinationDTO toDTO(Destination d) {
        String categoryLabel = switch (d.getCategory()) {
            case MONUMENT -> "Monument";
            case RELIGIOUS -> "Religious";
            case NATURE -> "Nature";
            case BEACH -> "Beach";
            case HERITAGE -> "Heritage";
            case SCENIC -> "Scenic";
        };
        return DestinationDTO.builder()
                .id(d.getId())
                .name(d.getName())
                .description(d.getDescription())
                .category(d.getCategory())
                .categoryLabel(categoryLabel)
                .estimatedDuration(d.getEstimatedDuration())
                .entryFee(d.getEntryFee())
                .imageUrl(d.getImageUrl())
                .location(d.getLocation())
                .latitude(d.getLatitude())
                .longitude(d.getLongitude())
                .popularityScore(d.getPopularityScore())
                .distanceFromCoimbatore(d.getDistanceFromCoimbatore())
                .highlights(d.getHighlights())
                .isDataVerified(d.getIsDataVerified())
                .build();
    }
}
