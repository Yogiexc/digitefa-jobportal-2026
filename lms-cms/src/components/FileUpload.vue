<template>
  <div class="file-upload my-3" @click="openFileDialog">
    <input type="file" ref="fileInput" class="fp" @change="handleFileUpload" :accept="accept" :multiple="multiple" />

    <!-- File List -->
    <div v-if="fileList.length > 0" class="row justify-content-start">
      <div v-for="(file, index) in fileList" :key="file.id || index" class="col-auto mb-2">
        <div class="card text-center border-c shadow mb-3 mt-2" :style="{ minHeight: '220px' }" style="width: 200px;">
          <div class="card-body c-default" @click="cursorFile(index, $event)">
            <!-- File Type Icons -->
            <img v-if="file.type === 'pdf'" src="../assets/images/svg/pdf-file.svg" alt="" class="mx-auto d-block mb-2" style="width: 90px; height: auto;">
            <img v-if="file.type === 'doc'" src="../assets/images/svg/docs-file.svg" alt="" class="mx-auto d-block mb-2" style="width: 90px; height: auto;">
            <img
              v-if="file.type === 'png' || file.type === 'jpeg' || file.type === 'jpg'"
              :src="file.preview || file.raw"
              alt=""
              class="mx-auto d-block mb-2"
              style="width: 90px; height: auto;"
            />

            <!-- File Details -->
            <div class="d-flex flex-column align-items-center">
              <label class="fs-12 opacity-75" style="font-weight: 400;">{{ file.name }}</label>
              <label class="fs-12 opacity-75" style="font-weight: 400;" v-if="file.size">({{ file.size }}KB)</label>
            </div>

            <!-- Action Buttons -->
            <div class="d-flex justify-content-end gap-2 mt-4 bottom-right c-pointer">
              <div class="rounded-1" style="padding: 2px 4px 2px 4px; border: 1px solid #ccc;">
                <i class="bi bi-trash3" @click="file.id ? removeFileData(file.id) : removeFile(index, $event)"></i>
              </div>
              <div class="rounded-1" style="padding: 2px 3px 2px 3px; border: 1px solid #ccc;">
                <i class="bi bi-zoom-in" @click="zoomFile(index, $event)"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Placeholder -->
    <div v-if="fileList.length === 0" class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 48 48">
        <path d="M 8.5 8 C 6.019 8 4 10.019 4 12.5 L 4 35.5 C 4 37.981 6.019 40 8.5 40 L 39.5 40 C 41.981 40 44 37.981 44 35.5 L 44 17.5 C 44 15.019 41.981 13 39.5 13 L 24.042969 13 L 19.572266 9.2734375 C 18.586266 8.4514375 17.335734 8 16.052734 8 L 8.5 8 z M 24 19 C 24.552 19 25 19.448 25 20 L 25 30.5 C 25 30.538 24.982516 30.570422 24.978516 30.607422 L 28.292969 27.292969 C 28.683969 26.901969 29.316031 26.901969 29.707031 27.292969 C 30.098031 27.683969 30.098031 28.316031 29.707031 28.707031 L 24.707031 33.707031 C 24.512031 33.902031 24.256 34 24 34 C 23.744 34 23.487969 33.902031 23.292969 33.707031 L 18.292969 28.707031 C 17.901969 28.316031 17.901969 27.683969 18.292969 27.292969 C 18.683969 26.901969 19.316031 26.901969 19.707031 27.292969 L 23.021484 30.607422 C 23.017484 30.570422 23 30.538 23 30.5 L 23 20 C 23 19.448 23.448 19 24 19 z"></path>
      </svg>
      <p class="fw-semibold fs-16 opacity-50 mb-0">Drag and drop your files here</p>
      <p class="fs-12 opacity-50">or click to select files</p>
      <div class="mt--10 fs-12 opacity-50">
        <label>Max file size : 200Mb</label> <br>
        <label class="ms-md-4">Format : .pdf, .docs, .jpg, <br>.png , .jpeg</label>
      </div>
    </div>

    <!-- Preview Modal -->
    <div class="modal fade" id="pdfModal" tabindex="-1" aria-labelledby="pdfModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h5 class="modal-title" id="pdfModalLabel">Preview File</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <iframe v-if="selectedFileType === 'pdf'" :src="selectedFileUrl" width="100%" height="500px"></iframe>
            <p v-if="selectedFileType === 'doc'">This is a DOC file: {{ selectedFileName }}</p>
            <img v-if="selectedFileType === 'png' || selectedFileType === 'jpeg' || selectedFileType === 'jpg'" :src="selectedFileUrl" alt="Image" class="img-fluid">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import * as bootstrap from 'bootstrap';
import axios from 'axios';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  accept: {
    type: String,
    default: '.pdf, .doc, .docx, .jpg, .jpeg, .png',
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  resourceType: {
    type: String,
    required: true,
  }
});

const emit = defineEmits(['update:modelValue']);

const fileInput = ref(null);
const fileList = ref([]);
const selectedFileUrl = ref('');
const selectedFileType = ref('');
const selectedFileName = ref('');
let modal = null;

const calculateFileSizeFromURL = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      return (contentLength / 1024).toFixed(2); // Mengonversi byte ke KB
    }
    return null;
  } catch (error) {
    console.error('Error calculating file size from URL:', error);
    return null;
  }
};

const getFileType = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  if (extension === 'pdf') return 'pdf';
  if (['doc', 'docx'].includes(extension)) return 'doc';
  if (['jpg', 'jpeg', 'png'].includes(extension)) return extension;
  return 'unknown';
};

const openFileDialog = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  const newFiles = files.map((file) => ({
    name: file.name,
    type: getFileType(file.name),
    size: (file.size / 1024).toFixed(2),
    raw: file,
    preview: URL.createObjectURL(file),
  }));
  
  fileList.value = [...fileList.value, ...newFiles];
  emit('update:modelValue', fileList.value);
};

const removeFile = (index, event) => {
  event.stopPropagation();
  fileList.value.splice(index, 1);
  emit('update:modelValue', fileList.value);
};

const removeFileData = async (id) => {
  try {
    await axios.delete(`/gdrive/${props.resourceType}/${id}`);
    fileList.value = fileList.value.filter(file => file.id !== id);
    emit('update:modelValue', fileList.value);
  } catch (error) {
    console.error('Error removing file:', error);
  }
};

const zoomFile = (index, event) => {
  event.stopPropagation();
  const file = fileList.value[index];
  if (!file) return; // Validasi file sebelum render
  selectedFileUrl.value = file.preview || file.raw;
  selectedFileType.value = file.type;
  selectedFileName.value = file.name;
  if (modal) {
    modal.show();
  }
};


const cursorFile = (index, event) => {
  event.stopPropagation();
};

// Initialize file list with existing resources and new files
onMounted(() => {
  const modalElement = document.getElementById('pdfModal');
  if (modalElement) {
    modal = new bootstrap.Modal(modalElement);
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      fileList.value = newValue.map((file) => ({
        id: file.id,
        name: file.name,
        type: getFileType(file.name),
        size: file.size,
        raw: file.raw,
        preview: file.raw instanceof File ? URL.createObjectURL(file.raw) : file.raw,
      }));
    }
  },
  { deep: true }
);


</script>

<style scoped>
.fp {
  display: none;
}

.c-pointer {
  cursor: pointer;
}

.c-default {
  cursor: default;
}

.bottom-right {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.border-c {
  border: 1px solid #adaaaa;
}
</style>