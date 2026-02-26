<script setup>
import { ref, onMounted, computed } from 'vue';
import ButtonBiruComponent from '@/components/ButtonBiruComponent.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import ButtonTransparanComponen from '@/components/ButtonTransparanComponen.vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { getFromDB } from '@/utils/indexedDB';

const router = useRouter();
const level = ref('');
const levelteacherData = ref([]);
const isTableVisible = ref(false);
const isContentVisible = ref(true);
const certificateFile = ref(null);
const isModalVisible = ref(false);
const certificate = ref(null);
const certificateInputRef = ref(null);
const teacherData = ref({});
const selectedLevel = ref(null);
const isToastVisible = ref(false);
const toastMessage = ref('');
const toastClass = ref('bg-light-success');
const isSubmitting = ref(false);

const form = ref({
  certificates: []
});

const newCertificate = ref({
  name: '',
  file: null
});

const fetchLevelTeacherData = async () => {
  try {
    const response = await axios.get('/teacher-levels');
    level.value = response.data.map(level => ({
      ...level,
      requirements: level.requirements || [], // Pastikan requirements selalu array
    }));
  } catch (error) {
    console.error('Error fetching Level Course data:', error);
  }
};

const computedRequirements = computed(() => {
  return level[index]?.requirements || [];
});


