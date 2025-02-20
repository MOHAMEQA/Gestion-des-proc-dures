import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  section: { marginBottom: 10 },
  text: { fontSize: 14, marginBottom: 5 },
  table: { marginTop: 10, border: "1px solid black" },
  row: { flexDirection: "row", borderBottom: "1px solid black", padding: 5 },
  header: { backgroundColor: "#eee", fontWeight: "bold" },
  cell: { flex: 1, textAlign: "center", fontSize: 12, padding: 5 },
});

const SearchResultsPDF = ({ query, results }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>Guide "{query}"</Text>

      {results.length > 0 ? (
        <View style={styles.table}>
          <View style={[styles.row, styles.header]}>
            
            <Text style={styles.cell}>Titre</Text>
            <Text style={styles.cell}>Description</Text>
            <Text style={styles.cell}>Service</Text>
          </View>

          {results.map((guide, index) => (
            <View key={guide.id} style={styles.row}>
              <Text style={styles.cell}>{guide.titre}</Text>
              <Text style={styles.cell}>{guide.description}</Text>
              <Text style={styles.cell}>{guide.service}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text>No results found.</Text>
      )}
    </Page>
  </Document>
);

export default SearchResultsPDF;
