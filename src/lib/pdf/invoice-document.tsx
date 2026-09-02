import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  title: { fontSize: 20, marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  muted: { color: "#555" },
  box: { marginTop: 20, padding: 12, border: "1pt solid #ccc" },
});

export function InvoiceDocument(props: {
  number: string;
  customerName: string;
  amount: number;
  status: string;
  issuedAt: string;
  dueAt: string;
  serviceType: string;
  notes?: string | null;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Invoice {props.number}</Text>
        <View style={styles.row}>
          <Text>Bill to</Text>
          <Text>{props.customerName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.muted}>Service</Text>
          <Text>{props.serviceType}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.muted}>Issued</Text>
          <Text>{props.issuedAt}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.muted}>Due</Text>
          <Text>{props.dueAt}</Text>
        </View>
        <View style={styles.box}>
          <View style={styles.row}>
            <Text>Amount</Text>
            <Text>INR {props.amount.toLocaleString("en-IN")}</Text>
          </View>
          <View style={styles.row}>
            <Text>Status</Text>
            <Text>{props.status}</Text>
          </View>
          {props.notes ? <Text style={styles.muted}>{props.notes}</Text> : null}
        </View>
      </Page>
    </Document>
  );
}

export function ReportDocument(props: {
  title: string;
  generatedAt: string;
  lines: string[];
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.muted}>{props.generatedAt}</Text>
        <View style={{ marginTop: 16 }}>
          {props.lines.map((line) => (
            <Text key={line} style={{ marginBottom: 4 }}>
              {line}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