const fetchTeacherData = async () => {
  const token = await getFromDB('settings', 'token');
  try {
    const response = await axios.get('/user', {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    console.log('User Response:', response.data.user);
    teacherData.value = response.data.user;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
};

const saveProfile = async () => {
  if (form.value.isSubmitting) return; 
  form.value.isSubmitting = true;

  try {
    const savedUser = JSON.parse(localStorage.getItem('user'));

    if (!savedUser || !savedUser.teacher) {
      alert('User or teacher data not found.');
      return;
    }

    const userId = savedUser.id_user;

    const formData = new FormData();

    form.value.certificates.forEach((cert, index) => {
      formData.append(`certificates[${index}][name]`, cert.name);
      formData.append(`certificates[${index}][file]`, cert.file);
    });

    const response = await axios.post(`/teacher-updateLevel-request/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data && response.data.teacher) {
      const updatedUser = {
        ...savedUser,
        teacher: {
          ...savedUser.teacher,
          ...response.data.teacher,
        },
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      user.value = updatedUser;
    }

    showToast('Sertifikat anda berhasil dikirim!', 'success');
    setTimeout(() => {
      router.push(`/settings`);
    }, 800);
  } catch (error) {
    const message =
      error.response?.data?.message || 'Gagal mengajukan pembaruan profil.';
    showToast(message, 'error');
  } finally {
    form.value.isSubmitting = false;
  }
};

const showToast = (message, type = 'success') => {
  toastMessage.value = message;
  isToastVisible.value = true;
  toastClass.value = type === 'success' ? 'bg-light-success' : 'bg-light-error';
  setTimeout(() => {
    isToastVisible.value = false;
  }, 3000);
};

const closeToast = () => {
  isToastVisible.value = false;
};


const toggleTableVisibility = () => {
  isTableVisible.value = true;
  isContentVisible.value = false;
};

const showLevels = () => {
  isTableVisible.value = false;
  isContentVisible.value = true;
};

const handleUploadClick = (level) => {
  selectedLevel.value = level;
  isTableVisible.value = true;
  isContentVisible.value = false;
};
const handleFileUpload2 = (type, event) => {
  const uploadedFile = event.target.files[0];
  if (uploadedFile) {
    if (uploadedFile.size <= 15 * 1024 * 1024) {
      const fileData = {
        name: uploadedFile.name,
        size: (uploadedFile.size / 1024).toFixed(2),
        url: URL.createObjectURL(uploadedFile),
      };
      if (type === 'certificate') {
        certificateFile.value = fileData;
        certificate.value = uploadedFile;
      }
    } else {
      alert('Ukuran file terlalu besar. Maksimal 15MB.');
    }
  }
};
const triggerFileInput = (type) => {
  if (type === 'certificate' && certificateInputRef.value) {
    certificateInputRef.value.click();
  }
};

const removeCertificate = (index) => {
  form.value.certificates.splice(index, 1);
};


const addCertificate = () => {
  if (!newCertificate.value.name || !certificateFile.value) {
    alert('Nama sertifikat dan file wajib diisi.');
    return;
  }

  form.value.certificates.push({
    name: newCertificate.value.name,
    fileName: certificateFile.value.name,
    fileUrl: certificateFile.value.url,
    file: certificate.value,
  });

  newCertificate.value.name = '';
  certificate.value = null;
  certificateFile.value = null;
  closeAddCertificateModal();
};

const closeAddCertificateModal = () => {
  isModalVisible.value = false;
};

const showAddCertificateModal = () => {
  certificateFile.value = null;
  isModalVisible.value = true;
};

onMounted(() => {
  fetchLevelTeacherData();
  fetchTeacherData();
});
</script>

<template>
  <div class="row pw">
    <template v-if="isContentVisible">
      <div class="col-md-4 mb-4" v-for="(level, index) in levelteacherData" :key="index">
        <div class="card border-0 rounded-2 mx-md-2"
          style="height: 100%; min-height: 330px; background-color: #F4F7FE;">
          <div class="card-body">
            <h5 class="fs-16 fw-medium">{{ level.name }}</h5>
            <p class="fs-14 fw-light text-justify">
              {{ level.description || 'No description available' }}
            </p>
            <hr />
            <ul class="ms--10">
                <li class="fs-14" v-for="(requirement, reqIndex) in computedRequirements" :key="reqIndex">
                  {{ requirement }}
                </li>
            </ul>
            <div class="button-container">
              <ButtonBiruComponent v-if="teacherData.teacher?.id_teacher_level === level.id_teacher_level"
                class="py-2 w-11 fs-16 mt-2" @click="handleUploadClick(level)">
                Upload
              </ButtonBiruComponent>
            </div>
          </div>
        </div>
      </div>
    </template>
    <h1>Tentang Teacher</h1>
    <p>Name Teacher: {{ teacherData.name || 'N/A' }}</p>
    <p>Level Teacher: {{ teacherData.teacher && teacherData.teacher.teacher_level ?
      teacherData.teacher.teacher_level.name :
      'N/A' }}</p>
  </div>

  <template v-if="isTableVisible">
    <div class="row pw px-3">
      <div class="card p-2" v-if="isTableVisible">
        <h1 class="fs-20 mt-2">
          Ayo naik ke {{ selectedLevel?.name || 'Level Tidak Diketahui' }}!
        </h1>
        <div class="d-flex justify-content-end">
          <ButtonBiru class="fs-16 h-40 my-2" type="button" @click="showAddCertificateModal"> Add Sertifikasi
          </ButtonBiru>
        </div>
        <form @submit.prevent="saveProfile">
          <div class="table-responsive">
            <table class="table custom-table rounded-4">
              <thead class="thead-custom">
                <tr class="ps-4">
                  <th class="ps-3 fs-16 fw-light w-1">No</th>
                  <th class="fs-16 fw-light w-330">Nama Sertifikat</th>
                  <th class="fs-16 fw-light w-300">File</th>
                  <th class="fs-16 fw-light w-10">Action</th>
                </tr>
              </thead>
              <tbody class="table-custom">
                <tr v-for="(certificate, index) in form.certificates" :key="index">
                  <td class="pt-3">{{ index + 1 }}</td>
                  <td class="pt-3">{{ certificate.name }}</td>
                  <td>
                    <div class="d-flex justify-content-start pt-1">
                      <img src="../../../../../assets/images/svg/pdf-file.svg" alt="PDF Icon" class=""
                        style="width: 20px; height: auto;" />
                      <a :href="certificate.fileUrl" target="_blank" class="fs-16 ms-1"> {{ certificate.fileName }}</a>
                    </div>
                  </td>
                  <td>
                    <button class="border-0 rounded-2 btn-trash" @click="removeCertificate(index)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="!form.certificates.length">
                  <td colspan="4" class="text-center">No certificates added.</td>
                </tr>
                <tr class="h-40">
                  <td colspan="4" class="p-1"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="d-flex justify-content-between mt-3">
            <ButtonBiru class="fs-16 h-40" @click="showLevels">Kembali</ButtonBiru>
            <ButtonBiru class="fs-16 h-40" @click="saveProfile">Submit</ButtonBiru>
          </div>
        </form>
      </div>

      <div v-if="isModalVisible" class="modal-backdrop" @click="closeAddCertificateModal"></div>
      <div v-if="isModalVisible" class="modal fade show d-block" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true" @click.self="closeAddCertificateModal">
        <div class="modal-dialog custom-modal modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header mb--3">
              <h5 class="fs-16 fw-medium" id="exampleModalLabel">
                <i class="bi bi-file-earmark-plus me-1"></i>Add Sertifikasi
              </h5>
              <button type="button" class="btn-close fs-12 c-close" @click="closeAddCertificateModal"></button>
            </div>
            <hr class="mt-0">
            <div class="ps-3 pe-4 mt-3 mb-2">
              <div class="d-flex align-items-center">
                <label for="sertifikatName" class="me-5 fs-16 mb-0">Name</label>
                <input type="text" id="sertifikatName" class="form-control w-100 h-45 c-border"
                  placeholder="Enter name sertifikat" v-model="newCertificate.name" />
              </div>
              <div class="d-flex align-items-start mt-3">
                <label for="sertifikatName" class="fs-16 mb-0 me-22">Sertifikasi</label>
                <div>
                  <div v-if="certificateFile" class="card text-center border-c p-2"
                    style="width: 170px; min-height: 220px;">
                    <div class="card-body c-default">
                      <img src="../../../../../assets/images/svg/pdf-file.svg" alt="PDF Icon" class="mx-auto d-block"
                        style="width: 70px; height: auto;">
                    </div>
                    <div class="d-flex flex-column align-items-center">
                      <label class="fs-12 opacity-75">{{ certificateFile.name }}</label>
                      <label class="fs-12 opacity-75">({{ certificateFile.size }} KB)</label>
                    </div>
                  </div>
                  <div v-else>
                    <input type="file" ref="certificateInputRef" class="hidden" accept="application/pdf"
                      @change="handleFileUpload2('certificate', $event)" />
                    <button type="button" class="btn btn-border opacity-75 px-5 py-2 mt-0 mb-1"
                      @click="triggerFileInput('certificate')">Upload</button>
                  </div>
                  <div class="opacity-75 fs-12">
                    <p class="mb-0">Max file size: 15MB</p>
                    <p>Format: .pdf</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-center mb-5">
              <ButtonTransparanComponen class="mt-4 my-0 h-40 w-30 rounded-3 c-border bg-white fs-16"
                @click="closeAddCertificateModal">Cancel</ButtonTransparanComponen>
              <ButtonBiru class="ms-3 mt-4 my-0 h-40 w-30 rounded-3 fs-16" @click="addCertificate">
                Save</ButtonBiru>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <div aria-live="polite" aria-atomic="true" class="position-fixed bs-toast">
    <div v-if="isToastVisible" :class="['toast', 'align-items-center', 'text-white', toastClass, 'border-0', 'show']"
      role="alert">
      <div class="d-flex">
        <div class="toast-body">
          {{ toastMessage }}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="closeToast"
          aria-label="Close"></button>
      </div>
    </div>
  </div>
</template>
