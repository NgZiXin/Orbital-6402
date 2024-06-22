import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../../styles/global";
import PageHeader from "../../utility/pageHeader";

export default function Forum() {
  const createPost = () => {
    console.log("TODO");
  };

  return (
    <View style={{ ...globalStyles.container, padding: 12 }}>
      <PageHeader topText="Community" bottomText="Fitness Help Forum" />
      <View style={{ position: "relative", bottom: 28 }}>
        <Text style={{ ...globalStyles.para }}>
          Post any fitness related questions & share your fitness related
          moments! Please keep all discussions civil.
        </Text>
      </View>

      <TouchableOpacity onPress={createPost} style={styles.postButton}>
        <Text style={{ ...globalStyles.para, position: "relative", right: 6 }}>
          Create Post
        </Text>
        <Ionicons
          name="send-outline"
          size={20}
          style={{
            position: "relative",
            left: 4,
          }}
        />
      </TouchableOpacity>

      <View style={globalStyles.cardV2}>
        <View style={styles.cardInner}>
          <Text style={globalStyles.header}>How to get big?</Text>
          <View style={styles.authorDate}>
            <Text style={globalStyles.para}>John Cena </Text>
            <Text
              style={{ ...globalStyles.para, position: "relative", left: 5 }}
            >
              17-05-2024
            </Text>
          </View>
          <Text style={globalStyles.para}>
            Been training and trying to eat more for the past 2 months, but my
            weight has not increased by much. How do I build muscle mass faster?
          </Text>
          <Text style={styles.likes}>Likes: 69</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  postButton: {
    position: "relative",
    bottom: 11,
    width: "50%",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F2F2",
  },

  cardInner: {
    padding: 7,
  },

  authorDate: {
    position: "relative",
    bottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  likes: {
    ...globalStyles.para,
    textAlign: "right",
    position: "relative",
    right: 10,
    color: "red",
  },
});
