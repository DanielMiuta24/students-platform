<template>
  <div class="nav-container">
    <el-menu
        v-if="!isMobile"
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
    >
      <!-- Home Button -->
      <el-menu-item index="0">
        <router-link to="/">Home</router-link>
      </el-menu-item>

      <!-- Community -->
      <el-menu-item index="1">
        <el-link href="/community" type="text">Community</el-link>
      </el-menu-item>

      <!-- Study Opportunities -->
      <el-sub-menu index="2">
        <template #title>Study Opportunities</template>
        <el-menu-item index="2-1">
          <el-link href="/universities" type="text">Search Universities</el-link>
        </el-menu-item>
        <el-menu-item index="2-2">
          <el-link href="/scholarships" type="text">Search Scholarships</el-link>
        </el-menu-item>
      </el-sub-menu>

      <!-- Threads -->
      <el-menu-item index="3">
        <router-link to="/threads">Threads</router-link>
      </el-menu-item>

      <!-- Account Button -->
      <div class="right-desktop">
        <template v-if="!session.isAuthenticated">
          <el-button text @click="navigate('/login')">Login</el-button>
          <el-button type="primary" @click="navigate('/register')">Register</el-button>
        </template>

        <template v-else>
          <el-dropdown>
            <span class="user-name">
              <img
                :src="session.user?.profilePicture || 'https://via.placeholder.com/40'"
                alt="Profile Picture"
                class="w-8 h-8 rounded-full mr-2"
              />
              {{ session.user?.name }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="navigate(`/profile/${session.user?.username}`)">View Profile</el-dropdown-item>
                <el-dropdown-item @click="navigate('/messages')">Messages</el-dropdown-item>
                <el-dropdown-item @click="logout">Logout</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </el-menu>

    <!-- Mobile Header -->
    <div v-else class="mobile-header">
      <el-button @click="drawerMenu = true" circle>
        <el-icon><Menu /></el-icon>
      </el-button>

      <el-button @click="drawerAccount = true" circle>
        <el-icon><User /></el-icon>
      </el-button>
    </div>

    <!-- Mobile Menu Drawer -->
    <el-drawer v-model="drawerMenu" title="Menu" direction="ltr" size="260px">
      <el-menu :default-active="activeIndex" @select="handleSelect">
        <!-- Home Button -->
        <el-menu-item index="0">
          <router-link to="/">Home</router-link>
        </el-menu-item>

        <!-- Community -->
        <el-menu-item index="1">
          <router-link to="/community">Community</router-link>
        </el-menu-item>

        <!-- Study Opportunities -->
        <el-sub-menu index="2">
          <template #title>Study Opportunities</template>
          <el-menu-item index="2-1">
            <router-link to="/universities">Search Universities</router-link>
          </el-menu-item>
          <el-menu-item index="2-2">
            <router-link to="/scholarships">Search Scholarships</router-link>
          </el-menu-item>
        </el-sub-menu>

        <!-- Threads -->
        <el-menu-item index="3">
          <router-link to="/threads">Threads</router-link>
        </el-menu-item>
      </el-menu>
    </el-drawer>

    <!-- Mobile Account Drawer -->
    <el-drawer v-model="drawerAccount" title="Account" direction="rtl" size="260px">
      <template v-if="!session.isAuthenticated">
        <el-button type="primary" class="w-100 mb-2" @click="navigate('/login')">Login</el-button>
        <el-button class="w-100 mb-2" @click="navigate('/register')">Register</el-button>
      </template>

      <template v-else>
        <p>Welcome, <b>{{ session.user?.name }}</b></p>
        <el-button class="w-100 mb-2" @click="navigate(`/profile/${session.user?.username}`)">View Profile</el-button>
        <el-button class="w-100 mb-2" @click="navigate('/messages')">Messages</el-button>
        <el-button type="danger" class="w-100" @click="logout">Logout</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Menu, User } from '@element-plus/icons-vue';
import { useActiveMenu } from '../composables/useActiveMenu';
import { useNavigation } from '../composables/useNavigation';
import { useAuth } from '../composables/useAuth';
import { useSessionStore } from '../store/session';

const { activeIndex } = useActiveMenu();
const { navigate } = useNavigation();

const { logout } = useAuth();

const session = useSessionStore();

const drawerMenu = ref(false);
const drawerAccount = ref(false);
const isMobile = ref(false);

const checkScreen = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  session.restoreSession();

  checkScreen();
  window.addEventListener('resize', checkScreen);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreen);
});

const handleSelect = () => {
  drawerMenu.value = false;
  drawerAccount.value = false;
};
</script>

<style scoped>
.nav-container {
  width: 100%;
  max-width: 1200px; /* Optional: Restrict navbar width */
  margin: 0 auto; /* Center the navbar */
  padding: 0 16px; /* Add padding for spacing */
}

.el-menu--horizontal > .el-menu-item:nth-child(1) {
  /* Remove this rule to stop pushing Home to the far left */
  margin-right: 0;
}

.right-desktop {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 10px;
}

.mobile-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 8px;
}

.user-name {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.w-100 {
  width: 100%;
}

.mb-2 {
  margin-bottom: 10px;
}
</style>
