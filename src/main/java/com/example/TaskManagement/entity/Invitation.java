package com.example.TaskManagement.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Invitation")
public class Invitation {

    // 発行者
    @Column(nullable = false)
    private String userId;

    // 発行日
    @Column(nullable = false)
    private LocalDate issueDate;

    // 有効期限
    @Column(nullable = false)
    private LocalDate expirationDate;

    // 招待コード
    @Id
    @Column(nullable = false)
    private String invitationCode;

    public Invitation() { // JPA用の無引数コンストラクタ
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getInvitationCode() {
        return invitationCode;
    }

    public void setInvitationCode(String invitationCode) {
        this.invitationCode = invitationCode;
    }

}
