package com.example.TaskManagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Invitation")
public class Invitation {

    // 発行者
    @Column(nullable = false)
    private String userId;

    // 発行日
    @Column(nullable = false)
    private String issueDate;

    // 有効期限
    @Column(nullable = false)
    private String expirationDate;

    // 招待コード
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

    public String getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(String issueDate) {
        this.issueDate = issueDate;
    }

    public String getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(String expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getInvitationCode() {
        return invitationCode;
    }

    public void setInvitationCode(String invitationCode) {
        this.invitationCode = invitationCode;
    }
}