<template>
  <el-footer class="bg-blue-50 w-full footer-no-padding">

    <div class="w-full bg-white shadow-lg p-8">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

        <!-- Logo + Description -->
        <div class="flex flex-col md:items-start items-center md:text-left text-center">
          <a href="/" class="w-40 mb-3">
            <img
              src="../images/logo.png"
              alt="International Student Compass Logo"
              class="w-40 cursor-pointer"
              width="160"
              height="107"
              loading="lazy"
            >
          </a>
          <h3 class="text-lg font-bold text-blue-800 mb-2">
            International Student Compass
          </h3>
          <p class="text-sm text-gray-600 leading-relaxed">
            Your guide to scholarships, universities, online courses, and a supportive community.
          </p>
        </div>

        <!-- Links -->
        <div class="md:text-left text-center flex flex-col md:items-start items-center">
          <h3 class="font-semibold text-blue-800 mb-3">Easy Links</h3>
          <ul class="flex flex-col gap-2 md:items-start items-center" role="list">
            <li role="listitem"><el-link href="/" class="text-blue-600 hover:underline">Home</el-link></li>
            <li role="listitem"><el-link href="/community" class="text-blue-600 hover:underline">Feed</el-link></li>
            <li role="listitem"><el-link href="/universities" class="text-blue-600 hover:underline">Search Universities</el-link></li>
            <li role="listitem"><el-link href="/scholarships" class="text-blue-600 hover:underline">Search Scholarships</el-link></li>
          </ul>
        </div>

        <!-- Support -->
        <div class="md:text-left text-center flex flex-col md:items-start items-center">
          <h3 class="font-semibold text-blue-800 mb-3">Support</h3>
          <ul class="flex flex-col gap-2 md:items-start items-center" role="list">
            <li role="listitem"><el-link href="/support" class="text-blue-600 hover:underline">Report a problem</el-link></li>
          </ul>
        </div>

        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200 mt-8 pt-4 text-center">
          <p class="text-sm text-gray-700">
            © 2025 International Student Compass. All rights reserved.
          </p>
        </div>
      </div>
    </div>

  </el-footer>
</template>

<style scoped>
.footer-no-padding {
  padding: 0 !important;
  margin: 0 !important;
}

@media (max-width: 768px) {
  :deep(.el-link) {
    display: inline-block;
    text-align: center;
  }
}
</style>