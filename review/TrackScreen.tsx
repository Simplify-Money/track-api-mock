// PR #412 — "Track: load transactions from the new API"

import React from 'react';
import { FlatList, Text, View, RefreshControl, StyleSheet } from 'react-native';
import { useTransactions, groupByMonth, monthTotal, Txn } from './useTransactions';

const formatAmount = (minor: number) =>
  '₹' + (minor / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });

function Row({ t }: { t: Txn }) {
  return (
    <View style={styles.row}>
      <Text style={styles.merchant}>{t.merchant}</Text>
      <Text style={t.direction === 'debit' ? styles.debit : styles.credit}>
        {t.direction === 'debit' ? '-' : '+'}
        {formatAmount(t.amount_minor)}
      </Text>
    </View>
  );
}

export default function TrackScreen() {
  const { transactions, loading, error, loadMore, refresh } = useTransactions();
  const groups = groupByMonth(transactions);

  const data = Object.keys(groups).flatMap((month) => [
    { type: 'header', month, total: monthTotal(groups[month]) },
    ...groups[month].map((t) => ({ type: 'row', t })),
  ]);

  if (error) return <Text>{error}</Text>;

  return (
    <FlatList
      data={data}
      keyExtractor={(_, index) => String(index)}
      renderItem={({ item }: any) =>
        item.type === 'header' ? (
          <Text style={styles.header}>
            {new Date(item.month).toLocaleString('en-IN', { month: 'long', year: 'numeric' })} · Spent ₹
            {item.total.toFixed(2)}
          </Text>
        ) : (
          <Row t={item.t} />
        )
      }
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
    />
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  merchant: { fontSize: 15 },
  debit: { color: '#c62828' },
  credit: { color: '#2e7d32' },
  header: { fontWeight: '700', padding: 16, backgroundColor: '#f4f4f4' },
});
