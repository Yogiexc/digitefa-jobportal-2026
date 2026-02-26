<script setup>
import NavbarStudent from "@/layout/NavbarStudent.vue";
import SidebarStudent from "@/layout/SidebarStudent.vue";
import { ref, onUnmounted, onMounted, computed } from "vue";
import Email from "./akun/Email.vue";
import Password from "./akun/Password.vue";
import AccountIntegration from "./akun/AccountIntegration.vue";
import LinkAccount from "./akun/LinkAccount.vue";
import axios from "axios";

const isSidebarVisible = ref(true);
const activeTab = ref("email");
const isLinkModalVisible = ref(false);
const user = ref(null);

const fetchUserData = async () => {
  try {
    const response = await axios.get("/user", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (response.data && response.data.user) {
      user.value = response.data.user;
    } else {
      console.error("Invalid user data structure received:", response.data);
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
};

const checkWindowSize = () => {
  isSidebarVisible.value = window.innerWidth >= 770;
};

onMounted(() => {
  checkWindowSize();
  window.addEventListener("resize", checkWindowSize);
  fetchUserData();
});

onUnmounted(() => {
  window.removeEventListener("resize", checkWindowSize);
});

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const isAccountLinked = computed(() => !!user.value?.job_portal_id);
const accountLinkedAt = computed(() => user.value?.job_portal_linked_at);

const breadcrumbText = computed(() => {
  const tabName =
    activeTab.value.charAt(0).toUpperCase() +
    activeTab.value.slice(1).replace("_", " ");
  return `Digitefa/Settings/${tabName}`;
});
const breadcrumbHalaman = computed(() => {
  return `${
    activeTab.value.charAt(0).toUpperCase() +
    activeTab.value.slice(1).replace("_", " ")
  }`;
});

const handleCloseModal = () => {
  isLinkModalVisible.value = false;
};

const handleLinkSuccess = () => {
  fetchUserData();
};

const handleUnlinkSuccess = () => {
  fetchUserData();
};
</script>
<template>
  <div class="user-background">
    <!-- NAVBAR START -->
    <NavbarStudent />
    <!-- NAVBAR END -->

    <!-- SIDEBAR START -->
    <SidebarStudent v-if="isSidebarVisible" />
    <!-- SIDEBAR END -->

    <div id="content" class="mycourse">
      <div class="container mt-80">
        <div class="col-md-12 mt-4 mt-md-0 profil">
          <div class="card rounded-3 p-4 border-0">
            <h5 class="fw-light fs-16">{{ breadcrumbText }}</h5>
            <h4 class="fs-24">{{ breadcrumbHalaman }}</h4>
            <div class="card p-3 rounded-4 bordersa mt-2">
              <div class="d-flex justify-content-start mt-11 gap-4">
                <label
                  class="fs-16 pointer"
                  :class="{ 'active-tab': activeTab === 'email' }"
                  @click="setActiveTab('email')"
                >
                  My Profil
                </label>
                <label
                  class="fs-16 pointer"
                  :class="{ 'active-tab': activeTab === 'password' }"
                  @click="setActiveTab('password')"
                >
                  Password
                </label>
                <label
                  class="fs-16 pointer"
                  :class="{ 'active-tab': activeTab === 'integration' }"
                  @click="setActiveTab('integration')"
                >
                  Account Integration
                </label>
              </div>
              <hr />
              <div v-show="activeTab === 'email'">
                <Email />
              </div>
              <div v-show="activeTab === 'password'">
                <Password />
              </div>
              <div v-show="activeTab === 'integration'">
                <AccountIntegration
                  :is-linked="isAccountLinked"
                  :linked-at="accountLinkedAt"
                  @open-link-form="isLinkModalVisible = true"
                  @unlink-success="handleUnlinkSuccess"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <LinkAccount
      :open="isLinkModalVisible"
      @close="isLinkModalVisible = false"
      @link-success="handleLinkSuccess"
    />
  </div>
</template>
