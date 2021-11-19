<template>
  <div>
    <b-input
      v-model="searchText"
      placeholder="Search for users..."
      @input="searchUser()"
    />
    <b-list-group>
      <b-list-group-item
        v-for="user in searchUsers"
        :key="user.uid"
      >
        <b-container>
          <b-row>
            <b-col>
              <p />
              <h5>Name</h5> {{ user.name }}
              <p />
              <h5>Email</h5> {{ user.email }}
            </b-col>
            <b-col>
              <b-button @click="addUser(user)">
                <b-icon-plus-circle />
              </b-button>
            </b-col>
          </b-row>
        </b-container>
      </b-list-group-item>
      <h4 v-if="usersToBeAdded.length !== 0">
        Users to be added
      </h4>
      <b-list-group-item
        v-for="(user, index) in usersToBeAdded"
        :key="user.uid + 2"
      >
        <b-container>
          <b-row>
            <b-col>
              <p />
              <h5>Name</h5> {{ user.name }}
              <p />
              <h5>Email</h5> {{ user.email }}
            </b-col>
            <b-col>
              <b-button @click="removeUser(index)">
                <b-icon-x />
              </b-button>
            </b-col>
          </b-row>
        </b-container>
      </b-list-group-item>
    </b-list-group>
    <b-button
      :disabled="usersToBeAdded.length === 0"
      @click="emitUsersForRoomCreation()"
    >
      Create chat room
    </b-button>
  </div>
</template>

<script>
import { axiosInstance } from '../utils/axiosInstance';

export default {
  data() {
    return {
      searchText: '',
      searchUsers: [],
      usersToBeAdded: [],

    };
  },
  methods: {
    async searchUser() {
      this.searchUsers = (await axiosInstance.get(`class/${this.$route.params.id}/user_search?searchText=${this.searchText}`)).data.results;
    },
    addUser(user) {
      if (this.usersToBeAdded.some((elem) => elem.uid === user.uid)) return;
      this.usersToBeAdded.push(user);
    },
    removeUser(index) {
      this.usersToBeAdded.splice(index, 1);
    },
    emitUsersForRoomCreation() {
      const userUids = this.usersToBeAdded.map((elem) => elem.uid);
      this.$emit('create-room', userUids);
    },
  },
};
</script>
