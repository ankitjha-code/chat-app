// app/chat/index.tsx
import image1 from "../../assets/first.jpg";
import image2 from "../../assets/second.jpg";
import image3 from "../../assets/third.jpg";
import image4 from "../../assets/last.jpg";

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";

interface Sender {
  image: string;
  is_kyc_verified: boolean;
  self: boolean;
  user_id: string;
}

interface ChatMessage {
  id: string;
  message: string;
  sender: Sender;
  time: string;
}

interface TripDetails {
  from: string;
  to: string;
  name: string;
}

export default function ChatScreen() {
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [attachmentPopupVisible, setAttachmentPopupVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [tripDetails, setTripDetails] = useState<TripDetails>({
    from: "HSR Layout",
    to: "Bellandur",
    name: "Trip No. 1",
  });

  const fetchChats = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://qa.corider.in/assignment/chat?page=${pageNum}`
      );
      const data = await response.json();

      if (pageNum === 0) {
        setTripDetails({
          from: data.from,
          to: data.to,
          name: data.name,
        });
        setChats(data.chats.reverse());
      } else {
        setChats((prevChats) => [...prevChats, ...data.chats.reverse()]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chats:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats(0);
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity style={[styles.backButton, styles.leftHeader]}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.title}>{tripDetails.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <AntDesign name="form" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.tripInfo}>
        <View style={[styles.quadrupleImage, styles.tripImage]}>
          <Image
            source={image1}
            style={[styles.quadrantImage, styles.topLeft]}
          />
          <Image
            source={image2}
            style={[styles.quadrantImage, styles.topRight]}
          />
          <Image
            source={image3}
            style={[styles.quadrantImage, styles.bottomLeft]}
          />
          <Image
            source={image4}
            style={[styles.quadrantImage, styles.bottomRight]}
          />
        </View>
        <View style={styles.tripDetails}>
          <Text style={styles.tripTitle}>
            From <Text style={styles.boldText}>{tripDetails.from}</Text>
          </Text>
          <Text style={styles.tripTitle}>
            To <Text style={styles.boldText}>{tripDetails.to}</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(!menuVisible)}
        >
          <Feather name="more-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {menuVisible && (
        <View style={styles.popupMenu}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons
              name="people"
              size={20}
              color="black"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Members</Text>
          </TouchableOpacity>
          <View style={styles.menuSeparator} />
          <TouchableOpacity style={styles.menuItem}>
            <Feather
              name="share-2"
              size={20}
              color="black"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Share Details</Text>
          </TouchableOpacity>
          <View style={styles.menuSeparator} />
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons
              name="report"
              size={20}
              color="black"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Report</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isSelf = item.sender.self;

    return (
      <View
        style={[
          styles.messageContainer,
          isSelf ? styles.selfMessage : styles.otherMessage,
        ]}
      >
        {!isSelf && (
          <Image source={{ uri: item.sender.image }} style={styles.avatar} />
        )}
        <View
          style={[
            styles.messageBubble,
            isSelf ? styles.selfBubble : styles.otherBubble,
          ]}
        >
          <Text
            style={[styles.messageText, isSelf ? styles.selfMessageText : null]}
          >
            {item.message.replace(/<br>/g, "\n")}
          </Text>
        </View>
      </View>
    );
  };

  // Modify renderInputBar
  const renderInputBar = () => (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput style={styles.input} multiline placeholderTextColor="#666" />
        <TouchableOpacity
          style={styles.attachButton}
          onPress={() => setAttachmentPopupVisible(!attachmentPopupVisible)}
        >
          <Ionicons name="attach" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton}>
          <MaterialIcons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {attachmentPopupVisible && (
        <View style={styles.attachmentPopup}>
          <TouchableOpacity style={styles.attachmentIcon}>
            <Ionicons name="camera" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachmentIcon}>
            <Ionicons name="videocam" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachmentIcon}>
            <Ionicons name="document" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <StatusBar style="dark" />
      {renderHeader()}
      <FlatList
        data={chats}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        onEndReached={() => {
          if (!loading) {
            setPage((prev) => prev + 1);
            fetchChats(page + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" /> : null
        }
      />
      {renderInputBar()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", position: "relative" },
  header: {
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 0 : 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    position: "relative",
    zIndex: 999998,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: { padding: 8 },
  title: { fontSize: 18, fontWeight: "600" },
  menuButton: { padding: 8 },
  tripInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  tripImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  tripDetails: { flex: 1 },
  tripTitle: { fontSize: 16, color: "#666", lineHeight: 20 },
  boldText: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 18,
    lineHeight: 24,
  },
  messageContainer: {
    flexDirection: "row",
    padding: 8,
    marginVertical: 4,
    marginHorizontal: 12,
    zIndex: 1000,
  },
  selfMessage: { justifyContent: "flex-end" },
  otherMessage: { justifyContent: "flex-start" },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
  },
  selfBubble: {
    backgroundColor: "#1A75FF",
    borderTopRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#F2F2F2",
    borderTopLeftRadius: 4,
  },
  messageText: { fontSize: 14, color: "#333" },
  selfMessageText: { color: "#fff" },
  inputContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    position: "relative",
    borderRadius: 24,
    paddingHorizontal: 0,
  },
  attachButton: {
    paddingHorizontal: 8,
  },
  attachmentPopup: {
    position: "absolute",
    bottom: 80, // Adjust based on your input box height
    right: 50,
    flexDirection: "row",
    backgroundColor: "#008000",
    borderRadius: 25,
    padding: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1000,
  },
  attachmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    color: "#000",
    maxHeight: 100,
    borderRadius: 24,
  },
  sendButton: {
    backgroundColor: "#008000",
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    marginTop: 8,
  },
  quadrupleImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
  },
  quadrantImage: {
    width: 24,
    height: 24,
    position: "absolute",
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
  },
  leftHeader: { flexDirection: "row", alignItems: "center", gap: 24 },
  popupMenu: {
    position: "absolute",
    top: Platform.OS === "ios" ? 130 : 140, // Adjust as needed
    right: 25,
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 999999, // For Android
    shadowColor: "#000", // For iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 999999, // Ensure the popup appears above other elements
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: "#000",
  },
  menuSeparator: {
    height: 1,
    backgroundColor: "#eee",
  },
});
