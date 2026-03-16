import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { flexDirection: 'column', backgroundColor: '#FFFFFF', padding: 30 },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  section: { margin: 10, padding: 10, flexGrow: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', borderBottom: '1px solid #EEEEEE', paddingBottom: 5, marginBottom: 5 },
  label: { fontSize: 12, color: '#555555' },
  value: { fontSize: 12, fontWeight: 'bold' },
  total: { fontSize: 16, fontWeight: 'bold', marginTop: 20, textAlign: 'right' },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', fontSize: 10, color: '#888888' }
});

interface InvoiceProps {
  transactionId: string;
  date: string;
  customerName: string;
  amount: number;
  method: string;
  status: string;
}

export const InvoicePDF = ({ invoice }: { invoice: InvoiceProps }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Receipt / Invoice</Text>
      
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Transaction ID:</Text>
          <Text style={styles.value}>{invoice.transactionId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{invoice.date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Customer:</Text>
          <Text style={styles.value}>{invoice.customerName || 'Walk-in'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Method:</Text>
          <Text style={styles.value}>{invoice.method}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{invoice.status.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.total}>Total Paid: INR {invoice.amount.toFixed(2)}</Text>
      
      <Text style={styles.footer}>Thank you for your business. This is an auto-generated receipt.</Text>
    </Page>
  </Document>
);
