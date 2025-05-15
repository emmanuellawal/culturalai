import * as SQLite from 'expo-sqlite';
import { CulturalNorm } from '../types/culture';

const DB_NAME = 'culturalai.db';

class DatabaseService {
  private db: SQLite.WebSQLDatabase;

  constructor() {
    this.db = SQLite.openDatabase(DB_NAME);
    this.initDatabase();
  }

  private initDatabase(): void {
    this.db.transaction(tx => {
      // Create cultural norms table
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS cultural_norms (
          cluster_id INTEGER PRIMARY KEY,
          cultural_group TEXT NOT NULL,
          context TEXT,
          goal TEXT,
          relation TEXT,
          actor TEXT,
          actor_behavior TEXT,
          recipient TEXT,
          recipient_behavior TEXT,
          other_descriptions TEXT,
          topic TEXT,
          agreement REAL,
          num_support_bin TEXT,
          time_range TEXT
        );
        
        CREATE INDEX IF NOT EXISTS idx_cultural_group ON cultural_norms(cultural_group);
        CREATE INDEX IF NOT EXISTS idx_topic ON cultural_norms(topic);
      `);

      // Create user favorites table
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS user_favorites (
          cluster_id INTEGER PRIMARY KEY,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (cluster_id) REFERENCES cultural_norms(cluster_id)
        );
      `);

      // Create recently viewed table
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS recently_viewed (
          cluster_id INTEGER,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (cluster_id) REFERENCES cultural_norms(cluster_id)
        );
      `);
    });
  }

  // Import cultural norms from CSV data
  async importCulturalNorms(norms: CulturalNorm[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        norms.forEach(norm => {
          tx.executeSql(
            `INSERT OR REPLACE INTO cultural_norms (
              cluster_id, cultural_group, context, goal, relation,
              actor, actor_behavior, recipient, recipient_behavior,
              other_descriptions, topic, agreement, num_support_bin, time_range
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              norm.clusterId,
              norm.culturalGroup,
              norm.context,
              norm.goal,
              norm.relation,
              norm.actor,
              norm.actorBehavior,
              norm.recipient,
              norm.recipientBehavior,
              norm.otherDescriptions,
              norm.topic,
              norm.agreement,
              norm.numSupportBin,
              JSON.stringify(norm.timeRange)
            ]
          );
        });
      }, reject, resolve);
    });
  }

  // Query methods
  async getNormsByCulture(culturalGroup: string): Promise<CulturalNorm[]> {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM cultural_norms WHERE cultural_group = ?;',
          [culturalGroup],
          (_, { rows: { _array } }) => resolve(this.mapRowsToNorms(_array)),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  }

  async getNormsByTopic(topic: string): Promise<CulturalNorm[]> {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM cultural_norms WHERE topic = ?;',
          [topic],
          (_, { rows: { _array } }) => resolve(this.mapRowsToNorms(_array)),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  }

  async searchNorms(query: string): Promise<CulturalNorm[]> {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM cultural_norms 
           WHERE cultural_group LIKE ? 
           OR context LIKE ? 
           OR actor_behavior LIKE ?
           OR recipient_behavior LIKE ?;`,
          [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`],
          (_, { rows: { _array } }) => resolve(this.mapRowsToNorms(_array)),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  }

  // Helper method to map database rows to CulturalNorm objects
  private mapRowsToNorms(rows: any[]): CulturalNorm[] {
    return rows.map(row => ({
      clusterId: row.cluster_id,
      culturalGroup: row.cultural_group,
      context: row.context,
      goal: row.goal,
      relation: row.relation,
      actor: row.actor,
      actorBehavior: row.actor_behavior,
      recipient: row.recipient,
      recipientBehavior: row.recipient_behavior,
      otherDescriptions: row.other_descriptions,
      topic: row.topic,
      agreement: row.agreement,
      numSupportBin: row.num_support_bin,
      timeRange: JSON.parse(row.time_range)
    }));
  }
}

export const databaseService = new DatabaseService(); 