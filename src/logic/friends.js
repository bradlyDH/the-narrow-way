// src/logic/friends.js
import {
  loadFriendsData,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriendship,
  syncFriends,
} from '../services/friendsService';

// New API
export {
  loadFriendsData,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriendship,
  syncFriends,
};

// Legacy-ish helpers (if your screen expects these names)
export async function getFriends() {
  return loadFriendsData();
}
export async function addFriend(friendId) {
  return sendFriendRequest(friendId);
}
export async function acceptFriend(id) {
  return acceptFriendRequest(id);
}
export async function deleteFriend(id) {
  return removeFriendship(id);
}
export async function syncFriendsList(limit = 500) {
  return syncFriends(limit);
}
