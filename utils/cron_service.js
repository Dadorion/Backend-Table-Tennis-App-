import cron from "node-cron";
import pool from "../database.js";
import logger from "./logger.js";

// Задача cron для удаления устаревших токенов каждый день в полночь
cron.schedule('0 0 * * *', async () => {
  try {
    // Удаление токенов, которые истекли
    const result = await pool.query('DELETE FROM token_blacklist WHERE expires_at < NOW()');
    
    
    logger.info(`Deleted ${result.rowCount} expired tokens.`);
  } catch (error) {
    
    logger.error('Error cleaning up expired tokens:', error.message);
  }
});
