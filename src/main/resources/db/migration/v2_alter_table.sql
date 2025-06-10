-- 既存のVARCHAR列をDATE型に変換
-- Invitation
ALTER TABLE Invitation
ALTER COLUMN issue_date TYPE DATE USING issue_date::DATE;

ALTER TABLE Invitation
ALTER COLUMN expiration_date TYPE DATE USING expiration_date::DATE;

-- TaskItem
ALTER TABLE task_item
ALTER COLUMN time TYPE TIME USING time::TIME;
