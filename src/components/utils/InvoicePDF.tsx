import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register a modern font
Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCOjzkauwgkB4K0icoCrYdxb4VA.ttf',
  fontWeight: 'normal',
});

Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcC7jzkauwgkB4K0icmSlsWdu3cQSYJPRl291vR7nyptvXw.ttf',
  fontWeight: 'bold',
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 20,
  },
  logoSection: {
    flexDirection: 'column',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: 'normal',
  },
  invoiceInfo: {
    textAlign: 'right',
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  invoiceMetaText: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 4,
  },
  billingSection: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  billingBox: {
    flex: 1,
  },
  billingName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  billingAddress: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 1.5,
    maxWidth: 200,
  },
  table: {
    marginTop: 20,
    marginBottom: 40,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    padding: 10,
    alignItems: 'center',
  },
  colDescription: {
    flex: 3,
  },
  colQty: {
    flex: 1,
    textAlign: 'center',
  },
  colPrice: {
    flex: 1,
    textAlign: 'right',
  },
  headerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  rowText: {
    fontSize: 11,
    color: '#1F2937',
  },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  summaryBox: {
    width: 200,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    padding: '4 8',
    borderRadius: 4,
    backgroundColor: '#ECFDF5',
    color: '#059669',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  unpaidBadge: {
    backgroundColor: '#FEF2F2',
    color: '#DC2626',
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
  method?: string; // Optional if provided
}

export const SingleInvoiceDoc = ({ invoice }: { invoice: InvoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoSection}>
          <Text style={styles.logo}>PayPlatform</Text>
          <Text style={styles.companyName}>Enterprise Payment Gateway</Text>
        </View>
        <View style={styles.invoiceInfo}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <Text style={styles.invoiceMetaText}>Invoice ID: {invoice.id}</Text>
          <Text style={styles.invoiceMetaText}>Issue Date: {invoice.startDate}</Text>
          <Text style={styles.invoiceMetaText}>Due Date: {invoice.endDate}</Text>
        </View>
      </View>

      {/* Billing */}
      <View style={styles.billingSection}>
        <View style={styles.billingBox}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <Text style={styles.billingName}>{invoice.name}</Text>
          <Text style={styles.billingAddress}>{invoice.clientAddress}</Text>
        </View>
        <View style={styles.billingBox}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={[styles.statusBadge, invoice.status !== 'PAID' && styles.unpaidBadge]}>
            <Text>{invoice.status}</Text>
          </View>
          {invoice.method && (
             <Text style={[styles.invoiceMetaText, { marginTop: 10 }]}>Payment Method: {invoice.method}</Text>
          )}
        </View>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <View style={styles.colDescription}><Text style={styles.headerText}>Description</Text></View>
          <View style={styles.colQty}><Text style={styles.headerText}>Type</Text></View>
          <View style={styles.colPrice}><Text style={styles.headerText}>Amount</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.colDescription}><Text style={styles.rowText}>{invoice.billName}</Text></View>
          <View style={styles.colQty}><Text style={styles.rowText}>{invoice.type}</Text></View>
          <View style={styles.colPrice}><Text style={styles.rowText}>{invoice.amount}</Text></View>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summarySection}>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.rowText}>Subtotal</Text>
            <Text style={styles.rowText}>{invoice.amount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.rowText}>Tax (0%)</Text>
            <Text style={styles.rowText}>$0.00</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>{invoice.amount}</Text>
          </View>
        </View>
      </View>

      {/* Note */}
      <View style={{ marginTop: 60 }}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <Text style={[styles.billingAddress, { maxWidth: '100%' }]}>{invoice.note}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Thank you for your business! Reach us at support@payplatform.in</Text>
      </View>
    </Page>
  </Document>
);

export const BulkInvoiceDoc = ({ invoices }: { invoices: InvoiceData[] }) => (
  <Document>
    {invoices.map((invoice, index) => (
      <Page key={index} size="A4" style={styles.page}>
        {/* Header content repeated for each invoice */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Text style={styles.logo}>PayPlatform</Text>
            <Text style={styles.companyName}>Enterprise Payment Gateway</Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceMetaText}>Invoice ID: {invoice.id}</Text>
            <Text style={styles.invoiceMetaText}>Issue Date: {invoice.startDate}</Text>
            <Text style={styles.invoiceMetaText}>Due Date: {invoice.endDate}</Text>
          </View>
        </View>

        <View style={styles.billingSection}>
          <View style={styles.billingBox}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={styles.billingName}>{invoice.name}</Text>
            <Text style={styles.billingAddress}>{invoice.clientAddress}</Text>
          </View>
          <View style={styles.billingBox}>
            <Text style={styles.sectionTitle}>Status</Text>
            <View style={[styles.statusBadge, invoice.status !== 'PAID' && styles.unpaidBadge]}>
              <Text>{invoice.status}</Text>
            </View>
            {invoice.method && (
               <Text style={[styles.invoiceMetaText, { marginTop: 10 }]}>Payment Method: {invoice.method}</Text>
            )}
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.colDescription}><Text style={styles.headerText}>Description</Text></View>
            <View style={styles.colQty}><Text style={styles.headerText}>Type</Text></View>
            <View style={styles.colPrice}><Text style={styles.headerText}>Amount</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.colDescription}><Text style={styles.rowText}>{invoice.billName}</Text></View>
            <View style={styles.colQty}><Text style={styles.rowText}>{invoice.type}</Text></View>
            <View style={styles.colPrice}><Text style={styles.rowText}>{invoice.amount}</Text></View>
          </View>
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.rowText}>Subtotal</Text>
              <Text style={styles.rowText}>{invoice.amount}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalText}>{invoice.amount}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 60 }}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={[styles.billingAddress, { maxWidth: '100%' }]}>{invoice.note}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Page {index + 1} of {invoices.length} | Generated by PayPlatform</Text>
        </View>
      </Page>
    ))}
  </Document>
);
