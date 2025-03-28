import sqlite from "sqlite3"


export const db = new sqlite.Database('./database.sqlite', (err: any) => {
    if (err) {
      console.error('Ошибка подключения к базе данных:', err.message);
    } else {
      console.log('Подключение к базе SQLite успешно установлено.');
    }
  
});

export function InitTable(){
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS Document (
        id                  TEXT PRIMARY KEY,
        userId              TEXT NOT NULL,
        title               TEXT NOT NULL,
        isArchived          INTEGER NOT NULL DEFAULT 0,
        parentDocumentId    TEXT,
        content             TEXT,
        coverImage          TEXT,
        icon                TEXT,
        isPublished         INTEGER NOT NULL DEFAULT 0,
        creationTime        TEXT,
        FOREIGN KEY         (userId) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY         (parentDocumentId) REFERENCES Document(id)
      );
      CREATE INDEX idx_document_userId ON Document(userId);
      CREATE INDEX idx_document_userId_parentDocumentId ON Document(userId, parentDocumentId);
    `);
    console.log('Таблица успешно создана или уже существует.');
  } catch {
    console.error('Ошибка при создании таблицы:');
  }

}