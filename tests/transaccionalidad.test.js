/**
 * tests/transaccionalidad.test.js
 *
 * Suite de tests ACID para procesarTransferencia y procesarDeposito.
 * Usa Node.js assert nativo + Sequelize (sin framework externo).
 *
 * Prerequisitos:
 *   - DB activa y accesible via DATABASE_URL en .env
 *   - Al menos 2 cuentas activas en accounts (distintas de account_id=1)
 *
 * Ejecucion:
 *   node tests/transaccionalidad.test.js
 */

require("dotenv").config();
const { strict: assert } = require("assert");
const sequelize = require("../src/config/db");
const { Account, Transaction } = require("../src/models");
const {
  procesarTransferencia,
  procesarDeposito,
} = require("../src/services/transaction.service");

// Utilidades de output
const OK = (m) => `\x1b[32m  OK  ${m}\x1b[0m`;
const FAIL = (m) => `\x1b[31m  FAIL ${m}\x1b[0m`;
const SEC = (m) => `\x1b[36m\n-- ${m} --\x1b[0m`;

let passed = 0;
let failed = 0;

async function test(nombre, fn) {
  try {
    await fn();
    console.log(OK(nombre));
    passed++;
  } catch (err) {
    console.log(FAIL(nombre));
    console.error(`     -> ${err.message}`);
    failed++;
  }
}

async function getSaldo(accountId) {
  const c = await Account.findByPk(accountId);
  return Number(c.current_balance);
}

async function countTx() {
  return Transaction.count();
}

async function runTests() {
  console.log(SEC("Suite ACID - Alke Wallet Transaccionalidad"));

  // Seleccionar 2 cuentas reales (excluye la cuenta sistema id=1)
  const cuentas = await Account.findAll({
    where: sequelize.literal("account_id != 1"),
    order: [["account_id", "ASC"]],
    limit: 2,
  });

  if (cuentas.length < 2) {
    throw new Error(
      "Se necesitan al menos 2 cuentas en la DB (distintas de id=1).",
    );
  }

  const cA = cuentas[0];
  const cB = cuentas[1];

  console.log(
    `\n  Cuenta A: id=${cA.account_id} user_id=${cA.user_id} cbu=${cA.cbu}`,
  );
  console.log(
    `  Cuenta B: id=${cB.account_id} user_id=${cB.user_id} cbu=${cB.cbu}\n`,
  );

  const MONTO_BASE = 10000;
  const MONTO = 1000;

  // Fijar saldos conocidos para que los tests sean deterministas
  await Account.update(
    { current_balance: MONTO_BASE },
    { where: { account_id: cA.account_id } },
  );
  await Account.update(
    { current_balance: MONTO_BASE },
    { where: { account_id: cB.account_id } },
  );

  // ── 1. Transferencia exitosa ─────────────────────────────────────────────
  console.log(SEC("1. Transferencia exitosa (Atomicidad + Consistencia)"));

  await test("Debita el monto de la cuenta origen", async () => {
    const antes = await getSaldo(cA.account_id);
    await procesarTransferencia(cA.user_id, cB.cbu, MONTO);
    assert.equal(await getSaldo(cA.account_id), antes - MONTO);
  });

  await test("Acredita el monto en la cuenta destino", async () => {
    const antes = await getSaldo(cB.account_id);
    await procesarTransferencia(cA.user_id, cB.cbu, MONTO);
    assert.equal(await getSaldo(cB.account_id), antes + MONTO);
  });

  await test("Inserta exactamente 1 fila en transactions por operacion", async () => {
    const antes = await countTx();
    await procesarTransferencia(cA.user_id, cB.cbu, MONTO);
    assert.equal(await countTx(), antes + 1);
  });

  // ── 2. Rollback: saldo insuficiente ─────────────────────────────────────
  console.log(SEC("2. Rollback - Saldo insuficiente"));

  await test("Lanza error de saldo insuficiente", async () => {
    await assert.rejects(
      () => procesarTransferencia(cA.user_id, cB.cbu, 9_999_999),
      /Saldo insuficiente/,
    );
  });

  await test("NO modifica el saldo origen tras el fallo", async () => {
    const antes = await getSaldo(cA.account_id);
    await procesarTransferencia(cA.user_id, cB.cbu, 9_999_999).catch(() => {});
    assert.equal(await getSaldo(cA.account_id), antes);
  });

  await test("NO inserta filas en transactions tras el fallo", async () => {
    const antes = await countTx();
    await procesarTransferencia(cA.user_id, cB.cbu, 9_999_999).catch(() => {});
    assert.equal(await countTx(), antes);
  });

  // ── 3. Rollback: CBU destino inexistente ────────────────────────────────
  console.log(SEC("3. Rollback - CBU destino no registrado"));

  await test("Lanza error por CBU inexistente", async () => {
    await assert.rejects(
      () => procesarTransferencia(cA.user_id, "CBU_FALSO_99999", 100),
      /CBU del destinatario/,
    );
  });

  await test("NO modifica saldo ni inserta transaccion si el CBU no existe", async () => {
    const sAntes = await getSaldo(cA.account_id);
    const txAntes = await countTx();
    await procesarTransferencia(cA.user_id, "CBU_FALSO_99999", 100).catch(
      () => {},
    );
    assert.equal(
      await getSaldo(cA.account_id),
      sAntes,
      "Saldo no debe cambiar",
    );
    assert.equal(await countTx(), txAntes, "Transactions no debe cambiar");
  });

  // ── 4. Deposito exitoso ──────────────────────────────────────────────────
  console.log(SEC("4. Deposito exitoso"));

  await test("Acredita el monto en la cuenta del usuario", async () => {
    const antes = await getSaldo(cA.account_id);
    await procesarDeposito(cA.user_id, 5000);
    assert.equal(await getSaldo(cA.account_id), antes + 5000);
  });

  await test("Registra la tx con sender_account_id=1 (cuenta sistema)", async () => {
    await procesarDeposito(cA.user_id, 5000);
    const ultima = await Transaction.findOne({
      order: [["transaction_id", "DESC"]],
    });
    assert.equal(ultima.sender_account_id, 1);
  });

  // ── 5. Rollback deposito: usuario inexistente ────────────────────────────
  console.log(SEC("5. Rollback - Deposito a usuario inexistente"));

  await test("Lanza error si user_id no tiene cuenta", async () => {
    await assert.rejects(
      () => procesarDeposito(999999, 1000),
      /No se encontro la cuenta/,
    );
  });

  await test("NO inserta filas en transactions si el deposito falla", async () => {
    const antes = await countTx();
    await procesarDeposito(999999, 1000).catch(() => {});
    assert.equal(await countTx(), antes);
  });

  // ── Resumen ──────────────────────────────────────────────────────────────
  console.log("\n" + "-".repeat(45));
  console.log(`  Tests ejecutados : ${passed + failed}`);
  console.log(`\x1b[32m  Pasados          : ${passed}\x1b[0m`);
  if (failed > 0) {
    console.log(`\x1b[31m  Fallados         : ${failed}\x1b[0m`);
  } else {
    console.log(`  Fallados         : ${failed}`);
  }
  console.log("-".repeat(45) + "\n");

  if (failed > 0) process.exitCode = 1;
}

runTests()
  .catch((err) => {
    console.error(
      "\x1b[31mError fatal en la suite de tests:\x1b[0m",
      err.message,
    );
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
