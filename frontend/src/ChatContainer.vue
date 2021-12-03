<!-- Almost all of this code copied from demo folder here: https://github.com/antoine92190/vue-advanced-chat-->

<template>
  <div class="window-container" :class="{ 'window-mobile': isDevice }">
    <chat-window
      :show-audio="false"
      :height="screenHeight"
      :theme="theme"
      :styles="styles"
      :current-user-id="currentUserId"
      :room-id="roomId"
      :rooms="rooms"
      :loading-rooms="loadingRooms"
      :messages="messages"
      :messages-loaded="messagesLoaded"
      :rooms-loaded="roomsLoaded"
      :room-actions="roomActions"
      :menu-actions="menuActions"
      :room-message="roomMessage"
      :templates-text="templatesText"
      :show-files="false"
      @fetch-more-rooms="fetchMoreRooms"
      @fetch-messages="fetchMessages"
      @send-message="sendMessage"
      @edit-message="editMessage"
      @delete-message="deleteMessage"
      @open-user-tag="openUserTag"
      @add-room="showAddRoomModal = true"
      @room-action-handler="menuActionHandler"
      @menu-action-handler="menuActionHandler"
      @send-message-reaction="sendMessageReaction"
      @toggle-rooms-list="$emit('show-demo-options', $event.opened)"
    >
      <!-- <template #room-header="{ room }">
        {{ room.roomName }}
      </template> -->
    </chat-window>

    <b-modal v-model="showAddRoomModal" ok-only ok-title="Cancel">
      <add-users @create-room="addRoom" />
    </b-modal>

    <b-modal v-model="chatRoomCreationError" ok-only>
      Unexpected error creating chat room.
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import ChatWindow, { Rooms } from "vue-advanced-chat";
import AddUsers from "./components/AddUsers.vue";
import {
  db,
  firebase,
  roomsRef,
  messagesRef,
  usersRef,
  deleteDbField,
} from "@/firestore";
import { parseTimestamp, isSameDay } from "@/utils/dates";
// import ChatWindow from 'vue-advanced-chat'
import "vue-advanced-chat/dist/vue-advanced-chat.css";
import { axiosInstance } from "./utils/axiosInstance";
// import ChatWindow from './../../dist/vue-advanced-chat.umd.min.js'

