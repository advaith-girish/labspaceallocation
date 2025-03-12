package com.selab.labspace.service;

import com.selab.labspace.model.Seat;
import com.selab.labspace.model.User;
import com.selab.labspace.repository.SeatRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeatService {

    private final SeatRepository seatRepository;

    public SeatService(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    public List<Seat> getSeatsByLabId(Long labId) {
        return seatRepository.findByLabId(labId);
    }

    public Optional<Seat> getSeatById(Long seatId) {
        return seatRepository.findById(seatId);
    }

    public Seat assignSeatToUser(Seat seat, User user) {
        seat.setAssignedUser(user);
        return seatRepository.save(seat);
    }

    public Seat unassignSeat(Seat seat) {
        seat.setAssignedUser(null);
        return seatRepository.save(seat);
    }
}
