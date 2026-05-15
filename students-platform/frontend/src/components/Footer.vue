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
            <li role="listitem"><el-link href="/" class="footer-link">Home</el-link></li>
            <li role="listitem"><el-link href="/community" class="footer-link">Feed</el-link></li>
            <li role="listitem"><el-link href="/universities" class="footer-link">Search Universities</el-link></li>
            <li role="listitem"><el-link href="/scholarships" class="footer-link">Search Scholarships</el-link></li>
          </ul>
        </div>

        <!-- Support -->
        <div class="md:text-left text-center flex flex-col md:items-start items-center">
          <h3 class="font-semibold text-blue-800 mb-3">Support</h3>
          <ul class="flex flex-col gap-2 md:items-start items-center" role="list">
            <li role="listitem"><router-link to="/support" class="footer-link">Report a problem</router-link></li>
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

:deep(.el-link),
.footer-link {
  color: #000000 !important;
  text-decoration: none !important;
  font-size: 14px;
  transition: color 0.2s ease;
}

:deep(.el-link:hover),
:deep(.el-link:focus),
.footer-link:hover,
.footer-link:focus {
  color: #409eff !important;
  text-decoration: none !important;
}

:deep(.el-link:active),
.footer-link:active {
  color: #409eff !important;
  text-decoration: none !important;
}

:deep(.el-link:visited),
.footer-link:visited {
  color: #000000 !important;
  text-decoration: none !important;
}

:deep(.el-link:visited:hover),
.footer-link:visited:hover {
  color: #409eff !important;
  text-decoration: none !important;
}

:deep(.el-link *),
:deep(.el-link span),
:deep(.el-link::before),
:deep(.el-link::after),
:deep(.el-link .el-link__inner),
.footer-link *,
.footer-link span {
  text-decoration: none !important;
  border-bottom: none !important;
}

:deep(.el-link.is-underline),
:deep(.el-link.is-underline:hover) {
  text-decoration: none !important;
}

:deep(.el-link:hover *),
:deep(.el-link:hover span) {
  text-decoration: none !important;
  border-bottom: none !important;
}

@media (max-width: 768px) {
  :deep(.el-link),
  .footer-link {
    display: inline-block;
    text-align: center;
  }
}
</style>