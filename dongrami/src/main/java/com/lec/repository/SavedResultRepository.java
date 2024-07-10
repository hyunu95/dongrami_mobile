package com.lec.repository;

import com.lec.entity.SavedResult;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavedResultRepository extends JpaRepository<SavedResult, Integer> {

      @Transactional
    void deleteByMemberUserId(String userId);
}
