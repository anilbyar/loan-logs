import { ActivityIndicator, Modal, Text, View } from "react-native";

export const CustomProgressBar = ({ visible }) => (
  <Modal
    transparent={true}
    onRequestClose={() => null}
    visible={visible}
  >
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(220, 220, 220, 0.8)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{ borderRadius: 10, borderWidth: 1, backgroundColor: 'white', padding: 25 }}
      >
        <Text style={{ fontSize: 20, fontWeight: "200" }}>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    </View>
  </Modal>
);
