package com.selab.labspace.service;

import com.selab.labspace.model.ServerUser;
import com.selab.labspace.repository.ServerUserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServerUserService {
    private final ServerUserRepository serverUserRepository;

    public ServerUserService(ServerUserRepository serverUserRepository) {
        this.serverUserRepository = serverUserRepository;
    }

    public List<ServerUser> getUsersByLabId(int labId) {
        return serverUserRepository.findByLabId(labId);
    }
}
