package com.selab.labspace.service;

import com.selab.labspace.model.Lab;
import com.selab.labspace.model.User;
import com.selab.labspace.repository.LabRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LabService {

    private final LabRepository labRepository;

    public LabService(LabRepository labRepository) {
        this.labRepository = labRepository;
    }

    public List<Lab> getAllLabs() {
        return labRepository.findAll();
    }

    public Optional<Lab> getLabById(Long labId) {
        return labRepository.findById(labId);
    }

    public Lab createLab(Lab lab) {
        return labRepository.save(lab);
    }


    public Lab assignLabAdmin(Lab lab, User admin) {
        lab.setAdmin(admin);
        return labRepository.save(lab);
    }

    public Lab updateLab(Lab existingLab, Lab newDetails) {
        existingLab.setName(newDetails.getName());
        existingLab.setLocation(newDetails.getLocation());
        return labRepository.save(existingLab);
    }

    public void deleteLab(Long labId) {
        labRepository.deleteById(labId);
    }
}
