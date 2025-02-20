import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2563eb",
    paddingBottom: 10,
    borderBottom: '2px solid #2563eb'
  },
  subtitle: {
    fontSize: 18,
    color: "#4b5563",
    marginBottom: 15,
    textAlign: "center"
  },
  section: {
    marginBottom: 15,
    padding: 10
  },
  text: {
    fontSize: 12,
    marginBottom: 8,
    color: "#374151"
  },
  table: {
    marginTop: 15,
    border: "1px solid #e5e7eb",
    borderRadius: 4,
    width: "100%"
  },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #e5e7eb",
    minHeight: 35,
    padding: 8,
    alignItems: "center"
  },
  header: {
    backgroundColor: "#f3f4f6",
    borderBottom: "2px solid #d1d5db"
  },
  headerCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
    padding: 8,
    textAlign: "left"
  },
  cell: {
    flex: 1,
    fontSize: 12,
    padding: 8,
    textAlign: "left",
    color: "#4b5563"
  },
  fileCell: {
    flex: 1,
    fontSize: 12,
    padding: 8,
    color: "#2563eb",
    textAlign: "left"
  },
  timestamp: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 20,
    textAlign: "right"
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: "#9ca3af",
    borderTop: "1px solid #e5e7eb",
    paddingTop: 10
  }
});

const GuidePDF = ({ guide, guides }) => {
  const guideList = Array.isArray(guides) ? guides : [];
  const currentDate = new Date().toLocaleDateString();

  const getFileType = (filePath) => {
    if (!filePath) return "Aucun fichier";
    if (filePath.match(/\.pdf$/i)) return "PDF";
    if (filePath.match(/\.(jpg|jpeg|png|gif)$/i)) return "Image";
    return "Fichier";
  };

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>
          {guide ? "Détails du Guide" : "Liste des Guides"}
        </Text>
        
        {guide ? (
          // Single guide view
          <View>
            <View style={styles.section}>
              <View style={styles.table}>
                <View style={styles.row}>
                  <Text style={styles.headerCell}>Titre</Text>
                  <Text style={styles.cell}>{guide.titre}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.headerCell}>Description</Text>
                  <Text style={styles.cell}>{guide.description}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.headerCell}>Service</Text>
                  <Text style={styles.cell}>{guide.service}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.headerCell}>Fichier</Text>
                  <Text style={styles.fileCell}>
                    {guide.filePath ? `${getFileType(guide.filePath)} - ${guide.filePath}` : "Aucun fichier"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          // Multiple guides view
          <View>
            <Text style={styles.subtitle}>Total: {guideList.length} guides</Text>
            <View style={styles.table}>
              <View style={[styles.row, styles.header]}>
                <Text style={[styles.headerCell, { flex: 0.5 }]}>#</Text>
                <Text style={styles.headerCell}>Titre</Text>
                <Text style={[styles.headerCell, { flex: 1.5 }]}>Description</Text>
                <Text style={styles.headerCell}>Service</Text>
                <Text style={styles.headerCell}>Fichier</Text>
              </View>

              {guideList.map((g, index) => (
                <View key={g.id} style={styles.row}>
                  <Text style={[styles.cell, { flex: 0.5 }]}>{index + 1}</Text>
                  <Text style={styles.cell}>{g.titre}</Text>
                  <Text style={[styles.cell, { flex: 1.5 }]}>
                    {g.description.length > 100
                      ? `${g.description.substring(0, 100)}...`
                      : g.description}
                  </Text>
                  <Text style={styles.cell}>{g.service}</Text>
                  <Text style={styles.fileCell}>
                    {getFileType(g.filePath)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.timestamp}>Généré le {currentDate}</Text>
        <Text style={styles.footer}>
          © {new Date().getFullYear()} - Système de Gestion des Guides
        </Text>
      </Page>
    </Document>
  );
};

export default GuidePDF;