export default {
  components: {
    ChatWindow,
    "add-users": AddUsers,
  },

  props: {
    currentUserId: { type: String, required: true },
    theme: { type: String, required: true },
    isDevice: { type: Boolean, required: true },
    isQuit: { type: Boolean, required: true },
  },

  emits: ["show-demo-options"],

  data() {
    return {
      classDoc: [],
      showAddRoomModal: false,
      chatRoomCreationError: false,

      roomsPerPage: 15,
      rooms: [],
      roomId: "",
      startRooms: null,
      endRooms: null,
      roomsLoaded: false,
      loadingRooms: true,
      allUsers: [],
      loadingLastMessageByRoom: 0,
      roomsLoadedCount: false,
      selectedRoom: null,
      messagesPerPage: 20,
      messages: [],
      messagesLoaded: false,
      roomMessage: "",
      startMessages: null,
      endMessages: null,
      roomsListeners: [],
      listeners: [],
      typingMessageCache: "",
      disableForm: false,
      addNewRoom: null,
      addRoomUsername: "",
      inviteEnrollCode: null,
      invitedUsername: "",
      removeEnrollCode: null,
      removeUserId: "",
      removeUsers: [],
      roomActions: [{ name: "leaveRoom", title: "Leave Room" }],
      menuActions: [{ name: "leaveRoom", title: "Leave Room" }],
      styles: { container: { borderRadius: "4px" } },
      templatesText: [
        {
          tag: "help",
          text: "This is the help",
        },
      ],
      // ,dbRequestCount: 0
    };
  },
  computed: {
    loadedRooms() {
      return this.rooms.slice(0, this.roomsLoadedCount);
    },
    screenHeight() {
      return this.isDevice ? `${window.innerHeight}px` : "calc(100vh - 80px)";
    },
  },
  watch: {
    isQuit: {
      immediate: true,
      handler(newVal, old) {
        if (old === false && newVal === true) this.leaveAllRoom();
      },
    },
  },

  mounted() {
    this.fetchRooms(this.$route.params.id);
    console.log(this.$route);
  },

  methods: {
    async getUser(id) {
      return (await axiosInstance.get(`users/${id}`)).data;
    },
    async fetchClassDoc(classId) {
      this.resetRooms();
      const { quarter } = (await axios.get(`${this.$API_BASE}currentQuarter`))
        .data;
      this.classDoc = [
        (await db.collection(`courses_${quarter}`).doc(classId).get()).data(),
      ];
      console.log(this.classDoc);
      console.log(this.classDoc);
    },

    resetRooms() {
      this.loadingRooms = true;
      this.loadingLastMessageByRoom = 0;
      this.roomsLoadedCount = 0;
      this.rooms = [];
      this.roomsLoaded = true;
      this.startRooms = null;
      this.endRooms = null;
      this.roomsListeners.forEach((listener) => listener());
      this.roomsListeners = [];
      this.resetMessages();
    },

    resetMessages() {
      console.log("resetMessages");
      this.messages = [];
      this.messagesLoaded = false;
      this.startMessages = null;
      this.endMessages = null;
      this.listeners.forEach((listener) => listener());
      this.listeners = [];
    },

    fetchRooms() {
      this.resetRooms();
      this.fetchMoreRooms();
    },

    async fetchMoreRooms() {
      if (this.endRooms && !this.startRooms) return (this.roomsLoaded = true);
      console.log(this.currentUserId);
      let query = roomsRef
        .where("users", "array-contains", this.currentUserId)
        .where("classId", "==", this.$route.params.id)
        .orderBy("lastUpdated", "desc")
        .limit(this.roomsPerPage);

      if (this.startRooms) query = query.startAfter(this.startRooms);

      const rooms = await query.get();
      console.log(rooms.size);
      // this.incrementDbCounter('Fetch Rooms', rooms.size)

      this.roomsLoaded = rooms.empty || rooms.size < this.roomsPerPage;

      if (this.startRooms) this.endRooms = this.startRooms;
      this.startRooms = rooms.docs[rooms.docs.length - 1];

      const roomUserIds = [];
      rooms.forEach((room) => {
        room.data().users.forEach((userId) => {
          const foundUser = this.allUsers.find((user) => user?.uid === userId);
          if (!foundUser && roomUserIds.indexOf(userId) === -1) {
            roomUserIds.push(userId);
          }
        });
      });

      // this.incrementDbCounter('Fetch Room Users', roomUserIds.length)
      let rawUsers = [];
      roomUserIds.forEach((userId) => {
        if (userId === "removed") return;
        const promise = this.getUser(userId);

        rawUsers.push(promise);
      });
      rawUsers = await Promise.all(rawUsers);
      // eslint-disable-next-line no-param-reassign
      rawUsers.forEach((elem) => {
        elem.username = elem.name;
      });
      this.allUsers = [...this.allUsers, ...rawUsers];

      const roomList = {};
      rooms.forEach((room) => {
        roomList[room.id] = { ...room.data(), users: [] };

        room.data().users.forEach((userId) => {
          const foundUser = this.allUsers.find((user) => user?.uid === userId);
          if (userId === "removed")
            roomList[room.id].users.push({ username: "", _id: "" });
          if (foundUser) roomList[room.id].users.push(foundUser);
        });
      });

      const formattedRooms = [];

      Object.keys(roomList).forEach((key) => {
        const room = roomList[key];

        const roomContacts = room.users.filter(
          (user) => user.uid !== this.currentUserId
        );

        room.roomName =
          roomContacts
            .map((user) => user.username)
            .filter((name) => name !== "")
            .join(", ") || "Myself";

        const roomAvatar =
          roomContacts.length === 1 && roomContacts[0].avatar
            ? roomContacts[0].avatar
            : require("@/assets/logo.png");

        formattedRooms.push({
          ...room,
          roomId: key,
          avatar: roomAvatar,
          index: room.lastUpdated?.seconds,
          lastMessage: {
            content: "Room created",
            timestamp: this.formatTimestamp(
              new Date(room.lastUpdated?.seconds),
              room.lastUpdated
            ),
          },
        });
      });

      this.rooms = this.rooms.concat(formattedRooms);
      formattedRooms.map((room) => this.listenLastMessage(room));

      if (!this.rooms.length) {
        this.loadingRooms = false;
        this.roomsLoadedCount = 0;
      }

      this.listenRooms(query);
      // setTimeout(() => console.log('TOTAL', this.dbRequestCount), 2000)
    },

    listenLastMessage(room) {
      const listener = messagesRef(room.roomId)
        .orderBy("timestamp", "desc")
        .limit(1)
        .onSnapshot((messages) => {
          // this.incrementDbCounter('Listen Last Room Message', messages.size)
          messages.forEach((message) => {
            const lastMessage = this.formatLastMessage(message.data());
            const roomIndex = this.rooms.findIndex(
              (r) => room.roomId === r.roomId
            );
            this.rooms[roomIndex].lastMessage = lastMessage;
            console.log(lastMessage);
            this.rooms = [...this.rooms];
          });
          if (this.loadingLastMessageByRoom < this.rooms.length) {
            this.loadingLastMessageByRoom++;

            if (this.loadingLastMessageByRoom === this.rooms.length) {
              this.loadingRooms = false;
              this.roomsLoadedCount = this.rooms.length;
            }
          }
        });

      this.roomsListeners.push(listener);
    },

    formatLastMessage(message) {
      if (!message.timestamp) return undefined;

      const { content } = message;

      return {
        ...message,
        ...{
          content,
          timestamp: this.formatTimestamp(
            new Date(message.timestamp.seconds * 1000),
            message.timestamp
          ),
          distributed: true,
          seen: message.sender_id === this.currentUserId ? message.seen : null,
          new:
            message.sender_id !== this.currentUserId &&
            (!message.seen || !message.seen[this.currentUserId]),
        },
      };
    },

    formatTimestamp(date, timestamp) {
      const timestampFormat = isSameDay(date, new Date())
        ? "HH:mm"
        : "DD/MM/YY";
      const result = parseTimestamp(timestamp, timestampFormat);
      return timestampFormat === "HH:mm" ? `Today, ${result}` : result;
    },

    async fetchMessages({ room, options = {} }) {
      console.log(options);
      this.$emit("show-demo-options", false);

      if (options.reset) {
        this.resetMessages();
        this.roomId = room.roomId;
      }

      if (this.endMessages && !this.startMessages) {
        return (this.messagesLoaded = true);
      }

      const ref = messagesRef(room.roomId);

      let query = ref.orderBy("timestamp", "desc").limit(this.messagesPerPage);

      if (this.startMessages) query = query.startAfter(this.startMessages);

      this.selectedRoom = room.roomId;

      const messages = await query.get();
      // this.incrementDbCounter('Fetch Room Messages', messages.size)
      if (this.selectedRoom !== room.roomId) return;

      if (messages.empty || messages.docs.length < this.messagesPerPage) {
        setTimeout(() => (this.messagesLoaded = true), 0);
      }

      if (this.startMessages) this.endMessages = this.startMessages;
      this.startMessages = messages.docs[messages.docs.length - 1];

      let listenerQuery = ref.orderBy("timestamp");

      if (this.startMessages) {
        listenerQuery = listenerQuery.startAt(this.startMessages);
      }
      if (this.endMessages) {
        listenerQuery = listenerQuery.endAt(this.endMessages);
      }

      if (options.reset) this.messages = [];
      messages.forEach((message) => {
        // eslint-disable-next-line no-await-in-loop
        const formattedMessage = this.formatMessage(room, message);
        this.messages.unshift(formattedMessage);
      });
      this.messages = await Promise.all(this.messages);
      console.log(this.messages);
      const listener = listenerQuery.onSnapshot((snapshots) => {
        // this.incrementDbCounter('Listen Room Messages', snapshots.size)
        this.listenMessages(snapshots, room);
      });
      this.listeners.push(listener);
    },

    async listenMessages(messages, room) {
      messages.forEach(async (message) => {
        const formattedMessage = await this.formatMessage(room, message);
        // eslint-disable-next-line no-underscore-dangle
        const messageIndex = this.messages.findIndex(
          (m) => m._id === message.id
        );

        if (messageIndex === -1) {
          this.messages = this.messages.concat([formattedMessage]);
        } else {
          this.messages[messageIndex] = formattedMessage;
          this.messages = [...this.messages];
        }

        this.markMessagesSeen(room, message);
      });
    },

    markMessagesSeen(room, message) {
      if (
        message.data().sender_id !== this.currentUserId &&
        (!message.data().seen || !message.data().seen[this.currentUserId])
      ) {
        messagesRef(room.roomId)
          .doc(message.id)
          .update({
            [`seen.${this.currentUserId}`]: new Date(),
          });
      }
    },

    async formatMessage(room, message) {
      const senderUser = await this.getUser(message.data().sender_id);

      const { timestamp } = message.data();

      const formattedMessage = {
        ...message.data(),
        ...{
          senderId: message.data().sender_id,
          _id: message.id,
          seconds: timestamp.seconds,
          timestamp: parseTimestamp(timestamp, "HH:mm"),
          date: parseTimestamp(timestamp, "DD MMMM YYYY"),
          username: senderUser ? senderUser.name : null,
          // avatar: senderUser ? senderUser.avatar : null,
          distributed: true,
        },
      };

      if (message.data().replyMessage) {
        formattedMessage.replyMessage = {
          ...message.data().replyMessage,
          ...{
            senderId: message.data().replyMessage.sender_id,
          },
        };
      }

      return formattedMessage;
    },

    async sendMessage({ content, roomId, replyMessage }) {
      const message = {
        sender_id: this.currentUserId,
        content,
        timestamp: new Date(),
      };

      if (replyMessage) {
        message.replyMessage = {
          _id: replyMessage._id,
          content: replyMessage.content,
          sender_id: replyMessage.senderId,
        };
      }

      const { id } = await messagesRef(roomId).add(message);

      roomsRef.doc(roomId).update({ lastUpdated: new Date() });
    },

    async editMessage({ messageId, newContent, roomId }) {
      const newMessage = { edited: new Date() };
      newMessage.content = newContent;

      await messagesRef(roomId).doc(messageId).update(newMessage);
    },

    async deleteMessage({ message, roomId }) {
      await messagesRef(roomId)
        .doc(message._id)
        .update({ deleted: new Date() });
    },

    async openUserTag({ user }) {
      let roomId;

      this.rooms.forEach((room) => {
        if (room.users.length === 2) {
          const userId1 = room.users[0]._id;
          const userId2 = room.users[1]._id;
          if (
            (userId1 === user._id || userId1 === this.currentUserId) &&
            (userId2 === user._id || userId2 === this.currentUserId)
          ) {
            roomId = room.roomId;
          }
        }
      });

      if (roomId) return (this.roomId = roomId);

      const query1 = await roomsRef
        .where("users", "==", [this.currentUserId, user._id])
        .get();

      if (!query1.empty) {
        return this.loadRoom(query1);
      }

      const query2 = await roomsRef
        .where("users", "==", [user._id, this.currentUserId])
        .get();

      if (!query2.empty) {
        return this.loadRoom(query2);
      }

      const room = await roomsRef.add({
        users: [user._id, this.currentUserId],
        lastUpdated: new Date(),
      });

      this.roomId = room.id;
      this.fetchRooms();
    },

    async loadRoom(query) {
      query.forEach(async (room) => {
        if (this.loadingRooms) return;
        await roomsRef.doc(room.id).update({ lastUpdated: new Date() });
        this.roomId = room.id;
        this.fetchRooms();
      });
    },

    menuActionHandler({ action, roomId }) {
      switch (action.name) {
        case "leaveRoom":
          return this.leaveRoom(roomId);
        default:
      }
    },

    async sendMessageReaction({ reaction, remove, messageId, roomId }) {
      const dbAction = remove
        ? firebase.firestore.FieldValue.arrayRemove(this.currentUserId)
        : firebase.firestore.FieldValue.arrayUnion(this.currentUserId);

      await messagesRef(roomId)
        .doc(messageId)
        .update({
          [`reactions.${reaction.unicode}`]: dbAction,
        });
    },

    typingMessage({ message, roomId }) {
      if (!roomId) return;

      if (message?.length > 1) {
        return (this.typingMessageCache = message);
      }

      if (message?.length === 1 && this.typingMessageCache) {
        return (this.typingMessageCache = message);
      }

      this.typingMessageCache = message;

      const dbAction = message
        ? firebase.firestore.FieldValue.arrayUnion(this.currentUserId)
        : firebase.firestore.FieldValue.arrayRemove(this.currentUserId);

      roomsRef.doc(roomId).update({
        typingUsers: dbAction,
      });
    },

    async listenRooms(query) {
      const listener = query.onSnapshot((rooms) => {
        // this.incrementDbCounter('Listen Rooms Typing Users', rooms.size)
        rooms.forEach((room) => {
          const foundRoom = this.rooms.find((r) => r.roomId === room.id);
          if (foundRoom) {
            foundRoom.typingUsers = room.data().typingUsers;
            foundRoom.index = room.data().lastUpdated.seconds;
          }
        });
      });
      this.roomsListeners.push(listener);
    },

    async addRoom(uidArray) {
      uidArray.push(this.currentUserId);
      try {
        await db.collection("chatRooms").add({
          classId: this.$route.params.id,
          lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
          users: uidArray,
        });
        this.showAddRoomModal = false;
        this.fetchRooms();
      } catch (e) {
        console.log(e);
        this.chatRoomCreationError = true;
      }
    },
    async leaveRoom(roomID) {
      await roomsRef.doc(roomID).update({
        users: firebase.firestore.FieldValue.arrayRemove(this.currentUserId),
      });
      await roomsRef.doc(roomID).update({
        users: firebase.firestore.FieldValue.arrayUnion("removed"),
      });
      this.fetchRooms();
    },

    async leaveAllRoom() {
      const leavePromises = [];
      this.rooms.forEach((room) =>
        leavePromises.push(this.leaveRoom(room.roomId).catch(() => {}))
      );
      await Promise.all(leavePromises);
      this.$emit("leftRooms");
    },

    async addRoomUser() {
      this.disableForm = true;

      const { id } = await usersRef.add({ username: this.invitedUsername });
      await usersRef.doc(id).update({ _id: id });

      await roomsRef
        .doc(this.inviteEnrollCode)
        .update({ users: firebase.firestore.FieldValue.arrayUnion(id) });

      this.inviteEnrollCode = null;
      this.invitedUsername = "";
      this.fetchRooms();
    },

    // async deleteRoom(roomId) {
    //   const room = this.rooms.find((r) => r.roomId === roomId);
    //   if (
    //     room.users.find((user) => user._id === "SGmFnBZB4xxMv9V4CVlW") ||
    //     room.users.find((user) => user._id === "6jMsIXUrBHBj7o2cRlau")
    //   ) {
    //     return alert("Nope, for demo purposes you cannot delete this room");
    //   }

    //   const ref = messagesRef(roomId);

    //   ref.get().then((res) => {
    //     if (res.empty) return;
    //     res.docs.map((doc) => ref.doc(doc.id).delete());
    //   });

    //   await roomsRef.doc(roomId).delete();

    //   this.fetchRooms();
    // },

    resetForms() {
      this.disableForm = false;
      this.addNewRoom = null;
      this.addRoomUsername = "";
      this.inviteEnrollCode = null;
      this.invitedUsername = "";
      this.removeEnrollCode = null;
      this.removeUserId = "";
    },
  },
};
</script>
