import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register a modern font
import Inter18Reg from '../../assets/Fonts/Inter/static/Inter_18pt-Regular.ttf';
import Inter18Bold from '../../assets/Fonts/Inter/static/Inter_18pt-Bold.ttf';
import Inter28Reg from '../../assets/Fonts/Inter/static/Inter_28pt-Regular.ttf';
import Inter28Bold from '../../assets/Fonts/Inter/static/Inter_28pt-Bold.ttf';

// Register the "Small/Body" font (for text, addresses, line items)
Font.register({
  family: 'Inter-Text',
  fonts: [
    { src: Inter18Reg, fontWeight: 'normal' },
    { src: Inter18Bold, fontWeight: 'bold' },
  ],
});

// Register the "Display" font (for big titles like "INVOICE")
Font.register({
  family: 'Inter-Display',
  fonts: [
    { src: Inter28Reg, fontWeight: 'normal' },
    { src: Inter28Bold, fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Inter-Text',
    backgroundColor: '#FFFFFF',
    color: '#1e293b',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#4F46E5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 60,
  },
  logoSection: {
    flexDirection: 'column',
  },
  logo: {
    fontFamily: 'Inter-Display',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: 'medium',
    marginBottom: 15,
  },
  senderAddress: {
    fontSize: 10,
    color: '#64748b',
    lineHeight: 1.5,
  },
  invoiceDetails: {
    textAlign: 'right',
  },
  invoiceTitle: {
    fontFamily: 'Inter-Display',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 15,
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginRight: 15,
  },
  metaValue: {
    fontSize: 11,
    color: '#0f172a',
    fontWeight: 'bold',
    width: 100,
    textAlign: 'right',
  },
  billingSection: {
    flexDirection: 'row',
    marginBottom: 60,
  },
  billingBox: {
    flex: 1,
  },
  boxTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 6,
    marginRight: 40,
  },
  billingName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  billingAddress: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 1.6,
    maxWidth: 220,
  },
  table: {
    marginTop: 20,
    marginBottom: 40,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderBottomWidth: 2,
    borderBottomColor: '#e2e8f0',
    padding: '12 8',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    padding: '16 8',
    alignItems: 'center',
  },
  colDesc: { flex: 4 },
  colType: { flex: 2, textAlign: 'center' },
  colQty: { flex: 1, textAlign: 'center' },
  colRate: { flex: 2, textAlign: 'right' },
  colAmt: { flex: 2, textAlign: 'right' },
  
  headerText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rowText: {
    fontSize: 11,
    color: '#1e293b',
  },
  descText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  summaryBox: {
    width: 280,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 2,
    borderTopColor: '#0f172a',
    marginTop: 10,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  footer: {
    marginTop: 80,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentInfo: {
    flexDirection: 'column',
  },
  footerSectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  footerText: {
    fontSize: 10,
    color: '#64748b',
    lineHeight: 1.5,
  },
  qrCodePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureBox: {
    textAlign: 'center',
    width: 180,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    height: 40,
    marginBottom: 8,
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    padding: '4 8',
    borderRadius: 4,
    backgroundColor: '#FEF2F2',
    color: '#DC2626',
    textAlign: 'center',
  },
  paidBadge: {
    backgroundColor: '#ECFDF5',
    color: '#059669',
  }
});

interface InvoiceData {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  amount: string;
  status: string;
  clientAddress: string;
  billName: string;
  type: string;
  note: string;
  method?: string;
  avatarColor?: string;
}

const parseCurrency = (val: string) => {
  const numeric = parseFloat(val.replace(/[^\d.-]/g, ''));
  const symbol = val.replace(/[\d.,\s-]/g, '');
  return { numeric, symbol };
};

const InvoicePage = ({ invoice, index, total }: { invoice: InvoiceData, index?: number, total?: number }) => {
  const { numeric, symbol } = parseCurrency(invoice.amount);
  const taxRate = 0.18; // 18% GST mock
  const subtotalNumericSize = numeric / (1 + taxRate);
  const taxNumericSize = numeric - subtotalNumericSize;

  const subtotal = `${symbol} ${subtotalNumericSize.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const tax = `${symbol} ${taxNumericSize.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.accentBar} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoSection}>
          <Text style={styles.logo}>PayPlatform</Text>
          <Text style={styles.tagline}>Digital Financial Gateway</Text>
          <View style={styles.senderAddress}>
            <Text>123 Tech Square, Suite 500</Text>
            <Text>Bengaluru, KA 560103, India</Text>
            <Text>support@payplatform.in</Text>
            <Text>GSTIN: 29AAAAA0000A1Z5</Text>
          </View>
        </View>
        <View style={styles.invoiceDetails}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <View style={styles.metaGrid}>
            <Text style={styles.metaLabel}>Invoice ID</Text>
            <Text style={styles.metaValue}>{invoice.id}</Text>
          </View>
          <View style={styles.metaGrid}>
            <Text style={styles.metaLabel}>Date Created</Text>
            <Text style={styles.metaValue}>{invoice.startDate}</Text>
          </View>
          <View style={styles.metaGrid}>
            <Text style={styles.metaLabel}>Due Date</Text>
            <Text style={styles.metaValue}>{invoice.endDate}</Text>
          </View>
          <View style={[styles.metaGrid, {marginTop: 8}]}>
            <Text style={styles.metaLabel}>Status</Text>
            <View style={{width: 100}}>
               <Text style={[styles.statusBadge, invoice.status === 'PAID' ? styles.paidBadge : {}]}>{invoice.status}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Billing & Info */}
      <View style={styles.billingSection}>
        <View style={styles.billingBox}>
          <Text style={styles.boxTitle}>Bill To</Text>
          <Text style={styles.billingName}>{invoice.name}</Text>
          <Text style={styles.billingAddress}>{invoice.clientAddress}</Text>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.billingBox}>
              <Text style={styles.boxTitle}>Payment Info</Text>
              <Text style={styles.rowText}>Method: <Text style={{fontWeight: 'bold'}}>{invoice.method || 'Credit Card'}</Text></Text>
              <Text style={[styles.rowText, {marginTop: 4}]}>Currency: <Text style={{fontWeight: 'bold'}}>{symbol || 'INR'}</Text></Text>
            </View>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <View style={styles.colDesc}><Text style={styles.headerText}>Description</Text></View>
          <View style={styles.colType}><Text style={styles.headerText}>Type</Text></View>
          <View style={styles.colQty}><Text style={styles.headerText}>Qty</Text></View>
          <View style={styles.colRate}><Text style={styles.headerText}>Rate</Text></View>
          <View style={styles.colAmt}><Text style={styles.headerText}>Amount</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.colDesc}>
            <Text style={styles.descText}>{invoice.billName}</Text>
            <Text style={{fontSize: 9, color: '#94a3b8', marginTop: 2}}>Transaction ID: {invoice.id}</Text>
          </View>
          <View style={styles.colType}><Text style={styles.rowText}>{invoice.type}</Text></View>
          <View style={styles.colQty}><Text style={styles.rowText}>1</Text></View>
          <View style={styles.colRate}><Text style={styles.rowText}>{subtotal}</Text></View>
          <View style={styles.colAmt}><Text style={[styles.rowText, {fontWeight: 'bold'}]}>{subtotal}</Text></View>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summarySection}>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.rowText}>{subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST (18%)</Text>
            <Text style={styles.rowText}>{tax}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>{invoice.amount}</Text>
          </View>
        </View>
      </View>

      {/* Note */}
      {invoice.note && (
        <View style={{ marginTop: 40 }}>
            <Text style={styles.boxTitle}>Notes</Text>
            <Text style={[styles.billingAddress, {maxWidth: '100%'}]}>{invoice.note}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.paymentInfo}>
          <Text style={styles.footerSectionTitle}>Bank Details</Text>
          <Text style={styles.footerText}>Bank: HDFC Bank | Acc: 50200012345678</Text>
          <Text style={styles.footerText}>IFSC: HDFC0000123 | Branch: MG Road</Text>
          <View style={styles.qrCodePlaceholder}>
            <Text style={{fontSize: 8, color: '#94a3b8'}}>Scan to Pay</Text>
          </View>
        </View>
        <View style={styles.signatureBox}>
          <View style={styles.signatureLine} />
          <Text style={styles.footerSectionTitle}>Authorized Signatory</Text>
          {index !== undefined && total !== undefined && (
            <Text style={[styles.footerText, {marginTop: 10}]}>Page {index + 1} of {total}</Text>
          )}
        </View>
      </View>
    </Page>
  );
};

export const SingleInvoiceDoc = ({ invoice }: { invoice: InvoiceData }) => (
  <Document title={`Invoice-${invoice.id}`}>
    <InvoicePage invoice={invoice} />
  </Document>
);

export const BulkInvoiceDoc = ({ invoices }: { invoices: InvoiceData[] }) => (
  <Document title="Invoices-Export">
    {invoices.map((invoice, index) => (
      <InvoicePage key={invoice.id} invoice={invoice} index={index} total={invoices.length} />
    ))}
  </Document>
);
