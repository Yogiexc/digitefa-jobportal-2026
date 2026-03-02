<template>
    <div v-if="isVisible" class="loading-screen">
      <div class="loading-container">
        <img src="../assets/images/logo-admin.png" alt="Loading Logo" class="loading-logo" />
        <div class="loading-bar">
          <div class="loading-bar-inner"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      logo: {
        type: String,
        required: true, // URL PNG logo wajib di-pass sebagai prop
      },
      isVisible: {
        type: Boolean,
        default: true, // Default tampilan loading screen
      },
    },
  };
  </script>
  
  <style scoped>
  .loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Layar hitam dengan opasitas 50% */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000; /* Pastikan di atas elemen lainnya */
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .loading-logo {
    width: 100px; /* Sesuaikan ukuran logo */
    height: auto;
    margin-bottom: 20px;
  }
  
  .loading-bar {
    position: relative;
    width: 200px;
    height: 5px;
    background-color: rgba(255, 255, 255, 0.2); /* Warna background bar */
    overflow: hidden;
    border-radius: 10px;
  }
  
  .loading-bar-inner {
    position: absolute;
    height: 100%;
    width: 50%; /* Ukuran awal untuk animasi */
    background-color: #ffffff; /* Warna bar animasi */
    animation: loadingAnimation 1.5s linear infinite; /* Animasi bergerak */
  }
  
  @keyframes loadingAnimation {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(200%);
    }
  }
  </style>
  