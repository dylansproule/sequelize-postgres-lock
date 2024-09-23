import { QueryTypes } from "sequelize";
import database from "./src/db/database";
import { MockTable } from "./src/models/mockTable";

// True for simple SQL lock, false for Sequelize lock
const USE_SQL = true;

const ORDER_ID = "1";
const START_IDX = 1;
const END_IDX = 100000;

const debugEntry = async () => {
  const entry = await MockTable.findAll();
  console.log("ENTRY", entry);
};

const seedMockTable = async () => {
  let entry = await MockTable.findOne({
    where: {
      orderId: ORDER_ID,
    },
  });
  await MockTable.create({
    orderId: ORDER_ID,
    state: 0,
  });
};

const testSequalizeLock = async () => {

  for (let i = START_IDX; i <= END_IDX; i++) {
    let txn = await database.transaction({ autocommit: false });
    txn.afterCommit(() => {
      console.log('Transaction committed');
    });
    try {
      let entry = await MockTable.findOne({
        where: {
          orderId: ORDER_ID,
        },
        lock: txn.LOCK.UPDATE,
        transaction: txn,
      });
      await MockTable.update({
        state: i,
      },
      {
        where: {
          orderId: ORDER_ID,
        },
        transaction: txn
      });
      txn.commit();
    } catch (error) {
      console.error("Error in transaction", error);
      await txn.rollback();
    }
  }
};

const testSqlLock = async () => {
  for (let i = START_IDX; i <= END_IDX; i++) {
    try {
      await database.query('START TRANSACTION;');
      await database.query('SELECT "id", "orderId", "state" FROM "mockUpdates" AS "mockUpdates" WHERE "mockUpdates"."orderId" = :orderId LIMIT 1 FOR UPDATE;', {
        replacements: {
          orderId: ORDER_ID
        },
        type: QueryTypes.SELECT,
      });
      await database.query('UPDATE "mockUpdates" SET "state"=:state WHERE "orderId" = :orderId;', {
        replacements: {
          orderId: ORDER_ID,
          state: i,
        },
        type: QueryTypes.UPDATE,
      });
      await database.query("COMMIT;");
    } catch (error) {
      await database.query("ROLLBACK;");
    }
  }
};

async function main() {
  try {
    // Set force to true to overwrite any existing tables - all data will be lost!
    //await database.sync({ force: true });
    //seedMockTable();
    if (USE_SQL) {
      testSqlLock();
    } else {
      testSequalizeLock();
    }
    await debugEntry();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

main();
