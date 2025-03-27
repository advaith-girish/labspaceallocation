package com.selab.labspace.service;

import com.selab.labspace.model.ServerUser;
import com.selab.labspace.repository.ServerUserRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

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

    public List<ServerUser> getAllServerUsers() {
        return serverUserRepository.findAll();
    }

    public List<ServerUser> getUsersByLabAdmin(Long adminId) {
        return serverUserRepository.findByLabAdmin(adminId);
    }
    public ServerUser addServerUser(ServerUser user) {
        return serverUserRepository.save(user);
    }
    public boolean deleteServerUserById(Long id) {
        Optional<ServerUser> user = serverUserRepository.findById(id);
        if (user.isPresent()) {
            serverUserRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean deleteServerUserByIp(String ipAddress) {
        Optional<ServerUser> user = serverUserRepository.findByIpAddress(ipAddress);
        if (user.isPresent()) {
            serverUserRepository.delete(user.get());
            return true;
        }
        return false;
    }
    public void addBulkServerUsers(List<ServerUser> serverUsers) {
        serverUserRepository.saveAll(serverUsers);
    }
    
    
}
