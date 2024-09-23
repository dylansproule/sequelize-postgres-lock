START TRANSACTION;
SELECT "id", "orderId", "state" FROM "mockUpdates" AS "mockUpdates" WHERE "mockUpdates"."orderId" = 1 LIMIT 1 FOR UPDATE;
UPDATE "mockUpdates" SET "state"=$1 WHERE "orderId" = $2
COMMIT;