// PR #412 — "Track: load transactions from the new API"
// Author: a teammate. Status: approved by one reviewer, waiting on you.

import { useEffect, useState } from 'react';

const API = 'http://10.0.2.2:4010';

export type Txn = {
  id: string;
  account_id: string;
  occurred_at: string;
  direction: 'debit' | 'credit';
  amount_minor: number;
  currency: string;
  merchant: string;
  category: string;
  status: string;
};

export function useTransactions() {
  const [transactions, setTransactions] = useState<Txn[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(reset = false) {
    setLoading(true);
    try {
      const q = !reset && cursor ? `?cursor=${cursor}` : '';
      const res = await fetch(`${API}/v1/transactions${q}`);
      const body = await res.json();
      setTransactions(reset ? body.items : [...transactions, ...body.items]);
      setCursor(body.next_cursor);
    } catch (e) {
      setError('Something went wrong');
      setTransactions([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load(true);
  }, []);

  const loadMore = () => {
    if (cursor) load();
  };

  const refresh = () => load(true);

  return { transactions, loading, error, loadMore, refresh };
}

export function groupByMonth(txns: Txn[]) {
  const groups: Record<string, Txn[]> = {};
  for (const t of txns) {
    const key = t.occurred_at.slice(0, 7);
    (groups[key] ||= []).push(t);
  }
  return groups;
}

export function monthTotal(txns: Txn[]) {
  return txns
    .filter((t) => t.direction === 'debit')
    .reduce((sum, t) => sum + t.amount_minor / 100, 0);
}
