-- v1_create&add_table.sql

-- TaskItem　カラム追加 
ALTER TABLE "TaskItem"
    ADD COLUMN title VARCHAR(255) NOT NULL,
    ADD COLUMN time VARCHAR(255) NOT NULL,
    ADD COLUMN priority VARCHAR(255) NOT NULL;


-- TaskItem　カラム名変更
 ALTER TABLE "TaskItem" RENAME COLUMN task TO detail;


-- invitation　新規テーブル作成
CREATE TABLE "Invitation" (
    userId VARCHAR(255) NOT NULL,          -- 発行者
    issueDate VARCHAR(255) NOT NULL,       -- 発行日
    expirationDate VARCHAR(255) NOT NULL,  -- 有効期限
    invitationCode VARCHAR(255) NOT NULL,   -- 招待コード
    PRIMARY KEY (invitationCode)
);