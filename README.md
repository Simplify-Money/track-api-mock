# Track API — mock server

Take-home material for the Simplify Money **Frontend Engineer (React Native)** assignment.
Not accepting contributions — please don't open issues or pull requests.

This is a stand-in for the API behind the **Track** screen in the Simplify Money app.
It serves one user's real-shaped transaction history across three bank accounts.

## Run it

Node 18 or newer. No dependencies, nothing to install.

```bash
node server.js
# Track API mock on http://0.0.0.0:4010
```

To reach it from a phone or emulator:

- Android emulator: `http://10.0.2.2:4010`
- iOS simulator: `http://localhost:4010`
- A real phone on the same Wi-Fi: `http://<your computer's LAN IP>:4010`

`PORT` changes the port. `FIXTURES` points it at a different data directory —
we will use that.

## Endpoints

All responses are JSON. Amounts are in minor units of the transaction's currency.

### `GET /v1/accounts`

```json
{ "items": [ { "id": "acc_4821", "bank": "HDFC Bank", "type": "SAVINGS", "last4": "4821", "nickname": "HDFC Savings" } ] }
```

### `GET /v1/transactions?limit=50&cursor=<next_cursor>`

Newest first. `limit` is 1–100 (default 50). Keep calling with `next_cursor`
until it is `null`.

```json
{
  "items": [
    {
      "id": "txn_9B61C2E07D44A1F0B3C8",
      "account_id": "acc_4821",
      "occurred_at": "2026-10-09T13:42:00Z",
      "direction": "debit",
      "amount_minor": 34900,
      "currency": "INR",
      "merchant": "SWIGGY*BANGALORE",
      "category": "FOOD",
      "status": "POSTED",
      "updated_at": "2026-10-09T13:51:00Z"
    }
  ],
  "next_cursor": "eyJvIjo0OX0",
  "sync_token": "st_NDY3NQ"
}
```

### `GET /v1/transactions/changes?since=<sync_token>&cursor=<next_cursor>`

Everything that changed after the `sync_token` you were given: new
transactions, updated ones, and removed ones. Removed ones look like this:

```json
{ "id": "txn_781D17903087EAE3A6F3", "deleted": true, "updated_at": "2026-10-10T20:33:59Z" }
```

Page through it the same way. The last page carries the `sync_token` to use
next time.

### `GET /v1/summary/months`

Per-month totals, as computed by the backend.

## Checkpoint

`fixtures/checkpoint.json` gives the transaction count and the spend and income
for every month, for the user's state once everything has synced. No row-level
answers. Use it to check your own numbers.

## Files

| Path | What |
|---|---|
| `server.js` | The mock API |
| `fixtures/` | The data it serves, and `checkpoint.json` |
| `review/` | Task 3 of the assignment — a pull request waiting for your review |
