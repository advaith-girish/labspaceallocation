package com.selab.labspace.service;

import com.selab.labspace.model.SeatUnassignmentRequest;
import com.selab.labspace.repository.SeatUnassignmentRequestRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SeatUnassignmentRequestService {
    private final SeatUnassignmentRequestRepository requestRepository;

    public SeatUnassignmentRequestService(SeatUnassignmentRequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    public SeatUnassignmentRequest createRequest(SeatUnassignmentRequest request) {
        return requestRepository.save(request);
    }

    public List<SeatUnassignmentRequest> getPendingRequests() {
        return requestRepository.findByStatus("Pending");
    }

    public List<SeatUnassignmentRequest> getRequestsByLab(Long labId) {
        return requestRepository.findBySeatLabId(labId);
    }

    public Optional<SeatUnassignmentRequest> updateRequestStatus(Long requestId, String status) {
        Optional<SeatUnassignmentRequest> requestOpt = requestRepository.findById(requestId);
        if (requestOpt.isPresent()) {
            SeatUnassignmentRequest request = requestOpt.get();
            request.setStatus(status);
            return Optional.of(requestRepository.save(request));
        }
        return Optional.empty();
    }
}
